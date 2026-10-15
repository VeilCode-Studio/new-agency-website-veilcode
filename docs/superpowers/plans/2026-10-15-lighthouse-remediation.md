# VeilCode Lighthouse remediation implementation plan

Date: 15 October 2026 (Africa/Kampala)
Baseline source revision: `d2aeb94`
Status: Implementation and local verification complete. See `docs/lighthouse/implementation-results.md` for evidence and limitations.

## Objective and scope

Improve public-site responsiveness and accessibility while retaining VeilCode's visual identity, server-rendered content, CMS publishing, and working navigation. Start with the homepage measured by Lighthouse, then verify shared changes on services, work, blog, contact, start, location, and case-study routes.

The user has confirmed lazy loading is wanted and delegated the image-loading and Facebook Pixel approach. Ads are currently inactive. Recommended default: Pixel disabled, optional JavaScript deferred, desktop motion restrained, mobile decorative motion substantially reduced. The user approved implementation on 15 October 2026, with no commits or pushes before sign-off.

Do not deploy, change external service configuration, upgrade frameworks, alter database schemas, or launch tracking as part of this work. Security-header hardening is a separately verified follow-up because it can affect authentication and integrations.

## Baseline and interpretation

Report: `docs/lighthouse/lighthouse-summary-json.json`, Lighthouse 13.4.1, captured 14 October 2026 at 08:41 UTC, homepage, mobile form factor, simulated network and 4x CPU throttling. Screen emulation was disabled in the saved configuration; record and control the actual viewport in comparisons.

| Measurement | Baseline |
| --- | --- |
| Performance / accessibility / best practices / SEO | 75 / 89 / 77 / 92 |
| FCP / LCP / Speed Index | 1.6 s / 1.6 s / 2.7 s |
| Total Blocking Time / CLS | 1,147 ms / 0.00116 |
| Main-thread work / JS execution | 10.0 s / 4.1 s |
| Total / JavaScript / Facebook transfer | 653 KiB / 549 KiB / 269 KiB |
| Estimated unused JavaScript | 128 KiB, including about 84 KiB from Facebook |

The React DOM chunk accounts for about 2.8 s of script evaluation and the Motion-containing chunk about 398 ms. Runtime attribution does not isolate component-level causes. The report lists 32 non-composited animated elements but gives that diagnostic a passing score. Forced reflow of 231 ms is unattributed. Validate suspected causes through profiling rather than treating these as proof.

## Loading decisions

- **Motion features:** an async `LazyMotion` feature bundle plus lightweight elements from `framer-motion/m`. The installed package is 12.38.0 and exposes that entry point. Keep the existing package; a migration to a different package name is unnecessary.
- **Motion provider:** use a small ambient CSS provider in the public layout and a separate lazy animation boundary in animated route layouts, passing server-rendered children through them. This does not require turning the page or root layout into a Client Component. An async feature loader runs when the provider mounts; it is not automatically viewport-based loading.
- **Content:** retain server-rendered headings, text, links, and image markup. Do not hide whole sections behind a client-only lazy import to improve a score.
- **Optional code:** dynamically load the chatbot panel on activation, after checking visibility settings. A small launcher can load immediately when enabled.
- **Images:** use native lazy loading through `next/image` below the fold, appropriate `sizes`, and reserved dimensions. Do not lazy load a genuinely above-the-fold LCP image. The homepage's measured LCP is its H1.
- **Tracking:** disable the Facebook script and noscript beacon by default. A documented deployment flag allows deliberate reactivation when campaigns begin.

## Phase 0: establish repeatable measurements

- [x] Preserve the supplied report unchanged and record the existing working-tree state.
- [x] Capture a production-build baseline using a consistent mobile viewport, throttling, storage/cache state, and browser version. Use three runs and compare medians. Do not compare `next dev` against the production report.
- [x] Record initial JavaScript transfer, long tasks, and a Performance trace covering load, scroll, navigation, and opening the chatbot. Distinguish the report baseline from a fresh local baseline if build or data differs.
- [x] Record any pre-existing lint, type, build, or test failures before changing source. Avoid printing environment-file values.

## Phase 1: remove immediate waste and fix shared accessibility

### 1A. Disable inactive Facebook tracking

Primary file: `app/layout.tsx`. Extract an integration component if that makes configuration and tests clearer.

