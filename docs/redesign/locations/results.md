# Location redesign results — 20 October 2026

The Uganda, United States, United Kingdom, Canada, and Australia pages now follow the homepage design system. Light, linen, midnight, and dark remain supported. A new `/locations` index fixes the existing breadcrumb's missing destination.

The existing dynamic country route, parallel queries, metadata helpers, CMS models, and query-failure recovery remain intact. Presentation is server-rendered; the location-specific motion boundary and client hero were removed. Portfolio images use responsive Next Image rendering with reserved space and lazy loading. One shared studio illustration loads eagerly with high priority. Mobile places delivery assurances before the illustration. Client, own-product, and concept work are labeled honestly.

## Validation

| Check | Result |
| --- | --- |
| Full `npm run build` and TypeScript | Passed; all 41 static pages generated, with the temporary database transport described below |
| Existing Node regression tests | 43 passed |
| Full ESLint | 0 errors; 18 pre-existing warnings outside this change |
| Focused location/tooling ESLint | Passed |
| Accessibility | 20 country/theme WCAG A/AA axe audits passed; expanded FAQs and the location index also passed |
| Responsive layout | All five countries passed at 1440×900, 1280×720, 768×1024, 390×844, and 320×740; no overflow and both hero CTAs visible |
| Interactions | FAQ keyboard opening/closing, mobile menu and Escape, actual theme selection and persistence passed |
| Without JavaScript | All five pages retained content, links, and native FAQ operation |
| SEO | Unique titles/descriptions, canonical/social metadata, business/WebPage/breadcrumb JSON-LD, one H1, and indexable responses passed |
| Routes | All 21 internal content destinations returned 200; invalid market returned 404/noindex; hub and sitemap passed |
| Images | Responsive optimized sources loaded; one high-priority eager hero and lazy portfolio media verified; five existing social cards are 1200×630 and 54–76KB |
| Shared UI | Homepage/location navigation, persisted linen theme, and reduced-motion behavior passed |
| Latest full browser matrix | 0 page errors; see the intermittent observation below |

No live form, chat, or mailing-list writes were performed. Verification intercepts API writes. No admin application code, dependencies, database content, or deployment was changed.

## Production-build Lighthouse

Three simulated mobile runs and one desktop run per country. The table reports mobile medians. Accessibility, best practices, and SEO scored **100 in every release run**. Every desktop performance score was **100**.

| Country | Mobile performance | Mobile LCP | Mobile TBT | CLS | Mobile transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Uganda | 95 | 2.838s | 35ms | 0 | 371.3KiB |
| United States | 96 | 2.831s | 30.5ms | 0 | 375.0KiB |
| United Kingdom | 96 | 2.820s | 26ms | 0 | 373.3KiB |
| Canada | 96 | 2.673s | 27.5ms | 0 | 373.1KiB |
| Australia | 97 | 2.679s | 31.5ms | 0 | 372.5KiB |

The strict **2.5-second mobile LCP budget remains open for all five countries**. The audit deliberately records those failures and sets a failing exit status; the threshold was not loosened. Other enforced budgets passed: mobile performance ≥90, desktop ≥95, mobile TBT ≤200ms, CLS ≤0.1, and accessibility/best-practices/SEO =100. LCP is the studio image in these mobile measurements. Discovery, eager loading, high priority, and image-sizing diagnostics now pass. A synchronous-decoding experiment did not improve results consistently and was removed.

The only failed binary diagnostic in release reports is back/forward cache restoration, because the preserved dynamic route uses `no-store`. Lighthouse describes this policy reason as not actionable. No caching policy was changed to improve the score.

## Environment and observations

Direct database calls from Next workers repeatedly timed out in this session, while standalone read probes worked. Build and production-preview validation therefore used a temporary localhost-only SELECT transport with authentication, retries, and an in-memory cache of actual database responses. It is outside the repository, rejects writes, and is not an application dependency or configuration change. The final full build passed with it. The preview uses a read snapshot; these lab measurements do **not** establish uncached CMS latency, deployed TTFB, or field Core Web Vitals. Repeat the standard build and audit on normal deployment infrastructure with direct database access before treating them as production measurements.

One earlier stress run reported a recoverable React hydration error #418. That run failed verification rather than suppressing the error. The immediate full repeat passed with zero page errors, and release Lighthouse runs logged no console-error failures. The cause was not isolated; retain this observation for a future reproducible case. Error capture now includes the page URL and stack when available.

Uganda and Australia select specific portfolio slugs. Only published matches are rendered; missing older selections are not replaced with invented market engagements. Other markets show selected studio work with accurate build-kind labels.

The original preview's baseline had database/image access failures and concurrent development activity. It is diagnostic evidence, not a controlled before/after comparison.

## Evidence and reproduction

- [Implementation decisions](implementation.md)
- [Final browser matrix](verification/results.json), [shared UI checks](verification/shared-checks.json)
- [Final Lighthouse summaries](release/summary.json), [enforced budgets](release/budgets.json), and per-run JSON in `release/`
- [Desktop linen preview](verification/uganda-1440-hero-linen.png), [mobile linen preview](verification/uganda-390-hero-linen.png); full-page captures for every country are in `verification/`

On the current Node 25.1.0 environment, start a normal production server with database/image access, then run:

```powershell
node --test tests/*.test.mjs
npm run lint
npm run build
npm run start -- --port 3100
# In a second terminal:
node scripts/verify-locations.mjs
node scripts/audit-locations.mjs current
```

The browser tools use the same external audit dependencies as the homepage workflow (`VEILCODE_AUDIT_TOOLS`, or `%TEMP%/veilcode-lighthouse-tools`): Playwright, axe, Lighthouse, and chrome-launcher. They are not application dependencies. Override the server URL with `VEILCODE_VERIFY_URL` / `VEILCODE_AUDIT_URL` when needed. Lighthouse's Chrome cleanup can hang on this Windows environment after all reports are written; the audit process was stopped only after every release report and budget result had been saved.

## Review

- **Plan alignment — PASS:** all five markets and the breadcrumb hub implemented; market-specific content and supported themes retained.
- **System integrity — PASS:** existing route/query architecture, recovery, metadata helpers, navigation, and non-location pages retained.
- **Production readiness — ISSUES FOUND:** mobile LCP exceeds the strict budget; direct database latency needs deployment validation; one intermittent hydration observation remains unreproduced. The redesign is reviewable, with these limits recorded rather than an unconditional claim that every check passed.
