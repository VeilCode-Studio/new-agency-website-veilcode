# Shared website pricing

Implemented October 21, 2026, using the user-provided pricing screenshot. The international location-copy update supplies explicit regional starting prices, superseding the earlier researched-benchmark discount and currency-conversion approaches.

## Component and scope

`components/pricing/WebsitePricing.tsx` is the single Server Component used on the homepage and all five location pages. It replaces the homepage-only pricing function. Its CSS is isolated in a co-located CSS module; old homepage pricing rules were removed. The service index, admin previews and their legacy `TIERS` data remain outside this change.

The homepage preserves its pricing-section position and heading. Location pricing appears before each market's FAQ section. The cards use Starter, Business and Ecommerce, the supplied descriptions and inclusions, and a Most Popular badge for Business. Pricing is semantic HTML with native links, no new client state, animation, images, database queries or API calls.

The homepage and Uganda use the screenshot's exact prices and local features. The US, UK, Canada and Australia use their own currency codes, customer wording, payment-gateway wording and shipping-zone wording. US and Canadian Ecommerce packages use SMS and email order alerts; UK, Australian and Ugandan packages retain WhatsApp ordering. The US FAQ states the USD 1,500 website starting price separately from the existing custom-project range. The shared Server Component, route policies and themes are preserved.

## Removal

Set `WEBSITE_PRICING_ENABLED = false` in `components/pricing/pricing-data.ts` to hide the entire section everywhere. No route edits are required. To remove the implementation completely, remove its two call sites/imports in `Homepage.tsx` and `LocationBody.tsx`, then delete `components/pricing` and `tests/website-pricing.test.mjs`. Its section notes disappear with it.

## Regional pricing policy

The US, UK, Canadian and Australian prices are explicit amounts approved in the international location-page task. They are stored in `REGIONAL_PACKAGE_PRICES` in `components/pricing/pricing-data.ts`. The [earlier research](pricing-research.md) is historical context and no longer determines displayed amounts.

International cards say **From**. There is no exchange-rate conversion, benchmark-discount calculation, runtime pricing request or public competitor-discount claim.

| Page | Currency | Starter | Business | Ecommerce |
| --- | --- | ---: | ---: | ---: |
| Home and Uganda | UGX | 900,000 | 1,800,000 | 3,500,000 |
| United States | USD | 1,500 | 2,900 | 4,500 |
| United Kingdom | GBP | 1,200 | 2,300 | 3,500 |
| Canada | CAD | 2,000 | 3,900 | 6,000 |
| Australia | AUD | 2,200 | 4,300 | 6,800 |

Website packages are distinguished from mobile apps, AI automation and larger custom builds. Final scope, price and billing currency are confirmed in the proposal. The user requested this regional positioning; Uganda and the homepage retain their original amounts.

## Current validation

See the [international location-copy report](international-location-copy.md) for the current build, copy, metadata, pricing, FAQ and protected-page checks.

## Historical validation of the initial pricing component

The following evidence predates the international copy update and its explicit regional prices. It records validation of the initial component after replacing FX pricing with regional benchmarks. Screenshots and result files in this section show those previous regional amounts.

- Production build passed, including TypeScript and generation of all 41 static pages. Existing route rendering/cache policies remain unchanged.
- All 66 automated tests passed. Pricing tests cover exact Uganda amounts and inclusions, all twelve regional prices, the exact 15% arithmetic against independent benchmarks, market-specific features, From labels, removal of FX copy, server markup, enquiry links, unknown-market handling and the global removal switch.
- Targeted ESLint and `git diff --check` passed. No new application dependency was added.
- Browser checks passed on the homepage and all five location pages at 390 px and 1440 px in light, linen, dark and midnight themes (48 cases). Prices, feature lists, badges and enquiry links were correct; cards and the section had no overflow. Desktop prices, first feature rows and button bottoms aligned. No browser errors were observed.
- Six additional layout checks passed on home and the US page at 320 px, 820 px and 1000 px.
- Twenty-four WCAG A/AA pricing-section audits passed without violations, covering all themes on home and the US page, plus the other markets in linen.
- All six pages displayed their package prices with JavaScript disabled. The US package CTA navigated to the existing project form without submitting any enquiry.
- SEO and keyboard checks passed on all six routes: original page titles and H1s, correct canonicals, indexable robots tags, parseable existing JSON-LD, visible keyboard focus and enquiry targets at least 44 px tall.
- The linen desktop and mobile captures below were visually reviewed. No fresh Lighthouse or field Core Web Vitals score is claimed for this scoped content/component change.

Evidence: [responsive/theme results](verification/pricing-results.json), [SEO and keyboard results](verification/pricing-seo-results.json), [homepage desktop](verification/pricing-home-linen-1440.png), [homepage mobile](verification/pricing-home-linen-390.png), [US desktop](verification/pricing-us-linen-1440.png), [US mobile](verification/pricing-us-linen-390.png).

Review: plan alignment passed (one shared removable section, requested copy and researched regional prices at 15% below selected benchmarks); system integrity passed (server rendering, existing queries/authentication/cache policies, shared theme tokens and scoped CSS); production checks passed for the scope above. No unresolved implementation issue was found.