- [x] Gate both script and noscript beacon behind `NEXT_PUBLIC_ENABLE_META_PIXEL === "true"` and a valid numeric `NEXT_PUBLIC_META_PIXEL_ID`.
- [x] Default to disabled when the flag is absent, false, or configuration is invalid. Do not leave an unconditional beacon in HTML.
- [x] Document the existing Pixel ID and reactivation procedure without changing the user's actual environment files. Public Next.js environment variables require a rebuild/redeployment when changed.
- [ ] When re-enabled, use a later loading strategy and the site's selected tracking preference, and verify initial and client-side navigation PageViews without duplicates. Deferral must not depend exclusively on a click if an enabled campaign requires landing-page measurement. (Operational follow-up before a future campaign; the Pixel remains disabled.)
- [x] Keep future activation as an explicit operational action; do not automatically enable tracking based on referral parameters.

Acceptance: with default configuration, page HTML and the browser network contain no Facebook Pixel script or tracking beacon. The enabled configuration is tested separately without sending test traffic to the production Pixel.

### 1B. Correct image priorities

Primary files: `components/shared/Work.tsx`, `components/extras/ProjectCard.tsx`, public work/blog cards and featured components, and `app/(client)/work/[slug]/_components/CaseStudyHero.tsx`.

- [x] Remove `priority={index < 2}` from below-the-fold homepage work images. Audit the older shared card's `priority={index < 3}` and its active consumers before editing unused code.
- [x] Preserve existing lazy loading on `BlogGrid`, gallery, and normal listing cards.
- [x] Check featured work/blog image positions at mobile and desktop sizes before keeping any eager-loading exception. Add missing `sizes` to fill images.
- [x] Audit raw case-study `<img>` elements. Use `next/image` when a stable aspect-ratio wrapper or known dimensions are available, preserving full screenshot visibility. Otherwise provide correct dimensions and loading behavior without cropping or inventing image geometry.
- [x] Reserve eager/high-priority loading for a verified above-the-fold image candidate on the relevant route; avoid conflicting `preload`, `loading`, and priority instructions.

Acceptance: offscreen work images are not preloaded by index; responsive image choices match layout; galleries and case-study screenshots retain their intended framing; no material CLS regression. Native lazy loading may legitimately fetch images near the viewport before scrolling.

### 1C. Defer the chatbot panel

Primary files: `components/chatbot/ChatbotGate.tsx`, `components/chatbot/ChatbotWidget.tsx`.

- [x] Preserve route exclusions and the existing visibility/failure policy.
- [x] Split the small launcher from the full conversation panel and use `next/dynamic` or a dynamic import from a Client Component for the panel.
- [x] Load on activation, optionally prefetch on pointer intent/focus. Render an immediate accessible loading state and retain keyboard focus while loading.
- [x] Preserve persisted conversations, draft data, message submission, and close/reopen behavior. Avoid changing settings caching until the freshness policy is reviewed in Phase 3.

Acceptance: disabled chatbot loads no panel chunk; enabled but unopened chatbot defers the panel chunk; opening and restoring a conversation work with slow chunk loading.

### 1D. Fix accessibility at shared sources

Primary files: `components/extras/Primitives.tsx`, CTA consumers, `components/shared/Footer.tsx`, `components/extras/FooterSocials.tsx`, `app/globals.css`.

- [x] Give navigation CTAs one styled anchor/Next Link and actions one button. Remove links nested inside buttons throughout active public consumers; ensure the whole visual target is clickable and focusable once.
- [x] Aim for at least 44 by 44 CSS pixels for standalone touch controls. Verify the report's three target failures disappear rather than only enlarging wrappers.
- [x] Add an accessible name to the back-to-top link. Replace the visible GH abbreviation with an appropriate decorative icon and an accurate link name, or make visible and accessible text agree.
- [x] Adjust text tokens so small text reaches at least 4.5:1 on each background where it is used. Distinguish decorative faint colors from readable text if needed. Check light, dark, midnight, and linen themes, not only the reported midnight theme.
- [x] Resolve the nested main landmarks in root/public layouts with one main landmark and navigation/footer outside it, preserving current container widths.

Acceptance: reported contrast, link-name, label mismatch, and target-size issues are resolved; keyboard navigation and visible focus work; automated checks are supplemented by a manual screen-reader smoke check.

## Phase 2: reduce animation payload and ongoing browser work

### 2A. Separate static markup from client-only motion

