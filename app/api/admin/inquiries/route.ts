import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { clientInquiries } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(clientInquiries)
      .orderBy(desc(clientInquiries.createAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/admin/inquiries] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
