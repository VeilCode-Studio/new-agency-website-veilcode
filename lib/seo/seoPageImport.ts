import { db } from "@/db/drizzle";
import { seoPages, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { normalizeSeoPageInput, type SeoPageInput } from "@/lib/seo/seoPageInput";

export type SeoPageImportIssue = {
  slug: string;
  field?: string;
  message: string;
  level: "error" | "warning";
};

export type SeoPageImportItem = {
  input: SeoPageInput;
  action: "create" | "update";
  issues: SeoPageImportIssue[];
};

export type SeoPageImportSummary = {
  total: number;
  create: number;
  update: number;
  errors: number;
  warnings: number;
  items: SeoPageImportItem[];
};

function readPagesPayload(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "pages" in payload) {
    const pages = (payload as { pages?: unknown }).pages;
    return Array.isArray(pages) ? pages : [];
  }
  return [];
}

function addIssue(
  issues: SeoPageImportIssue[],
  slug: string,
  level: SeoPageImportIssue["level"],
  message: string,
  field?: string,
) {
  issues.push({ slug, level, message, field });
}

function isValidCountryCode(value: string | null) {
  return value === null || /^[A-Z]{2}$/.test(value);
}

export async function analyzeSeoPageImport(payload: unknown) {
  const entries = readPagesPayload(payload);
  const issues: SeoPageImportIssue[] = [];

  if (entries.length === 0) {
    return {
      total: 0,
      create: 0,
      update: 0,
      errors: 1,
      warnings: 0,
      items: [],
      issues: [{ slug: "", level: "error" as const, message: "No SEO pages were provided" }],
    };
  }

  const existingPages = await db.select({ slug: seoPages.slug }).from(seoPages);
  const existingSlugs = new Set(existingPages.map((page) => page.slug));
  const publishedServices = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.published, true));
  const allowedServiceIds = new Set(publishedServices.map((service) => service.id));
  const seenSlugs = new Set<string>();

  const items: SeoPageImportItem[] = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      addIssue(issues, "", "error", "Each SEO page must be an object");
      continue;
    }

    const input = normalizeSeoPageInput(entry as Record<string, unknown>);
    const itemIssues: SeoPageImportIssue[] = [];

    if (!input.slug) {
      addIssue(itemIssues, "", "error", "Slug is required", "slug");
    }

    if (seenSlugs.has(input.slug)) {
      addIssue(itemIssues, input.slug, "error", "Duplicate slug appears more than once in the import");
    }
    seenSlugs.add(input.slug);

    if (!input.title) addIssue(itemIssues, input.slug, "error", "Title is required", "title");
    if (!input.metaDescription) {
      addIssue(itemIssues, input.slug, "error", "Meta description is required", "metaDescription");
    }
    if (!input.h1) addIssue(itemIssues, input.slug, "error", "H1 is required", "h1");
    if (!input.heroCopy) addIssue(itemIssues, input.slug, "error", "Hero copy is required", "heroCopy");
    if (!input.cta.label) addIssue(itemIssues, input.slug, "error", "CTA label is required", "ctaLabel");
    if (!input.cta.href) addIssue(itemIssues, input.slug, "error", "CTA href is required", "ctaHref");

    if (!isValidCountryCode(input.countryCode)) {
      addIssue(itemIssues, input.slug, "error", "Country code must be a 2-letter ISO code", "countryCode");
    }

    if (input.serviceId && !allowedServiceIds.has(input.serviceId)) {
      addIssue(itemIssues, input.slug, "error", `Unsupported service ID: ${input.serviceId}`, "serviceId");
    }

    const invalidRelatedServiceIds = input.relatedServiceIds.filter((id) => !allowedServiceIds.has(id));
    if (invalidRelatedServiceIds.length > 0) {
      addIssue(
        itemIssues,
        input.slug,
        "warning",
        `Unknown related service IDs: ${invalidRelatedServiceIds.join(", ")}`,
        "relatedServiceIds",
      );
    }

    if (input.pageType === "service-location" && !input.serviceId) {
      addIssue(itemIssues, input.slug, "warning", "Service-location pages usually need a serviceId");
    }

    if (input.pageType === "location" && input.serviceId) {
      addIssue(itemIssues, input.slug, "warning", "Location pages normally leave serviceId empty");
    }

    const action = existingSlugs.has(input.slug) ? "update" : "create";
    items.push({ input, action, issues: itemIssues });
  }

  const summary: SeoPageImportSummary = {
    total: items.length,
    create: items.filter((item) => item.action === "create").length,
    update: items.filter((item) => item.action === "update").length,
    errors: items.reduce((count, item) => count + item.issues.filter((i) => i.level === "error").length, 0),
    warnings: items.reduce((count, item) => count + item.issues.filter((i) => i.level === "warning").length, 0),
    items,
  };

  return summary;
}

export async function importSeoPagesFromPayload(payload: unknown) {
  const summary = await analyzeSeoPageImport(payload);

  if (summary.errors > 0) {
    const firstError = summary.items
      .flatMap((item) => item.issues)
      .find((issue) => issue.level === "error");
    throw new Error(firstError?.message ?? "Import contains validation errors");
  }

  const results: { slug: string; action: "created" | "updated" }[] = [];

  for (const item of summary.items) {
    const body = item.input;
    const existing = await db
      .select({ id: seoPages.id })
      .from(seoPages)
      .where(eq(seoPages.slug, body.slug))
      .limit(1);

    if (existing[0]) {
      await db
        .update(seoPages)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(seoPages.slug, body.slug));

      results.push({ slug: body.slug, action: "updated" });
      continue;
    }

    await db.insert(seoPages).values({
      ...body,
      updatedAt: new Date(),
    });
    results.push({ slug: body.slug, action: "created" });
  }

  return { summary, results };
}
