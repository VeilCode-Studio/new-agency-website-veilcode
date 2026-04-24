import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterCampaigns } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const [row] = await db
      .select()
      .from(newsletterCampaigns)
      .where(eq(newsletterCampaigns.id, numId));
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/admin/newsletter/campaigns/[id]] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const { id: _id, createdAt: _ca, sentAt: _sa, sentCount: _sc, failedCount: _fc, status: _st, ...rest } = await req.json();
    const [row] = await db
      .update(newsletterCampaigns)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(newsletterCampaigns.id, numId))
      .returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/admin/newsletter/campaigns/[id]] PUT error:", err);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    await db.delete(newsletterCampaigns).where(eq(newsletterCampaigns.id, numId));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/admin/newsletter/campaigns/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
