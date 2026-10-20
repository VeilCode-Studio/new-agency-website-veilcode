# Homepage redesign results

Completed 20 October 2026, Africa/Kampala. The homepage is implemented and available in the local production preview at `http://localhost:3100`. No commit, push or deployment was made.

## What changed

The homepage follows the supplied reference's visual sequence: photographic hero, scalloped transition, selected-work strip, browser-style commitment cards, service introduction and cards, six process panels, featured projects, portfolio grid, industry showcase, business benefits, local presence, project CTA, technology tiles, studio/testimonials section, pricing, FAQ/contact columns, articles and closing CTA. The existing newsletter remains available.

VeilCode's real content replaces the reference site's identity, prices and claims. Project kinds continue to distinguish client work, own products and concepts. The current testimonial query returned no items, so the page displays an honest studio introduction; real testimonials automatically replace that state when available. No ratings, endorsements or sales statistics were fabricated.

## Architecture and optimization retained

- The homepage remains an async Server Component, with the same four concurrent queries, five-minute ISR, CMS API invalidation and failure behavior. The production build still reports `/` as static with five-minute revalidation. Browser evidence confirms `s-maxage=300`.
- New display components are server-only. Only the gallery controls and inquiry form add client components. No Framer Motion, Axios, carousel package or new application dependency was added to the homepage.
- The theme provider, default and saved preferences remain unchanged. Light, linen, midnight and dark are preserved. Homepage-specific tokens adapt the new design without recoloring other routes.
- Metadata, canonical URL, OG/Twitter configuration, root Organization schema, robots, redirects and sitemap architecture remain. The homepage's sitemap modification date now reflects the redesign date.
- One optimized decorative hero image uses eager loading and high fetch priority. Lower images remain lazy, with responsive sizes and reserved dimensions. The original 1920 × 28800 reference is never used as a runtime page image. Fonts remain the existing system stacks.
- Chat remains deferred until activation and preserves its draft across navigation. Newsletter behavior and tracking gates remain. Homepage navigation uses native section anchors and retains deliberate route-prefetch opt-outs.
- The root HTML now declares its existing smooth-scroll behavior using Next.js's recommended `data-scroll-behavior` marker, allowing route transitions to manage scrolling correctly. See [Next.js guidance](https://nextjs.org/docs/messages/missing-data-scroll-behavior).
- Admin UI, auth, database schema, API contracts, package/lock files and Next configuration were not changed. The inquiry form uses the existing `/api/messages` JSON contract.

## Local Lighthouse comparison

Mobile numbers are medians of three runs per version; desktop is one run per version. Reports and raw measurements are in `before-homepage/`, `after-homepage-final/` and `comparison.json`. `after-homepage/` preserves the earlier verification pass before the final article accessible-name correction.

| Mobile metric | Before | Final redesign |
| --- | ---: | ---: |
| Performance | 88 | **95** |
| Accessibility | 100 | **100** |
| Best practices | 100 | **100** |
| SEO | 100 | **100** |
| First contentful paint | 1.17 s | 1.06 s |
| Largest contentful paint | 3.07 s | 2.91 s |
| Total blocking time | 307 ms | 107 ms |
| Speed Index | 4.11 s | 1.06 s |
| Cumulative layout shift | 0 | 0 |
| Initial transfer | 250 KiB | 318 KiB |

Mobile performance runs were `[72, 90, 88]` before and `[90, 96, 95]` after. Blocking time fell about 65%. The richer photographic page adds about 68 KiB of initial transfer; the measured mobile hero variant is about 23 KiB. The saved source WebP is 66.6 KiB. All final Lighthouse reports have no failing binary accessibility, best-practices or SEO checks, and no run warnings.

| Desktop metric | Before | Final redesign |
| --- | ---: | ---: |
| Performance | 100 | **100** |
| Accessibility | 96 | **100** |
| Best practices / SEO | 100 / 100 | **100 / 100** |
| LCP | 0.65 s | 0.67 s |
| CLS | 0 | 0 |

