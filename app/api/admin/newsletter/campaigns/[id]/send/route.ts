import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterCampaigns, newsletterSubscriptionTable } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { resend } from "@/lib/resend";
import { buildCampaignHtml, generateUnsubscribeToken } from "@/lib/email/campaignTemplate";

export const runtime = "nodejs";

const BATCH_SIZE = 50;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const [campaign] = await db
      .select()
      .from(newsletterCampaigns)
      .where(eq(newsletterCampaigns.id, numId));

    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    if (campaign.status === "sent") return NextResponse.json({ error: "Already sent" }, { status: 409 });
    if (campaign.status === "sending") return NextResponse.json({ error: "Send in progress" }, { status: 409 });

    //  mark as sending
    await db
      .update(newsletterCampaigns)
      .set({ status: "sending", updatedAt: new Date() })
      .where(eq(newsletterCampaigns.id, numId));

    const subscribers = await db
      .select({ id: newsletterSubscriptionTable.id, email: newsletterSubscriptionTable.email })
      .from(newsletterSubscriptionTable)
      .where(eq(newsletterSubscriptionTable.subscribed, true));

    if (subscribers.length === 0) {
      await db
        .update(newsletterCampaigns)
        .set({ status: "sent", sentAt: new Date(), sentCount: 0, updatedAt: new Date() })
        .where(eq(newsletterCampaigns.id, numId));
      return NextResponse.json({ sent: 0, failed: 0 });
    }

    const frontendUrl = process.env.FRONTEND_URL ?? "";
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const emails = batch.map((sub) => {
        const token = generateUnsubscribeToken(sub.email);
        const unsubUrl = `${frontendUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${token}`;
        return {
          from: "VeilCode <frank@veilcode.studio>",
          to: sub.email,
          subject: campaign.subject,
          html: buildCampaignHtml({
            subject: campaign.subject,
            previewText: campaign.previewText,
            body: campaign.body,
            toEmail: sub.email,
            unsubscribeUrl: unsubUrl,
            frontendUrl,
          }),
        };
      });

      try {
        const { error } = await resend.batch.send(emails);
        if (error) {
          totalFailed += batch.length;
        } else {
          totalSent += batch.length;
        }
      } catch {
        totalFailed += batch.length;
      }
    }

    const finalStatus = totalFailed > 0 && totalSent === 0 ? "failed" : "sent";
    await db
      .update(newsletterCampaigns)
      .set({
        status: finalStatus,
        sentAt: new Date(),
        sentCount: totalSent,
        failedCount: totalFailed,
        updatedAt: new Date(),
      })
      .where(eq(newsletterCampaigns.id, numId));

    return NextResponse.json({ sent: totalSent, failed: totalFailed });
  } catch (err) {
    console.error("[api/admin/newsletter/campaigns/[id]/send] POST error:", err);
    await db
      .update(newsletterCampaigns)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(newsletterCampaigns.id, numId))
      .catch(() => undefined);
    return NextResponse.json({ error: "Failed to send campaign" }, { status: 500 });
  }
}
