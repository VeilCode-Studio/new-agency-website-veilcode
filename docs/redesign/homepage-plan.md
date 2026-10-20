# Homepage redesign: audit and implementation

20 October 2026 · Africa/Kampala. Scope: the public homepage. Reference: `public/snapshots/new-design.png` (1920 × 28800).

Implementation is complete. See [final results and validation](results.md) for the measured outcome and remaining mobile LCP limit.

## Existing architecture to preserve

- Next.js 16.1.6 App Router, React 19, Tailwind 4. No framework upgrade or caching migration is needed.
- `app/(client)/page.tsx` is an async Server Component: four queries run concurrently, `revalidate = 300`, and query failures propagate so ISR keeps the last successful page. Successful CMS API mutations invalidate `/`.
- Shared navigation, chatbot state, theme provider, and footer live in layouts. The homepage does not import Framer Motion. Other routes retain their existing animation boundaries.
- Published services, three selected projects, published blog posts, and testimonials come from the current query layer. No schema, content-management, admin, authentication, or deployment changes are part of this redesign.
- Canonical/OG/Twitter metadata uses `buildPageMetadata`; root Organization JSON-LD, robots, sitemap and existing redirects remain. Only the homepage sitemap modification date needs updating when its content changes.
- `next/image` already handles responsive CMS media. The chatbot panel loads on activation; tracking is gated; newsletter HTTP code loads on submission. Keep these properties.
- Theme tokens already cover light, linen, dark and midnight. Keep the provider, saved preferences, selector and default. The reference's cream/white cards work with both light themes. Add homepage-specific visual tokens rather than recoloring every route.

## Reference interpretation

The design uses a compact pale navigation bar, a photographic dark hero with a bold centered headline and two CTAs, a scalloped transition, trust names, browser-window statistic cards, a product mockup, softly rounded service cards, six offset-shadow process cards, featured work, an industry showcase, six benefit cards, a local-service section, a project CTA, platform tiles, testimonials, pricing, FAQ/contact columns, three articles and a closing blue CTA.

Several project/platform/map images are blank in the supplied capture. Treat those as missing media, not a request for empty sections. Reuse actual VeilCode content and existing project media. The screenshot's Kico name, phone numbers, reviews, numerical sales claims and UGX package prices are not VeilCode data. Do not copy them. Existing pricing lives in `constants/index.ts` (`TIERS`). Existing FAQs and process language are reusable; use six presentation stages without changing the service process elsewhere.

## Build decisions

1. Create homepage-specific server-rendered presentation components and a scoped stylesheet; retain the current page data pipeline and metadata.
2. Follow the reference section order, keeping all useful content visible without JavaScript. Use real links, native FAQ disclosure elements, and CSS scroll-snap for showcases instead of an autoplay library. No WebGL globe, embedded map, live review iframe, counter animation or scroll-hidden essential content.
3. Make the inquiry form a small client component using native `fetch` against the existing `/api/messages`. Preserve accepted service and budget values. The API has no phone field; the new form follows the existing contract. Do not import the existing animated contact form (which would add Motion and Axios to home), or the unused demo form variant (which simulates success).
4. Use the generated workspace photograph only as a decorative hero background. Compress it to WebP. Keep one high-priority hero image, lazy responsive lower-page images, stable image ratios and no theme-specific duplicate image downloads. Keep the current system font stack.
5. Scope navigation/footer presentation adjustments to `/`; keep all other route rendering and admin intact. Same-page links remain native anchors. Preserve deliberate prefetch opt-outs on major CTAs; avoid prefetching every project/article link on the long page.
6. Use published project client names for the work strip and technology names for platform tiles; do not imply endorsements or external review ratings that the database does not establish.

## Performance and verification

The previous controlled mobile median (15 October) was 87 performance / 100 accessibility / 100 best practices / 100 SEO, LCP 2.74 s, TBT 387 ms, CLS 0 and 284 KiB transfer. These are historical lab results, not a current field baseline. The newly supplied mobile JSON is for a **blog article**, not `/`; its 92 must not be presented as the homepage score.

Capture a pre-redesign production-build audit separately from the old evidence. Rebuild after implementation, then repeat three mobile runs and one desktop run using `scripts/audit-homepage.mjs`. Keep pre/post reports in separate directories. Compare medians and individual runs; local machine contention can affect timings. Targets: 90+ mobile performance, 100 accessibility/best practices/SEO, LCP ≤2.5 s, lab TBT ≤200 ms, CLS ≤0.1 (prefer ≤0.02). Real-user p75 INP ≤200 ms needs field measurements; Lighthouse TBT does not prove INP.

Run production build, TypeScript and ESLint, the 43 existing Node regression tests, and browser checks across all four themes and mobile/desktop layouts. Verify actual theme switching, keyboard navigation, FAQ, scroll-snap controls, inquiry pending/error/success with intercepted requests, valid destinations, no-JavaScript content, reduced motion, image loading and deferred chat/network behavior. Do not send real inquiries or marketing events during tests.

Baseline source checks on this turn: 43 Node tests passed; ESLint passed with zero errors and 18 existing warnings. Preserve these counts or explain differences.

## Primary guidance checked

- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image): responsive sizes, reserved dimensions and selective image priority. Use Next.js 16's supported image API rather than adding indiscriminate preloads.
- [Next.js prefetching](https://nextjs.org/docs/app/guides/prefetching): prefetch is a resource/latency trade-off; preserve current intentional opt-outs.
- [Next.js ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration): preserve static regeneration and successful-page fallback on errors.
- [Web Vitals](https://web.dev/articles/vitals): assess LCP, CLS and INP independently of a single Lighthouse score.

## Future work outside this change

Admin extraction remains a separate application project. Retain its queries, writes and invalidation today. Some non-testimonial admin server actions currently invalidate their admin listing without invalidating home; the existing API mutation handlers do invalidate home. Audit all write paths during a later CMS/cache pass. Do not silently change admin behavior in a visual redesign.
