# VeilCode Studio SEO Implementation

You are working inside the VeilCode Studio agency website codebase.

Goal:
Implement a phased SEO foundation for VeilCode Studio so the website can rank organically in target markets such as Uganda, USA, UK, Canada, and Australia without creating thin duplicate pages.

Important context:
VeilCode Studio is narrowing its core services to:
1.Web Solutions
2.Mobile Applications
3.AI Automation

Data Analytics, Technical SEO, Cloud Infrastructure, API Integrations, Performance Optimization, and Reporting should be treated as supporting capabilities, not standalone headline services.

Do not create low quality location pages that only swap country names. Each SEO page must be useful, specific, and people first. Google’s guidance prioritizes helpful content created for users, not content made mainly to manipulate rankings.

Current stack:
Next.js App Router
TypeScript
Drizzle ORM
Neon Postgres
Tailwind CSS
Admin dashboard already exists
Services, projects, and blog posts already exist in the database
Use server only database access
Do not fetch NeonDB directly from client components

Implementation approach:
Build this in phases. Do not overbuild the full SEO CMS immediately.

Phase 1:
Create a strong technical SEO foundation.

Tasks:

1. Make sitemap database driven.
2. Include published services, projects, blog posts, and future SEO landing pages.
3. Use updatedAt as lastModified where available.
4. Add canonical URLs to dynamic metadata.
5. Add metadata for service detail pages, project detail pages, and blog detail pages.
6. Add basic JSON LD helpers for:
   Organization
   WebPage
   Article
   BreadcrumbList
   Service
7. Add Organization JSON LD globally.
8. Add Article JSON LD to blog posts.
9. Add BreadcrumbList JSON LD to nested pages.
10. Keep all database queries in server only files.

Phase 2:
Create service detail pages.

Routes:
app/(client)/services/[slug]/page.tsx

Pages needed:
services/web-solutions
services/mobile-applications
services/ai-automation

Each service page should render:
Hero
Problem section
Approach section
Deliverables
Supporting capabilities
Relevant projects
FAQs
CTA
SEO metadata
Canonical URL
Service JSON LD
Breadcrumb JSON LD

Do not create service pages for Data Analytics or Social Marketing as headline services.

Phase 3:
Create country landing pages as code first, not admin managed yet.

Routes:
app/(client)/locations/[country]/page.tsx

Initial pages:
locations/uganda
locations/united-states
locations/united-kingdom
locations/canada
locations/australia

Each country page should include:
Country specific hero
Market specific business pain points
Remote delivery process
Relevant services
Relevant case studies
FAQs
CTA
Metadata
Canonical URL
Breadcrumb JSON LD
WebPage JSON LD

Avoid duplicate page templates with only country names changed. Each country page must include unique copy.

Phase 4:
Only after the above works, add an admin controlled seoPages or landingPages table.

Minimum database fields:
id
slug
pageType
title
metaDescription
h1
heroCopy
body
faqs
ctaText
canonicalUrl
published
indexable
createdAt
updatedAt

Do not add hreflang, slug history, similarity detection, or complex SEO scoring yet. Leave comments or TODOs for future phases.

Coding standards:
Use TypeScript strictly.
Use Drizzle types.
Use import "server-only" in database query modules.
Do not import database schema or queries into client components except through type only imports where safe.
Server components should fetch data.
Client components should receive only the props they render.
Avoid full database objects in client components when only small data is needed.
Keep reusable SEO helpers in lib/seo.
Keep queries in queries or db/queries.
Keep JSON LD functions typed and reusable.

Deliverables:

1. New or updated sitemap.ts.
2. SEO metadata helpers.
3. JSON LD helper utilities.
4. Service detail pages.
5. Location landing pages.
6. Updated internal links from homepage, services page, footer, and related sections.
7. No broken TypeScript build.
8. No client side database access.
9. No duplicate thin SEO pages.

Before coding:
Inspect the current folder structure.
Find existing queries.
Find current sitemap.ts.
Find current service, project, and blog route implementations.
Find existing metadata patterns.
Then propose the exact files to create or edit before making changes.

After coding:
Run TypeScript checks.
Run build.
Fix all errors.
Return a concise summary of changed files and explain any TODOs left.
