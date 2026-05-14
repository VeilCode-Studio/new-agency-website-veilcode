import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { normalizeSeoPageInput, validateSeoPageInput } from "@/lib/seo/seoPageInput";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const [row] = await db.select().from(seoPages).where(eq(seoPages.id, numId)).limit(1);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (error) {
    console.error("[api/admin/seo-pages/[id]] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch SEO page" }, { status: 500 });
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
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const [current] = await db.select().from(seoPages).where(eq(seoPages.id, numId)).limit(1);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = normalizeSeoPageInput(await req.json(), current);
    validateSeoPageInput(body);

    const [updated] = await db
      .update(seoPages)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(seoPages.id, numId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[api/admin/seo-pages/[id]] PUT error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update SEO page" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const [current] = await db.select().from(seoPages).where(eq(seoPages.id, numId)).limit(1);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = normalizeSeoPageInput(await req.json(), current);
    const [updated] = await db
      .update(seoPages)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(seoPages.id, numId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[api/admin/seo-pages/[id]] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update SEO page" }, { status: 500 });
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
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await db.delete(seoPages).where(eq(seoPages.id, numId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/admin/seo-pages/[id]] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete SEO page" }, { status: 500 });
  }
}
