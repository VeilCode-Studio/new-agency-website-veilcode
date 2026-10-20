# Remaining client pages: review results

Date: 20 October 2026. Preview: http://localhost:3100/services (production build, Next.js 16.2.12).

## Delivered

Redesigned About, Services and service details, Work and case studies, Blog and articles, Contact, Start, Careers, search landing pages, privacy, newsletter outcomes and public 404s. The current published-content inventory contains 32 routes beyond the previously completed homepage and location pages, plus the 404 template.

The presentation follows the homepage's typography, warm linen, periwinkle/peach/mint accents, readable content width, native disclosures and clear calls to action. All four existing themes remain available. Static content renders on the server; filters, forms and sharing retain small client components. Responsive Next.js images reserve their aspect ratios and defer noncritical images. Plain versioned Cloudinary originals receive bounded, optimized delivery before the existing Next.js optimizer. Portfolio grids receive cover images instead of entire galleries.

Existing database models, queries, API payloads, authentication, metadata/schema helpers and route rendering/cache policies remain. There is no admin migration. Two existing admin preview pages receive the public presentation wrapper around their reused article/project content; their administrative controls and queries stay unchanged.

The one application dependency update is Next.js 16.1.6 to 16.2.12. It follows reproduction and inspection of the intermittent renderer hydration defect, rather than hiding hydration errors or disabling SSR. The shared publication-date formatter also uses explicit UTC to prevent a separate timezone-dependent text mismatch. See [implementation findings](implementation.md) for the reproduction, upstream references and exact scope.

## Functional, accessibility and architecture checks

| Check | Result |
| --- | --- |
| Automated unit/regression suite | 46 tests pass |
| ESLint | 0 errors; 15 pre-existing admin/auth/API warnings |
| Normal production build with direct database access | Pass; 41 static routes generated |
| Published remaining routes | 32 return 200; headings, metadata, canonical URLs and schema checked |
| Theme accessibility | 128 page/theme WCAG A/AA audits; zero violations |
| Responsive layouts | 160 route/viewport combinations; no overflow or hidden headings |
| Internal destinations and missing URLs | 34 destinations return 200; 5 missing routes return 404 with noindex |
| Case-study/article assets | All 88 images load with responsive optimized delivery |
| Form-state accessibility | 20 full-page state/theme audits; zero violations |
| Enquiry and newsletter workflows | Validation, pending state, errors, draft preservation and success/confirmation checked with intercepted writes |
| Navigation | Project cards, footer and mobile menu use client navigation; menu closes and Escape works |
| Content interactions | Portfolio/blog filters, native FAQs, copy/share intents, article contents and reduced motion pass |
| No JavaScript | 13 representative routes retain content/navigation; forms offer fallbacks and prevent accidental submissions |
| Browser timezones | Los Angeles, Kiritimati and Tokyo pass without date hydration errors |
| Homepage regression | Four themes, five viewport sizes, links, forms, chat, newsletter, no-JS and cache checks pass |
| Location regression | Five markets, 20 theme audits, 25 layouts, links, hub, keyboard FAQs and no-JS checks pass |
| Runtime errors | Zero in the final remaining-page, asset, form-state, timezone, homepage and location checks |

Viewports: 1440x900, 1280x720, 768x1024, 390x844 and 320x740. Newsletter outcomes and Careers retain their existing noindex policy. Newsletter confirmation remains double opt-in. All form/chat/newsletter test writes are intercepted; no real enquiries or messages were sent.

Evidence: [route matrix](verification/results.json), [assets and interactions](verification/asset-interactions.json), [form states](verification/form-states.json), [timezones](verification/timezones.json), [homepage regression](../verification/results.json), [location regression](../locations/verification/results.json). Screenshots are in `verification/`; [desktop Services](verification/services-1440-hero.png) and [mobile Contact](verification/contact-390-hero.png) show representative layouts.

## Performance measurements

