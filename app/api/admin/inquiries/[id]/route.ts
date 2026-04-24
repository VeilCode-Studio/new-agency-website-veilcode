import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { clientInquiries } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    await db.delete(clientInquiries).where(eq(clientInquiries.id, numId));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/admin/inquiries/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
