# Global SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a phased SEO foundation for VeilCode Studio that supports organic discovery in Uganda, USA, UK, Canada, Australia, and future markets without thin duplicate pages.

**Architecture:** Keep the current backend-driven CMS model. Extend the existing `services` table for service SEO, keep `projects` and `blog_posts` as supporting content, add code-first location pages first, and only then introduce an admin-managed `seo_pages` table for scalable landing pages.

**Tech Stack:** Next.js App Router, TypeScript, Drizzle ORM, Neon Postgres, Tailwind CSS, Clerk-protected admin, server-only database access.

---

## Existing Context Internalized

- `docs/codex_prompt.md` requires a phased build: technical SEO, service detail pages, code-first country pages, then admin SEO pages.
- `docs/seo_prompt.md` defines the strategy: core services are Web Solutions, Mobile Applications, and AI Automation; Data Analytics and Social Marketing must not become headline service pages.
- `db/schema.ts` already has `services`, `projects`, and `blogPosts`.
- `services.id` is the current internal service key (`web`, `mobile`, `data`, `social`, `ai`).
- `projects.service` uses `serviceSlugEnum`, so the existing service IDs and enum should not be renamed in this work.
- Current sitemap is hardcoded in `app/sitemap.ts`.
- Blog and project detail pages have basic metadata, but not canonical URLs or JSON-LD.
- Admin forms use client components that POST to protected API routes. New admin SEO work should follow the same pattern.

## Database Adjustment

Do not replace the existing service IDs. Add SEO fields around the current schema.

### Modify `types/content.ts`

Add reusable JSONB types:

```ts
export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoPageCta = {
  label: string;
  href: string;
};
```

### Modify `db/schema.ts`

Extend `services` without breaking existing rows:

```ts
slug: text("slug").unique(),
seoTitle: text("seo_title"),
metaDescription: text("meta_description"),
h1: text("h1"),
supportingCapabilities: text("supporting_capabilities").array().default([]).notNull(),
faqs: jsonb("faqs").$type<SeoFaq[]>().default([]).notNull(),
seoEnabled: boolean("seo_enabled").default(false).notNull(),
```

Use these values:

- `web` -> `web-solutions`
- `mobile` -> `mobile-applications`
- `ai` -> `ai-automation`
- `data` -> no service detail page in this phase
- `social` -> no service detail page in this phase

Later, add the admin-controlled landing page table:

