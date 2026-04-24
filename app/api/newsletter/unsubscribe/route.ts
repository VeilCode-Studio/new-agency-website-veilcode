import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterSubscriptionTable } from "@/db/schema";
import { verifyUnsubscribeToken } from "@/lib/email/campaignTemplate";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse("Invalid or expired unsubscribe link.", { status: 400 });
  }

  try {
    await db
      .update(newsletterSubscriptionTable)
      .set({ subscribed: false })
      .where(eq(newsletterSubscriptionTable.email, email));

    const frontendUrl = process.env.FRONTEND_URL ?? "";
    return NextResponse.redirect(`${frontendUrl}/?unsubscribed=1`);
  } catch (err) {
    console.error("[newsletter/unsubscribe]", err);
    return new NextResponse("Something went wrong. Please try again.", { status: 500 });
  }
}
