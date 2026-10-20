# Remaining client pages

Scope: About, Services and service details, Work and case studies, Blog and articles, Contact, Start, Careers, search landing pages, newsletter outcomes, privacy policy and the public 404. Homepage and location templates are completed references. Admin and authentication remain outside this change.

The existing homepage establishes typography, 1200px content width, periwinkle/peach/mint accents, warm linen, restrained cards and visible native controls. Extend those patterns through a scoped public presentation layer. Keep existing queries, CMS fields, structured data, metadata builders, ISR/dynamic policies, API payloads and submission workflows. No new UI dependencies or architecture migration. A targeted framework update is documented below.

Audit findings: most public text sections hydrate solely for scroll reveals; portfolio cards log complete records to the browser; case-study hero images use raw image elements without responsive optimization; newsletter outcome pages hard-code a separate light-only palette; public search pages expose internal admin/SEO implementation language; privacy links to a cookie policy route that does not exist. Address these as part of presentation and navigation quality. Do not invent business evidence, offices, teammates or prices.

Implementation: server render static presentation, preserve small stateful islands, provide consistent heroes/breadcrumbs, readable responsive content, colored service/process cards, accessible native FAQs, reserved image ratios and accurate responsive sizes. Keep every existing theme. Verify published route templates, metadata and links, forms with mocked writes, filters, keyboard/mobile navigation, responsive layouts, no-JS static content, accessibility and production builds. Measure representative index/detail routes in production. Carry forward the documented location LCP budget misses and unisolated intermittent hydration observation; do not claim these resolved without evidence.


## Verification findings and framework investigation

The first full matrix found a missing ARIA tablist in the existing blog filters, overflowing contact social links at 320px, long case-study metrics overflowing two-column cards, and unfocusable scrollable code examples. The redesign fixes these with pressed filter buttons, wrapping links, a narrow-screen results layout, and named keyboard-focusable code regions.

All 88 case-study/article images loaded after the source-delivery checks and retries. Cold remote downloads did time out in this local environment; keep that limitation distinct from the subsequent warm-cache checks. The new `publicImageSource` helper bounds plain versioned Cloudinary originals to 2400px with automatic format/quality before the existing Next.js optimizer fetches them. It does not rewrite stored URLs, signed deliveries, local files or existing transforms. See [Cloudinary optimization documentation](https://cloudinary.com/documentation/image_optimization) and [Next.js Image documentation](https://nextjs.org/docs/app/api-reference/components/image).

The intermittent hydration observation reproduced in production, then in an isolated development preview on navigation 36. The detailed trace expected a `div.flex.flex-wrap.gap-2` around the service stack but reported its first `span` as the next node. The raw server HTML contained the correct wrapper; the stack included `replaySuspendedUnitOfWork`. This closely matches the reported [React replay cursor defect](https://github.com/react/react/issues/37584) and its [upstream fix](https://github.com/react/react/pull/35494). The installed Next 16.1.6 renderer is `19.3.0-canary-f93b9fd4-20251217`; its host replay path lacks the cursor rewind. The 16.1.7 patch has the same renderer. Inspection of stable Next 16.2.12 showed the matching rewind in its `19.3.0-canary-3f0b9e61-20260317` renderer. Test that compatible update rather than suppressing errors, disabling SSR, or altering the site architecture.

The isolated development helper lived outside the repository, used a separate ignored build directory and the existing SELECT-only review transport, and was stopped after diagnosis. Its automatically generated TypeScript include changes were restored. No app configuration override or framework vendor patch is part of the redesign.


## Final integration

Retained Next.js 16.2.12 after full production builds, the existing regression suite and browser checks passed. This is the only application dependency change; route rendering/caching policies, database models, query implementations, APIs and authentication stay in place. The final normal network-enabled builds and production preview use the database directly, without the temporary SELECT review transport. That transport and the isolated development server were stopped.

A separate browser test reproduced a publication-date hydration mismatch for America/Los_Angeles. The shared date formatter now uses UTC explicitly, matching ISO publication dates across server and reader timezones. A regression test and browser checks in Los Angeles, Kiritimati and Tokyo cover this case.

Two existing admin preview pages reuse the public case-study/article components. Only their client-content areas receive PublicShell so the previews display the redesigned pages correctly. Administrative banners, controls, authentication and queries are unchanged; no admin application or migration was built.

Enquiry and newsletter forms retain their API payloads and validation. They disable controls until hydration and while pending, provide no-JavaScript alternatives, preserve drafts on errors and announce completion through status regions. Project, footer and mobile menu navigation uses Next.js links. Portfolio props include only the cover image rather than each project's full gallery. Legal sections use semantic headings; newsletter outcomes have descriptive metadata while retaining noindex.
