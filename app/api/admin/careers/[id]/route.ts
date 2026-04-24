import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { jobOpenings } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const [row] = await db.select().from(jobOpenings).where(eq(jobOpenings.id, numId)).limit(1);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/admin/careers/[id]] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch job opening" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const { id: _id, createdAt: _ca, ...rest } = body;
    const [updated] = await db
      .update(jobOpenings)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(jobOpenings.id, numId))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[api/admin/careers/[id]] PUT error:", err);
    return NextResponse.json({ error: "Failed to update job opening" }, { status: 500 });
  }
}

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
    await db.delete(jobOpenings).where(eq(jobOpenings.id, numId));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/admin/careers/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete job opening" }, { status: 500 });
  }
}