All **56 primary runs** completed: 14 indexed templates, three mobile runs and one desktop run each. **No template passes every strict budget.** Mobile median performance is at least 90 on 11/14 targets; desktop performance is at least 95 on 11/14. Accessibility and best-practices score 100 in all 56 runs. SEO scores 100 in 54/56; the two exceptions are described below. CLS is zero in every primary run.

| Route | Mobile performance median (range) | Desktop performance | Mobile LCP | Mobile TBT | Max mobile CLS | Median mobile transfer |
| --- | --- | --- | --- | --- | --- | --- |
| `/about` | 97 (81-97) | 100 | 2.686s | 45.5ms | 0 | 317.7 KiB |
| `/services` | 95 (95-96) | 99 | 2.831s | 29.5ms | 0 | 332.9 KiB |
| `/services/web-solutions` | 96 (93-96) | 94 | 2.712s | 49.5ms | 0 | 315.5 KiB |
| `/work` | 96 (95-98) | 100 | 2.709s | 53.5ms | 0 | 434.4 KiB |
| `/work/bienvenidos-apartments` | 95 (95-98) | 100 | 2.910s | 25.5ms | 0 | 331.0 KiB |
| `/blog` | 90 (81-95) | 100 | 2.954s | 382.9ms | 0 | 414.5 KiB |
| `/blog/seo-thinking-for-business-websites` | 95 (95-96) | 100 | 2.907s | 38.5ms | 0 | 337.9 KiB |
| `/contact` | 96 (95-97) | 100 | 2.689s | 78.0ms | 0 | 305.3 KiB |
| `/start` | 97 (96-97) | 100 | 2.577s | 75.0ms | 0 | 297.7 KiB |
| `/seo` | 97 (96-97) | 100 | 2.679s | 35.5ms | 0 | 282.2 KiB |
| `/seo/usa-web-development-agency` | 94 (88-96) | 98 | 2.772s | 84.5ms | 0 | 328.6 KiB |
| `/privacy-policy` | 88 (68-93) | 99 | 2.648s | 451.8ms | 0 | 291.9 KiB |
| `/work/cartix-ecommerce-platform` | 65 (62-81) | 94 | 2.321s | 3080.0ms | 0 | 396.1 KiB |
| `/blog/building-fast-web-apps-for-low-bandwidth-markets` | 70 (42-70) | 93 | 3.262s | 1081.2ms | 0 | 325.6 KiB |

**Open gates:** LCP exceeds 2.5 seconds on 13/14 targets. Mobile median TBT exceeds 200ms on Blog (383ms), Privacy (452ms), Cartix (3080ms) and the low-bandwidth article (1081ms). Privacy, Cartix and the low-bandwidth article also miss mobile performance 90. Desktop service detail and Cartix score 94, and the low-bandwidth article scores 93, below the 95 budget. Timing variation is substantial: the heavier article ranges from 42 to 70 and Cartix from 62 to 81 on mobile. These results do not establish whether host contention, route work or both dominate the late-run slowdown; no causal claim is made.

Cartix mobile run 1 and desktop run 1 score SEO 92 because Lighthouse did not find a meta description; the other two mobile runs score 100. The full browser matrix found the description. A separate [normal-browser and HTML-only crawler response check](verification/metadata-response.json) returns the expected description in both responses, in the head for the HTML-only crawler. This is consistent with [Next.js streamed metadata behavior](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata), but does not prove the exact cause of the audit misses. Keep the exceptions open for deployment-level crawler/audit verification. Streaming was not disabled to alter the score.

The back/forward cache diagnostic also fails on some preserved dynamic/no-store routes. No rendering or cache policy was changed to improve that diagnostic.

Evidence: [primary summaries](release/summary.json), [strict budgets](release/budgets.json), and individual Lighthouse JSON files in `release/`.

