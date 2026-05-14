import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { parseSeoBodyText } from "@/lib/seo/seoPages";
import type { SeoPage } from "@/db/schema";

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

function normalizeBody(body: Record<string, unknown>) {
  return {
    slug: readString(body.slug),
    pageType: isSeoPageType(body.pageType) ? body.pageType : "location",
    countryCode: readNullableString(body.countryCode),
    countryName: readNullableString(body.countryName),
    serviceId: readNullableString(body.serviceId),
    title: readString(body.title),
    metaDescription: readString(body.metaDescription),
    h1: readString(body.h1),
    heroCopy: readString(body.heroCopy),
    body: parseSeoBodyText(readString(body.bodyText)),
    faqs: Array.isArray(body.faqs) ? body.faqs : [],
    cta: {
      label: readString(body.ctaLabel) || "Let's Discuss your Project",
      href: readString(body.ctaHref) || "/start",
    },
    relatedServiceIds: readStringArray(body.relatedServiceIds),
    relatedProjectSlugs: readStringArray(body.relatedProjectSlugs),
    relatedBlogSlugs: readStringArray(body.relatedBlogSlugs),
    published: Boolean(body.published),
    indexable: body.indexable === false ? false : true,
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

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(seoPages)
      .orderBy(asc(seoPages.updatedAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/admin/seo-pages] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch SEO pages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = normalizeBody(await req.json());
    validate(body);

    const [created] = await db
      .insert(seoPages)
      .values(body)
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[api/admin/seo-pages] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create SEO page" },
      { status: 500 },
    );
  }
}
