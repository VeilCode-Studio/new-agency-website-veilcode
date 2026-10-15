# Lighthouse remediation results

Implementation date: 15 October 2026, Africa/Kampala.
Original source revision: `d2aeb94`. No commits, pushes, or deployments were made.

## Implemented

- Animated public routes use `LazyMotion` with a separately imported `domAnimation` feature bundle, lightweight `framer-motion/m` elements, strict checks, and the user's reduced-motion preference. Filter dots no longer require layout projection. The homepage uses native elements and CSS for its cards, newsletter, testimonials, and menu, and does not load the animation feature bundle. Server layouts for animated routes import a dedicated `AnimationBoundary`; the shared public provider only manages CSS visibility and imports no Motion runtime. Shared chat/navigation state survives route changes. The global 404 is server rendered and static.
- Hero content, service cards, process steps, work cards, technology badges, and the main CTA render on the server. Essential headings and content no longer depend on scroll reveals. Static primitives and hover arrows no longer import Motion.
- Hero parallax and per-character React typing were removed. Homepage decorative loops use finite CSS animations, run only on larger screens, and pause outside the viewport or when the page is hidden. Testimonials use manual selection.
- The chatbot panel loads on first activation and the newsletter HTTP client loads on submission. Homepage destination CTAs load their route code on navigation, and same-page top links use native anchors instead of route prefetching. Its small launcher remains separate. Hidden public routes retain activated conversation state; failed downloads offer a dismissible fallback. Conversation state survives closing/reopening, loading errors offer the project form, focus moves to the message field and returns to the launcher, and Escape closes the panel.
- Below-the-fold work/featured images no longer request priority loading by card index. Existing lazy image loading is retained, responsive sizing improved, and raw case-study screenshots use lazy loading and asynchronous decoding. Desktop screenshot framing is retained; intrinsic dimensions for arbitrary CMS desktop screenshots remain a separate content-data improvement.
- Navigation CTAs render one styled link instead of links nested inside buttons. Social links and carousel controls have larger targets, the back-to-top link has a name, the page has one main landmark, and mobile menu focus is contained and restored.
- Readable text and accent tokens were adjusted across themes. Conflicting font tokens were corrected to use the intended system sans/monospace stacks.
- Facebook Pixel is disabled unless explicitly enabled with a valid ID. The optional integration also requires a granted marketing preference. No noscript beacon is emitted. See `tracking-configuration.md` for future activation; environment files and the external advertising account were not changed.
- The public homepage uses five-minute ISR. Successful service, project, blog, and existing testimonial writes invalidate it. Failed queries throw rather than caching fallback seed content or an empty page after an outage. Private data and chat messages are not publicly cached. `cache-verification.json` records the public `s-maxage=300` response. The updated local audit no longer lists bfcache blockers.

## Verification

- The full production build passed using Next.js 16.1.6/Turbopack, including TypeScript checks. The final webpack build also passed, including TypeScript checking, with the same compiler used for the isolated baseline.
- All 43 Node tests passed, including new tests exercising actual CMS mutation handlers with mocked storage and authentication. Successful writes invalidate home; unauthorized and failed writes do not. No real CMS mutations were performed.
- ESLint passed with 18 pre-existing warnings and zero errors; the original baseline had 19 warnings.
- All final browser checks passed with zero homepage axe violations in each of light, dark, midnight, and linen, and no primary page errors. The browser check covers four homepage themes, 20 public routes, lazy-panel network behavior, preserved local input, keyboard controls, no-JavaScript content, reduced motion, failed optional chunks, a working native back-to-top anchor, a dismissible failed-chat fallback, mocked newsletter responses, and robots responses. Raw evidence is in `browser-verification.json`; screenshots and the trace are alongside it.
- Three live production `robots.txt` requests returned complete `200 text/plain` responses in 553, 326, and 107 ms. Rules were already valid and were left unchanged. The saved Lighthouse error was a fetch timeout, not demonstrated malformed syntax.

## Final local Lighthouse comparison