```ts
export const seoPageTypeEnum = pgEnum("seo_page_type", [
  "location",
  "service-location",
  "industry",
  "custom",
]);

export const seoPages = pgTable("seo_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  pageType: seoPageTypeEnum("page_type").notNull(),
  countryCode: text("country_code"),
  countryName: text("country_name"),
  serviceId: text("service_id"),
  title: text("title").notNull(),
  metaDescription: text("meta_description").notNull(),
  h1: text("h1").notNull(),
  heroCopy: text("hero_copy").notNull(),
  body: jsonb("body").$type<ContentBlock[]>().default([]).notNull(),
  faqs: jsonb("faqs").$type<SeoFaq[]>().default([]).notNull(),
  cta: jsonb("cta").$type<SeoPageCta>().notNull(),
  relatedServiceIds: text("related_service_ids").array().default([]).notNull(),
  relatedProjectSlugs: text("related_project_slugs").array().default([]).notNull(),
  relatedBlogSlugs: text("related_blog_slugs").array().default([]).notNull(),
  published: boolean("published").default(false).notNull(),
  indexable: boolean("indexable").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

Do not add hreflang, slug history, automated similarity detection, or SEO scoring in the first implementation.

---

## Task 1: SEO Types, Query Helpers, And Migrations

**Files:**
- Modify: `types/content.ts`
- Modify: `db/schema.ts`
- Modify: `queries/index.ts`
- Create later if useful: `queries/seo.ts`
- Generate: `migrations/*.sql`

- [ ] Add `SeoFaq` and `SeoPageCta` to `types/content.ts`.
- [ ] Add the new nullable/defaulted service SEO columns to `services`.
- [ ] Keep `serviceSlugEnum` unchanged because projects already depend on it.
- [ ] Add query helpers for published service detail pages:

```ts
export const getPublishedServiceBySlug = async (slug: string) => {
  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.slug, slug), eq(services.published, true), eq(services.seoEnabled, true)))
    .limit(1);

  return service ?? null;
};
```

- [ ] Add query helpers for sitemap data: all published services with `seoEnabled`, all published projects, all published blogs.
- [ ] Run `npx drizzle-kit generate`.
- [ ] Review the generated migration before applying it.

## Task 2: SEO Utility Layer

**Files:**
- Create: `lib/seo/site.ts`
- Create: `lib/seo/metadata.ts`
- Create: `lib/seo/jsonLd.ts`

- [ ] Create a single `SITE_URL` source using `https://veilcode.studio`.
- [ ] Add helpers for canonical URL creation.
- [ ] Add JSON-LD builders for `Organization`, `WebPage`, `Article`, `BreadcrumbList`, and `Service`.
- [ ] Return plain serializable objects from JSON-LD helpers.
- [ ] Keep JSON-LD rendering in server components/layouts.

## Task 3: Dynamic Sitemap And Metadata

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/layout.tsx`
- Modify: `app/(client)/blog/[slug]/page.tsx`
- Modify: `app/(client)/work/[slug]/page.tsx`

- [ ] Replace the hardcoded sitemap project list with database queries.
- [ ] Include home, core public pages, service detail pages, projects, blog posts, and later SEO pages.
- [ ] Use `updatedAt` or `publishedAt` for `lastModified`.
- [ ] Add canonical URLs to blog and project metadata.
- [ ] Add Article JSON-LD to blog posts.
- [ ] Add BreadcrumbList JSON-LD to blog and project detail pages.
- [ ] Keep `Organization` JSON-LD global in `app/layout.tsx`, but move object construction to `lib/seo/jsonLd.ts`.

## Task 4: Service Detail Pages

**Files:**
- Create: `app/(client)/services/[slug]/page.tsx`
- Create: `app/(client)/services/[slug]/_components/ServiceDetailHero.tsx`
- Create: `app/(client)/services/[slug]/_components/ServiceDetailBody.tsx`
- Create: `app/(client)/services/[slug]/_components/ServiceDetailFaq.tsx`
- Modify: `app/(client)/services/page.tsx`
- Modify: `components/extras/ServiceCard.tsx`
- Modify: `components/shared/Services.tsx`

- [ ] Implement `generateStaticParams` from services where `seoEnabled = true`.
- [ ] Implement `generateMetadata` using `seoTitle`, `metaDescription`, and canonical URL.
- [ ] Render only useful service pages for `web-solutions`, `mobile-applications`, and `ai-automation`.
- [ ] Use existing service fields for problem, approach, deliverables, stack, tags, and metric.
- [ ] Render `supportingCapabilities` and `faqs` from the new service fields.
- [ ] Add Service JSON-LD and BreadcrumbList JSON-LD.
- [ ] Link service cards to detail pages only when `seoEnabled` and `slug` exist.

## Task 5: Code-First Country Pages

**Files:**
- Create: `constants/locations.ts`
- Create: `app/(client)/locations/[country]/page.tsx`
- Create: `app/(client)/locations/[country]/_components/LocationHero.tsx`
- Create: `app/(client)/locations/[country]/_components/LocationBody.tsx`
- Modify: `app/sitemap.ts`
- Modify: `components/shared/Footer.tsx`

- [ ] Define five unique country configs: Uganda, United States, United Kingdom, Canada, Australia.
- [ ] Include unique market pain points, timezone expectations, remote delivery notes, service focus, FAQs, and CTA copy per country.
- [ ] Render related published services and projects from backend data.
- [ ] Add canonical metadata, WebPage JSON-LD, and BreadcrumbList JSON-LD.
- [ ] Add sitemap entries for the five country pages.
- [ ] Add footer/internal links to the country pages without overwhelming the footer.

## Task 6: Admin-Managed SEO Pages

**Files:**
- Modify: `db/schema.ts`
- Modify: `types/content.ts`
- Create: `app/(admin)/admin/seo-pages/page.tsx`
- Create: `app/(admin)/admin/seo-pages/new/page.tsx`
- Create: `app/(admin)/admin/seo-pages/[id]/edit/page.tsx`
- Create: `components/admin/seo-pages/SeoPagesTable.tsx`
- Create: `components/admin/seo-pages/SeoPageForm.tsx`
- Create: `app/api/admin/seo-pages/route.ts`
- Create: `app/api/admin/seo-pages/[id]/route.ts`
- Modify: `components/admin/Sidebar.tsx`
- Create: `app/(client)/seo/[...slug]/page.tsx` or map `seo_pages.slug` to approved route prefixes.

- [ ] Add the `seo_pages` table only after Tasks 1-5 are working.
- [ ] Follow the existing admin CRUD pattern used by services and blog posts.
- [ ] Add admin fields for title, meta description, H1, hero copy, body blocks, FAQs, CTA, related services, related projects, related blog posts, published, and indexable.
- [ ] Validate that published/indexable pages have required metadata, body content, CTA, and a non-empty H1.
- [ ] Add dynamic sitemap entries for published and indexable SEO pages.
- [ ] Render admin SEO pages from server components only.

## Task 7: Verification

**Files:**
- All changed files

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Fix all TypeScript, lint, and build errors.
- [ ] Manually inspect generated sitemap output.
- [ ] Manually check at least one service page, one blog post, one project, and one location page.
- [ ] Confirm no client component imports `db`, `db/schema` as runtime code, or server-only query helpers.

## Deferred Work

- Hreflang generation.
- Slug history and 301 redirect management.
- Automated duplicate/similarity detection.
- SEO scoring inside admin.
- Full country-service combination pages.
- Search Console submission automation.
