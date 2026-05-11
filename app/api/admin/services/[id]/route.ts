import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

function textArray(arr: unknown[]) {
  const vals = arr.map(String);
  if (!vals.length) return sql`ARRAY[]::text[]`;
  return sql`ARRAY[${sql.join(vals.map((v) => sql`${v}`), sql`, `)}]::text[]`;
}

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const [row] = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/admin/services/[id]] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const [updated] = await db
      .update(services)
      .set({
        number:         body.number,
        icon:           body.icon,
        title:          body.title,
        tagline:        body.tagline,
        desc:           body.desc,
        intro:          body.intro,
        challenge:      body.challenge,
        approach:       body.approach,
        bullets:        textArray(body.bullets        ?? []) as unknown as string[],
        deliverables:   body.deliverables    ?? [],
        stack:          textArray(body.stack          ?? []) as unknown as string[],
        tags:           textArray(body.tags           ?? []) as unknown as string[],
        metric:         body.metric,
        metricLabel:    body.metricLabel,
        metricSub:      body.metricSub,
        cardClasses:    body.cardClasses,
        overviewClasses:body.overviewClasses,
        deepDiveClasses:body.deepDiveClasses,
        sortOrder:      body.sortOrder       ?? 0,
        published:      body.published       ?? true,
        updatedAt:      new Date(),
      })
      .where(eq(services.id, id))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[api/admin/services/[id]] PUT error:", err);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await db.delete(services).where(eq(services.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/admin/services/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
