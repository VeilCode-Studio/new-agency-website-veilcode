import type { ContentBlock } from "@/constants/blog";
import type { SeoPage } from "@/db/schema";
import type { SeoFaq, SeoPageCta } from "@/types/content";
import { parseSeoBodyText } from "@/lib/seo/seoPages";

export type SeoPageInput = {
  slug: string;
  pageType: SeoPage["pageType"];
  countryCode: string | null;
  countryName: string | null;
  serviceId: string | null;
  title: string;
  metaDescription: string;
  h1: string;
  heroCopy: string;
  body: ContentBlock[];
  faqs: SeoFaq[];
  cta: SeoPageCta;
  relatedServiceIds: string[];
  relatedProjectSlugs: string[];
  relatedBlogSlugs: string[];
  published: boolean;
  indexable: boolean;
};

function isSeoPageType(value: unknown): value is SeoPage["pageType"] {
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
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeSeoPageInput(
  body: Record<string, unknown>,
  current?: SeoPage,
): SeoPageInput {
  return {
    slug: body.slug !== undefined ? readString(body.slug) : current?.slug ?? "",
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
    title: body.title !== undefined ? readString(body.title) : current?.title ?? "",
    metaDescription:
      body.metaDescription !== undefined
        ? readString(body.metaDescription)
        : current?.metaDescription ?? "",
    h1: body.h1 !== undefined ? readString(body.h1) : current?.h1 ?? "",
    heroCopy: body.heroCopy !== undefined ? readString(body.heroCopy) : current?.heroCopy ?? "",
    body:
      body.bodyText !== undefined
        ? parseSeoBodyText(readString(body.bodyText))
        : current?.body ?? [],
    faqs:
      body.faqs !== undefined
        ? (Array.isArray(body.faqs) ? (body.faqs as SeoFaq[]) : [])
        : current?.faqs ?? [],
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
    published: readBoolean(body.published, current?.published ?? false),
    indexable: readBoolean(body.indexable, current?.indexable ?? true),
  };
}

export function validateSeoPageInput(body: SeoPageInput) {
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