The additional current-homepage/Uganda Lighthouse regression attempt did not produce a report while the host was under severe memory/CPU pressure and was stopped. It is **not a passed performance check**. Their complete functional/theme/accessibility regressions pass, as linked above; their previous performance measurements remain historical. Repeat the current performance regression under controlled deployment conditions before release sign-off.

The lab uses Lighthouse 13.5.0 on Chrome, Node 25.1.0 and the normal Next.js production server. Each target receives three mobile runs and one desktop run. Mobile uses a 412x823 viewport, 150ms RTT, 1638.4 Kbps and 4x simulated CPU slowdown. Desktop uses 1440x900, 40ms RTT, 10240 Kbps and 1x CPU. Facebook tracking is blocked, matching the earlier audit workflow. Build, lint and browser matrices do not run alongside these measurements.

Budgets remain unchanged: mobile median performance >=90, desktop performance >=95, mobile median LCP <=2.5s, median TBT <=200ms, maximum CLS <=0.1, and accessibility/best-practices/SEO scores of 100 in every measured run. Failed budgets remain explicit in JSON and produce a failing audit exit status. Individual run variation is retained rather than discarded.

The final preview reads the database directly and uses normal image delivery. Earlier temporary read-only transport and isolated development helpers were stopped. Remote CDN/database caches were warmed during verification; initial cold image fetches had timeouts. These local simulated measurements do not establish uncached origin latency, deployed performance, real-device responsiveness or field Core Web Vitals. The historical homepage/location reports retain their original environment caveats; the regression results linked here describe the current direct-database preview.

A [one-second host sample](verification/host-sample.json) during the final regression audit measured 86% aggregate CPU activity and only 324 MiB free out of 16,112 MiB RAM. This establishes substantial host pressure at that point, not the cause of every earlier result. Treat late-run timings as environment-limited evidence and repeat under controlled conditions on the deployment before concluding that the redesign itself causes the observed slowdown. The recorded failures remain failures; no user applications were stopped to improve scores.

## Review

- **Plan alignment: pass.** Remaining public templates follow the completed homepage design, with themes and actual published content retained.
- **System integrity: pass for inspected boundaries and automated checks.** No schema, query/API/authentication rewrite or rendering-policy migration; no new UI dependencies. Next.js receives a targeted version update, with full build and public regressions passing.
- **Functional and accessibility readiness: pass for the measured matrix.** Visual samples, keyboard behavior, no-JS content, links and intercepted form workflows were reviewed. Authenticated admin previews were integrated by inspection/build, not by an authenticated browser walkthrough.
- **Performance readiness: not signed off; see measured budget failures above.** The redesign is reviewable; it must not be described as passing every performance target. Deployment/field measurements and broader browser/device coverage remain unmeasured.

## Reproduce

Use the existing project environment with database and image network access. Restart any development server that was running before the Next.js update so it loads the new dependencies.

```powershell
node --test tests/*.test.mjs
npm run lint
npm run build
npm run start -- --port 3100
# In another terminal, functional checks first:
node scripts/verify-client-pages.mjs
node scripts/verify-client-assets.mjs
node scripts/verify-client-form-states.mjs
node scripts/verify-client-timezones.mjs
node scripts/verify-homepage.mjs
node scripts/verify-locations.mjs
# Run performance checks separately, without other heavy verification jobs:
node scripts/audit-client-pages.mjs review
$env:VEILCODE_AUDIT_ROUTES='/,/locations/uganda'
node scripts/audit-client-pages.mjs review-regression
Remove-Item Env:VEILCODE_AUDIT_ROUTES
```

Audit dependencies live outside the application in `%TEMP%/veilcode-lighthouse-tools/node_modules`, or `VEILCODE_AUDIT_TOOLS`. The scripts support `VEILCODE_VERIFY_URL` / `VEILCODE_AUDIT_URL`. On this Windows host Chrome-launcher cleanup can hang after all summaries and budget files have been written; stop only the owned audit process after confirming those files are complete.
