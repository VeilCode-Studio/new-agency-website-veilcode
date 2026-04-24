import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterSubscriptionTable } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(newsletterSubscriptionTable)
      .orderBy(desc(newsletterSubscriptionTable.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/admin/newsletter/subscribers] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