Primary files: `components/extras/Primitives.tsx`, `components/shared/Hero.tsx`, `Services.tsx`, `Process.tsx`, `Work.tsx`, `TechStack.tsx`, `CTA.tsx`, `BlogGrid.tsx`, and `lib/motion.ts`.

- [x] Move static branding, backgrounds, decorative lines, and link/button styling into server-compatible modules. Update imports in public, auth, and admin consumers without changing their behavior.
- [x] Keep static homepage sections server rendered. Use small animation wrappers only where the effect is worth retaining. Keep form, filter, and carousel state in focused client components.
- [x] Keep the hero H1 and intro visible in server HTML. Use visible-by-default markup for essential content rather than relying on delayed animation features to reveal it.
- [x] Avoid sending full database objects to client islands when they need only display fields.

### 2B. Introduce LazyMotion correctly

Primary additions: `components/providers/AnimationBoundary.tsx`, a separately imported feature module under `lib/`, and server layouts for animated routes. `app/(client)/layout.tsx` retains only the ambient CSS provider. The global 404 is static so its client imports do not add animation code to every route.

- [x] Inventory every public Motion consumer before enabling strict mode, including shared modules imported by the public layout.
- [x] Replace retained `motion.*` elements with lightweight `m.*` elements from the installed `framer-motion/m` entry point. Keep compatible hooks and types as needed.
- [x] Dynamically import a local module exporting `domAnimation`. Do not eagerly import that module elsewhere.
- [x] Replace the simple `layoutId` filter dots in `BlogGrid`, work filters, and blog filters with CSS state feedback so the public bundle does not require layout-projection features just for small indicators. If a retained interaction genuinely needs projection or drag, supply a separately loaded `domMax` boundary and verify feature compatibility.
- [x] Enable `LazyMotion` strict checks after conversion and use a shared `MotionConfig reducedMotion="user"` policy. Check privacy and not-found routes, which are outside the public route group, before moving any of their shared components to `m`.
- [x] Ensure the provider does not gate rendering of children while features load. Verify delayed/failed feature loading leaves readable content and usable navigation.
- [x] Inspect production output/network to confirm feature code actually splits out. A wrapper alone is insufficient, and reduced feature size alone does not eliminate hydration CPU cost.

### 2C. Simplify decorative motion

Primary files: `HeroMotion.tsx`, `ServiceVisualField.tsx`, `Marquee.tsx`, `Testimonials.tsx`, card components, `app/globals.css`.

- [x] Preserve the visual palette, typography, layouts, and useful interaction feedback. Reduce mobile background motion and remove mobile hero parallax by default.
- [x] Use CSS transform/opacity keyframes for predictable floating, pulse, and scroll-cue effects; keep JavaScript where interaction requires it. Preserve existing transforms when composing effects.
- [x] Pause continuous decorative effects outside the viewport and when the document is hidden. Avoid setting up animations for breakpoint-hidden illustration panels.
- [x] Replace per-character decorative React updates with a simpler static or infrequently rotating line on mobile/reduced motion. If desktop typing remains, scope it to one island, stop it offscreen, and clean up every timer including the word-hold timer.
- [x] Replace `transition-all` in touched public components with the actual intended properties. Change expanding accent lines from width animation to `scaleX` with a fixed transform origin.
- [x] Provide explicit reduced-motion behavior for CSS loops, smooth scrolling, and custom timers; MotionConfig alone does not govern these. Stop testimonial auto-advance under reduced motion and offer pause/control behavior for remaining auto-advancing content.
- [x] Keep effects finite or offer a pause mechanism where applicable. Do not introduce new decorative effects during this performance pass.

Acceptance: no full Motion elements render inside a strict lazy boundary; features load separately; no hidden content flash; mobile/reduced-motion modes are readable and calm; menus, filters, forms, galleries, and transitions work; traces show reduced long-task and ongoing animation activity.

## Phase 3: public caching and robots reliability

