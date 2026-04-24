"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterSubscriptionTable, newsletterCampaigns } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function toggleSubscriberAction(
  id: number,
  subscribed: boolean,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db
      .update(newsletterSubscriptionTable)
      .set({ subscribed })
      .where(eq(newsletterSubscriptionTable.id, id));
    revalidatePath("/admin/newsletter");
    revalidatePath("/admin/newsletter/subscribers");
    return {};
  } catch (err) {
    console.error("[admin/newsletter] toggleSubscriber error:", err);
    return { error: "Failed to update subscriber" };
  }
}

export async function deleteSubscriberAction(id: number): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db
      .delete(newsletterSubscriptionTable)
      .where(eq(newsletterSubscriptionTable.id, id));
    revalidatePath("/admin/newsletter");
    revalidatePath("/admin/newsletter/subscribers");
    return {};
  } catch (err) {
    console.error("[admin/newsletter] deleteSubscriber error:", err);
    return { error: "Failed to delete subscriber" };
  }
}

export async function deleteCampaignAction(id: number): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db.delete(newsletterCampaigns).where(eq(newsletterCampaigns.id, id));
    revalidatePath("/admin/newsletter");
    revalidatePath("/admin/newsletter/campaigns");
    return {};
  } catch (err) {
    console.error("[admin/newsletter] deleteCampaign error:", err);
    return { error: "Failed to delete campaign" };
  }
}

export async function sendCampaignAction(
  id: number,
): Promise<{ sent?: number; failed?: number; error?: string }> {
  try {
    await guardAdmin();
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/admin/newsletter/campaigns/${id}/send`,
      { method: "POST" },
    );
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Send failed" };
    revalidatePath("/admin/newsletter");
    revalidatePath("/admin/newsletter/campaigns");
    return { sent: data.sent, failed: data.failed };
  } catch (err) {
    console.error("[admin/newsletter] sendCampaign error:", err);
    return { error: "Failed to trigger send" };
  }
}
