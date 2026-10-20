# Location redesign

Scope: Uganda, United States, United Kingdom, Canada, Australia, and the location index referenced by their breadcrumbs. Homepage design patterns are the visual source: 1200px content, existing fonts, theme-aware periwinkle/peach/mint surfaces, browser-frame imagery, offset context cards, and restrained interaction feedback. No admin work, framework migration, dependencies, database writes, or deployment.

## Audit and implementation decisions

- Keep the existing dynamic route, metadata helper, parallel `Promise.allSettled` queries, country content, country SEO-page links, and conditional recovery notice. A failed query must not replace the whole location page with an error.
- Render the hero on the server. The old client hero serialized the entire market object and hydrated Framer Motion for a static presentation. Remove the location-only animation boundary; shared navigation, theme controls, and other routes retain their existing behavior.
- Replace raw CSS portfolio backgrounds with `next/image`, reserved aspect ratios, responsive sizes, and lazy loading. Reuse the approved 68KB homepage studio illustration, with one eager, high-priority hero image and precise mobile sizing. Keep project-kind labels honest; missing selected projects are omitted rather than replaced with invented market engagements.
- Preserve unique market headings, titles, descriptions, canonical URLs, and social cards. Clear inherited generic keyword metadata. Use one H1 and logical H2/H3 sections, visible breadcrumbs and cross-market links, and native keyboard-accessible FAQ details. FAQ answers remain in server HTML without a JavaScript dependency.
- Add `/locations` because the existing breadcrumb pointed to a missing route. Include the hub in the sitemap and update only the location last-modified dates. Uganda retains its Kampala address; foreign service areas do not acquire fictitious offices. Do not promise FAQ rich results for a commercial agency.
- Keep all four themes and reduced-motion behavior. Avoid scroll-reveal hiding, content visibility tricks, autoplay, WebGL, and new fonts. Keep normal Next Link navigation/prefetch behavior.
- On mobile, show delivery assurances immediately after the CTAs and before the studio illustration. Desktop retains the side-by-side composition and full-width assurance band. These are independent informational blocks; keyboard focus order is unchanged.
- Clarify the existing US time conversion for seasonal daylight saving. [NIST's time-zone reference](https://www.nist.gov/pml/time-and-frequency-division/local-time-faqs) distinguishes EST (UTC−5) and EDT (UTC−4).

## Verification plan

1. Existing Node regression suite, full ESLint, TypeScript through production build.
2. Actual server responses: unique metadata, canonical/social images, business and breadcrumb JSON-LD, all internal content destinations, hub, unknown-market 404/noindex, sitemap.
3. All five pages in light, linen, midnight, and dark: WCAG A/AA axe checks; keyboard FAQ opening/closing; separately audit expanded answers and native operation without JavaScript.
4. Check 1440×900, 1280×720, 768×1024, 390×844, and 320×740 for overflow and visible hero CTAs. Save desktop/mobile linen screenshots. Verify one eager high-priority hero image, optimized sources, and lazy portfolio images after scrolling.
5. Production Lighthouse: three simulated mobile runs and one desktop run per market. Report medians, LCP, TBT, CLS, transferred bytes, failed audits, and limitations. Local lab scores do not establish field Core Web Vitals.
6. Smoke-check shared homepage navigation and theme behavior after the small location-specific navigation/footer class additions. Intercept test writes to forms/chat/newsletter.

## Sources and constraints

Implementation follows [Next Image guidance](https://nextjs.org/docs/app/api-reference/components/image), [Google breadcrumb documentation](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business), and [multi-regional site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites). Market pages target distinct audiences in the same language; they are not automatically declared translations with hreflang.

Baseline JSON is retained under `before/`. The existing preview had intermittent database timeouts and direct external image access failures, and development checks ran on the same machine. Those runs are diagnostic evidence, not a controlled performance comparison. Final results must be measured against the rebuilt production server with working database/image access.
