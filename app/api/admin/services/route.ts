import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/admin/services] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const [created] = await db
      .insert(services)
      .values({
        id:             body.id,
        number:         body.number,
        icon:           body.icon,
        title:          body.title,
        slug:           body.slug || null,
        seoTitle:       body.seoTitle || null,
        metaDescription:body.metaDescription || null,
        h1:             body.h1 || null,
        tagline:        body.tagline,
        desc:           body.desc,
        intro:          body.intro,
        challenge:      body.challenge,
        approach:       body.approach,
        bullets:        body.bullets ?? [],
        deliverables:   body.deliverables    ?? [],
        stack:          body.stack ?? [],
        tags:           body.tags ?? [],
        metric:         body.metric,
        metricLabel:    body.metricLabel,
        metricSub:      body.metricSub,
        supportingCapabilities: body.supportingCapabilities ?? [],
        faqs:           body.faqs ?? [],
        seoEnabled:     body.seoEnabled ?? false,
        cardClasses:    body.cardClasses,
        overviewClasses:body.overviewClasses,
        deepDiveClasses:body.deepDiveClasses,
        sortOrder:      body.sortOrder       ?? 0,
        published:      body.published       ?? true,
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[api/admin/services] POST error:", err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