- [x] Investigate the production `/robots.txt` response with repeated GET requests: status, content type, completion, redirects, cache behavior, and hosting logs if available. The Lighthouse failure is a fetch timeout, not demonstrated syntax corruption; `app/robots.ts` already returns normal rules.
- [x] Review `force-dynamic` and `revalidate = 0` on `app/(client)/page.tsx` against the need for public-content freshness. Proposed maximum stale interval: five minutes, with immediate path invalidation after successful CMS changes where supported by the installed Next.js configuration.
- [x] Before enabling caching, wire homepage invalidation for services, projects, blogs, and testimonials, including edits, publish/unpublish, reorder, and deletion. Preserve existing testimonial invalidation. Do not cache private admin responses, chat messages, or user-specific data as public content.
- [x] Choose one caching approach compatible with Next.js 16.1.6 and the current configuration; verify its treatment of direct database queries and failed-query fallbacks. Avoid permanently caching fallback/empty results after transient database failures.
- [x] Check homepage response headers and back/forward navigation after the change. Treat bfcache as browser-dependent; the supplied report labels its two no-store reasons as not actionable in that environment.

Acceptance: content publishing becomes visible without exceeding the chosen freshness budget, unpublished/deleted content disappears, robots requests reliably complete, and public caching does not expose private data.

## Follow-up: security headers

Assess CSP, frame-ancestors, COOP, and existing HSTS deliberately. Start CSP in report-only mode if implementing it, inventory required origins, and exercise authentication, uploads, images, and integrations before enforcement. Do not add COEP or HSTS preload as score-driven blanket changes. This follow-up does not block measuring the performance work.

## Validation and completion

- [x] Run relevant existing tests, lint, TypeScript checking, and a production build. Add narrowly scoped regression tests for behavior such as tracking gating or lazy-panel activation if the available tooling supports meaningful tests; avoid tests that merely search source strings.
- [ ] Smoke-test home, services/detail, work/detail, blog/detail, contact/start, locations, privacy, not-found, and authenticated admin consumers affected by shared primitives. Submit only safe local/test forms; do not send real inquiries. (20 public routes passed; authenticated admin browser editing was not exercised. Mutation handlers were tested with mocked authentication/storage.)
- [x] Verify all themes, mobile/desktop layouts, keyboard operation, reduced motion, JavaScript-disabled content, and deliberately slow optional chunks.
- [x] With Pixel disabled, verify no requests to Facebook; ensure runtime feature flags are documented accurately and re-enabling the integration is not part of this pass.
- [x] Repeat three comparable production Lighthouse runs and compare medians, initial JS transfer, long tasks, and a scroll/interaction trace. Do not add opportunity estimates together or guarantee a score.
- [ ] Target TBT below 200 ms, LCP at or below 2.5 s, CLS below 0.1, and resolution of reported accessibility failures. A 90+ performance score is an aspiration, not an acceptance substitute for working behavior. (Measured median: TBT 387 ms, LCP 2.74 s, CLS 0, performance 87. Budgets remain targets, not achieved claims.)
- [x] Save before/after evidence and implementation notes under `docs/lighthouse/`. Separate locally measured improvements from a deployed-site recheck; field INP requires real-user data and is not established by this report.

## Execution order and rollback

Implement and verify Phase 1 before Phase 2, then measure before deciding how far Phase 3 needs to go. Keep changes grouped so tracking, images/chatbot, accessibility, motion, and caching can be reviewed or reverted independently. Do not overwrite the supplied report. Update checkboxes and record actual results as each phase completes.

## References

- Motion LazyMotion: https://motion.dev/docs/react-lazy-motion
- Motion performance: https://motion.dev/docs/performance
- Next.js lazy loading: https://nextjs.org/docs/app/guides/lazy-loading
- Next.js Image loading and sizing: https://nextjs.org/docs/app/api-reference/components/image

Documentation may describe newer releases; confirm APIs against installed package types and the lockfile during implementation.


## Completion record

Implementation is ready for review; no commit, push, or deployment was made. All 43 tests, TypeScript/production build, and lint passed (18 existing lint warnings). Browser checks passed across 20 public routes and four homepage themes, including client navigation, delayed/failed optional downloads, hidden-route chat draft preservation, and intercepted newsletter responses. Three local mobile runs per build produced median performance 74 to 87, accessibility 89 to 100, 57.0% less transfer, and 51.0% less blocking time. Raw reports, CPU interaction traces, screenshots, cache headers, and remaining limits are recorded in `docs/lighthouse/implementation-results.md`.

A real screen-reader session, authenticated admin browser mutations, future Pixel activation, and deployed/field measurements remain follow-ups. Desktop CMS screenshot dimensions without metadata remain a content-data improvement. No production forms, email sends, chat submissions, or CMS writes were performed during verification.