Three alternating mobile runs for each production webpack build, using Lighthouse 13.5.0. Values below are medians.

| Metric | Original local build | Updated local build |
| --- | ---: | ---: |
| Performance | 74 | 87 |
| Accessibility | 89 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 0.92 s | 0.91 s |
| LCP | 2.95 s | 2.74 s |
| Total Blocking Time | 789 ms | 387 ms |
| Speed Index | 3.94 s | 0.96 s |
| CLS | 0.0017 | 0.0000 |
| Total transferred | 662 KiB | 284 KiB |

Performance scores across the three runs were [60, 74, 86] before and [86, 87, 93] after. Total transfer fell by 57.0%, blocking time by 51.0%, and Speed Index by 75.7%.

The 90+ performance aspiration was reached in one run (93), while the median remains 87. LCP (2.74 s) and TBT (387 ms) remain above the 2.5 s / 200 ms targets. These budgets have not been represented as achieved. The remaining work is mostly initial layout and framework hydration; candidates for a later optimization pass include simplifying the mobile hero's decorative DOM/paint and reducing framework startup work. The visual layout and branding are preserved.

The baseline's best-practices runs vary because tracking-cookie diagnostics can still flag blocked attempts; the Pixel's event requests were blocked during measurement. Do not compare the local best-practices/SEO medians directly to the supplied production report's 77/92, or attribute a production SEO improvement to a robots rule change. The rules were unchanged.

Raw run reports are `baseline-local-run-1.json` through `baseline-local-run-3.json` and `after-local-run-1.json` through `after-local-run-3.json`. `median-results.json` contains the summary; `local-comparison.json` preserves every run and warning. `baseline-interaction-performance-trace.json` and `after-interaction-performance-trace.json` can be opened in Chrome's Performance panel. The Playwright interaction trace is `browser-trace.zip`.


## Measurement conditions and limits

The supplied report remains unchanged. Local reports use a production server, a 412 × 823 mobile viewport at 1.75 DPR, simulated network conditions, 4× CPU throttling, and three runs. The supplied DevTools report had screen emulation disabled, so its numbers should not be presented as a controlled local before/after comparison.

The original-code baseline was built in a temporary checkout of the same revision. Its only configuration adjustment was a Windows cross-drive webpack entry alias pointing to the existing Next.js dependency; application code was unchanged. Both comparison servers use webpack production builds.

Temporary audit dependencies were installed outside the project under the operating system's temporary folder. No application dependencies or lockfile were changed. Some verification attempts were interrupted by the disconnection and host memory exhaustion; subsequent builds were run serially with `CIRCLE_NODE_TOTAL=2` and a 1536 MB Node heap. These are shell-only settings, not committed project configuration.

Real-user INP, authenticated admin editing in the browser, a real screen-reader session, and a deployed-site recheck were not performed. Automated accessibility checks do not replace that manual review. Newsletter submissions were intercepted locally, and no forms or chat messages were submitted to production. Security-header hardening remains the separate follow-up described in the plan.

## Reproduce

```powershell
node --test tests/*.test.mjs
npm run lint
$env:CIRCLE_NODE_TOTAL='2'
$env:NODE_OPTIONS='--max-old-space-size=1536'
npm run build
npm run start -- --port 3100
```

The browser/audit scripts expect `lighthouse`, `playwright`, and `@axe-core/playwright` in `$env:TEMP/veilcode-lighthouse-tools/node_modules`, or a directory set through `VEILCODE_AUDIT_TOOLS`. They use the installed Chrome executable and write evidence into `docs/lighthouse/`.

```powershell
node scripts/verify-lighthouse.mjs
node scripts/run-lighthouse.mjs
```

Set `VEILCODE_AUDIT_BASELINE_URL` to include a separately running original-code production server in alternating measurements. Facebook tracking beacons are blocked during Lighthouse measurements to avoid sending synthetic PageViews to the production Pixel. The original scripts are still downloaded in the baseline when enabled by the original code.
