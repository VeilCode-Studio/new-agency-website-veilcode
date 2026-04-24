import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterCampaigns } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(newsletterCampaigns)
      .orderBy(desc(newsletterCampaigns.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/admin/newsletter/campaigns] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const [row] = await db
      .insert(newsletterCampaigns)
      .values({
        subject: body.subject,
        previewText: body.previewText ?? "",
        type: body.type,
        status: "draft",
        body: body.body ?? [],
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("[api/admin/newsletter/campaigns] POST error:", err);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
