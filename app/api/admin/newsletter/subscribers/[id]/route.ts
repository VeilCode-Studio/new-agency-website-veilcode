import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterSubscriptionTable } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const [updated] = await db
      .update(newsletterSubscriptionTable)
      .set({ subscribed: body.subscribed })
      .where(eq(newsletterSubscriptionTable.id, numId))
      .returning();
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[api/admin/newsletter/subscribers/[id]] PATCH error:", err);
    return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 });
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
    await db
      .delete(newsletterSubscriptionTable)
      .where(eq(newsletterSubscriptionTable.id, numId));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/admin/newsletter/subscribers/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
