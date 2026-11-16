# Regional location hreflang

Implemented 21 October 2026 for the five English location pages.

## Implementation

`app/(client)/locations/[country]/page.tsx` builds one set of regional alternate URLs from the existing location markets and their ISO country codes. It extends the existing Next.js metadata's `alternates` object, preserving the current page's canonical URL.

Every location page emits the following complete set, including its own URL:

| Language / region | URL |
| --- | --- |
| en-UG | https://www.veilcode.studio/locations/uganda |
| en-US | https://www.veilcode.studio/locations/united-states |
| en-GB | https://www.veilcode.studio/locations/united-kingdom |
| en-CA | https://www.veilcode.studio/locations/canada |
| en-AU | https://www.veilcode.studio/locations/australia |

Update (SEO audit follow-up): the set also includes `x-default`, pointing to https://www.veilcode.studio/locations. The `/locations` directory page emits the identical set so the annotations stay reciprocal. The set is defined once in `lib/seo/locationAlternates.ts` and used by both the location pages and the directory.

These alternate URLs are reciprocal and fully qualified. The homepage and other page types remain outside this regional group. No automatic redirects were introduced. HTML metadata is the single hreflang source; the same annotations are not duplicated in the sitemap.

`app/sitemap.ts` updates the five location pages' last-modified dates to reflect the metadata change. All other sitemap dates and URLs remain unchanged.

All current location pages are written in English. If another language is introduced, adapt the language mapping to that page's actual content language.

## Verification

- Production build passed, including TypeScript and generation of all 41 static pages.
- All 66 existing automated tests, targeted ESLint and `git diff --check` passed.
- Production-rendered HTML was checked with JavaScript disabled on all five location pages, the homepage, location directory and web-solutions service page. All five regional pages returned HTTP 200 and exactly the same five alternate links, including themselves.
- Canonical URLs, page titles, all other name/property metadata, full main text including FAQs/pricing, internal links and JSON-LD matched the before-change snapshots on all eight pages after whitespace normalization. The homepage, location directory and service page gained no regional annotations.
- Raw US-page HTML served to Googlebot, bingbot and Twitterbot contained all five alternate links in the HTML head.
- An unknown market returned HTTP 404 without regional alternates. The sitemap returned HTTP 200 and retained all five canonical location URLs.
- No dependencies, client JavaScript, requests, content, layout, theme, authentication or rendering/cache-policy changes were introduced.

Review: plan alignment, system integrity and production verification passed. No unresolved implementation issues were found. Search Console country-level impressions and clicks can be monitored after deployment and recrawling; no ranking or traffic outcome is claimed by these local checks.

Evidence: [production metadata results](verification/location-hreflang-results.json).

References: [Google regional alternate guidelines](https://developers.google.com/search/docs/specialty/international/localized-versions), [Next.js metadata alternates](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates).