These are local production-build lab measurements, not deployed-site or real-user results. The pre-redesign audit used the existing production build dated 15 October, before any application edits. Both versions use the project's unchanged Next.js 16.1.6/Turbopack setup. Mobile measurements use 412 × 823 at 1.75 DPR, simulated 150 ms RTT / 1638.4 Kbps / 4× CPU; desktop uses 1440 × 900 at 1× DPR, 40 ms RTT / 10240 Kbps / 1× CPU. The default midnight theme is measured. Machine contention and cache state cause run-to-run variation. Browser checks and Lighthouse were run sequentially.

**Remaining performance limit:** the final mobile LCP median of 2.91 s remains above the 2.5 s target. Discovery, eager loading and priority checks pass for the hero; the remaining profile includes stylesheet and initial layout/startup work. The 95 performance score does not establish that every Core Web Vital passes. Real-user p75 INP and deployed-site measurements were not collected.

## Verification

- Production build and its TypeScript checks passed, generating all 40 static pages.
- All **43 existing Node regression tests** passed. Tests mock persistence/auth; they do not perform real CMS writes.
- Full ESLint passed: **zero errors, 18 existing warnings**. Targeted lint passed for every changed application file and the new audit scripts.
- Automated axe checks: **zero violations** across light, linen, midnight and dark, plus the 390px mobile layout. No browser page errors.
- Layouts checked at **1440 × 900, 1280 × 720, 768 × 1024, 390 × 844 and 320 × 740**: no horizontal overflow, and both hero CTAs remain within the first viewport.
- All **21 unique internal link destinations** returned 200. Native section anchors resolve, including a direct jump to the contact section on a freshly loaded page.
- Form checks cover an intercepted server failure with draft preservation, pending/duplicate-submission protection, intercepted success, field reset and confirmation focus. Every test inquiry/newsletter/chat write is intercepted. No real inquiry, email or chat message was sent.
- Gallery controls, keyboard FAQ disclosure, mobile menu focus restoration, reduced motion and deferred-chat navigation state passed.
- With JavaScript disabled, headings, work, pricing, links and FAQ content remain available. The inquiry button stays disabled and a direct email alternative is present.
- The shared navigation loses its homepage-only presentation on `/work`; other route layouts retain their existing behavior.

Evidence: [browser results](verification/results.json), [linen desktop](verification/desktop-linen.png), [linen mobile](verification/mobile-linen.png), [process](verification/home-process-linen.png), [pricing](verification/home-pricing-linen.png), [FAQ/contact](verification/home-questions-linen.png).

## Review

Plan alignment: passed for the public homepage. System integrity: existing rendering, query, theme, SEO and cache boundaries retained. Functional/accessibility readiness: passed for the automated checks and visual review described above. The mobile LCP target remains the documented performance follow-up; cross-browser/device and live field checks remain unmeasured.

See [audit and implementation plan](homepage-plan.md), [design patterns](design-system.md), and [hero asset/prompt](hero-asset.md). Existing `.hintrc` edits, reference snapshots and supplied Lighthouse files were left intact.

## Reproduce

With the existing environment and published-content network access:

```powershell
npm run build
npm run start -- --port 3100
```

In another terminal:

```powershell
node --test tests/*.test.mjs
npm run lint
node scripts/verify-homepage.mjs
node scripts/audit-homepage.mjs review-homepage
```

Audit dependencies use the existing external tool directory at `$env:TEMP/veilcode-lighthouse-tools/node_modules`, or `VEILCODE_AUDIT_TOOLS`. They are not production dependencies. `VEILCODE_VERIFY_URL` and `VEILCODE_AUDIT_URL` can point to another local server. Use a new audit label to keep previous evidence.


## Client-pages follow-up (20 October 2026)

The remaining public-page redesign includes a targeted Next.js renderer update and an explicit UTC publication-date formatter. The current homepage and all five location browser regressions pass without runtime errors on a normal production server with direct database access. See the [current integration report](client-pages/results.md) for the final evidence and new performance measurements. The earlier measurements and environment caveats above remain historical records.
