import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import type { SeoPage } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { parseSeoBodyText } from "@/lib/seo/seoPages";

export const runtime = "nodejs";

type SeoPageType = SeoPage["pageType"];

function isSeoPageType(value: unknown): value is SeoPageType {
  return (
    value === "location" ||
    value === "service-location" ||
    value === "industry" ||
    value === "custom"
  );
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNullableString(value: unknown) {
  const text = readString(value);
  return text.length > 0 ? text : null;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeBody(body: Record<string, unknown>, current?: SeoPage) {
  return {
    slug: body.slug !== undefined ? readString(body.slug) : current?.slug,
    pageType:
      body.pageType !== undefined
        ? isSeoPageType(body.pageType)
          ? body.pageType
          : current?.pageType ?? "location"
        : current?.pageType ?? "location",
    countryCode:
      body.countryCode !== undefined
        ? readNullableString(body.countryCode)
        : current?.countryCode ?? null,
    countryName:
      body.countryName !== undefined
        ? readNullableString(body.countryName)
        : current?.countryName ?? null,
    serviceId:
      body.serviceId !== undefined
        ? readNullableString(body.serviceId)
        : current?.serviceId ?? null,
    title: body.title !== undefined ? readString(body.title) : current?.title,
    metaDescription:
      body.metaDescription !== undefined
        ? readString(body.metaDescription)
        : current?.metaDescription,
    h1: body.h1 !== undefined ? readString(body.h1) : current?.h1,
    heroCopy: body.heroCopy !== undefined ? readString(body.heroCopy) : current?.heroCopy,
    body:
      body.bodyText !== undefined
        ? parseSeoBodyText(readString(body.bodyText))
        : current?.body ?? [],
    faqs: body.faqs !== undefined ? (Array.isArray(body.faqs) ? body.faqs : []) : current?.faqs ?? [],
    cta:
      body.ctaLabel !== undefined || body.ctaHref !== undefined
        ? {
            label:
              body.ctaLabel !== undefined
                ? readString(body.ctaLabel) || "Let's Discuss your Project"
                : current?.cta?.label ?? "Let's Discuss your Project",
            href:
              body.ctaHref !== undefined
                ? readString(body.ctaHref) || "/start"
                : current?.cta?.href ?? "/start",
          }
        : current?.cta ?? { label: "Let's Discuss your Project", href: "/start" },
    relatedServiceIds:
      body.relatedServiceIds !== undefined
        ? readStringArray(body.relatedServiceIds)
        : current?.relatedServiceIds ?? [],
    relatedProjectSlugs:
      body.relatedProjectSlugs !== undefined
        ? readStringArray(body.relatedProjectSlugs)
        : current?.relatedProjectSlugs ?? [],
    relatedBlogSlugs:
      body.relatedBlogSlugs !== undefined
        ? readStringArray(body.relatedBlogSlugs)
        : current?.relatedBlogSlugs ?? [],
    published: body.published !== undefined ? Boolean(body.published) : current?.published ?? false,
    indexable:
      body.indexable !== undefined ? Boolean(body.indexable) : current?.indexable ?? true,
  };
}

function validate(body: ReturnType<typeof normalizeBody>) {
  const missing = [
    !body.slug && "slug",
    !body.title && "title",
    !body.metaDescription && "meta description",
    !body.h1 && "h1",
    !body.heroCopy && "hero copy",
    !body.cta.label && "cta label",
    !body.cta.href && "cta href",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}

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

    const body = normalizeBody(await req.json(), current);
    validate(body);

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

    const body = normalizeBody(await req.json(), current);
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
