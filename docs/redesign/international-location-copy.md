# International location copy update

Completed 21 October 2026 for the United States, United Kingdom, Canada and Australia location pages, following the supplied task. The homepage and Uganda content are unchanged.

## Changes

- `constants/locations.ts`: requested copy, metadata descriptions, FAQ entries and five commented HOLD entries. The Canadian payment FAQ uses the supplied safe answer pending a billing-currency decision.
- `components/pricing/pricing-data.ts`: explicit approved regional starting prices, replacing the earlier benchmark-discount calculation. US and Canadian Ecommerce packages use SMS and email order alerts; UK and Australian packages retain WhatsApp ordering.
- `app/(client)/locations/[country]/_components/LocationBody.tsx`: supports the requested PlumberAnswered link inside its FAQ answer. Existing FAQ markup and page layout remain in place.
- `tests/location-uganda-phase1.test.mjs` and `tests/website-pricing.test.mjs`: existing expectations updated to the approved copy, prices and market-specific features.
- Pricing documentation updated to distinguish the current approved amounts from historical pricing research and evidence.

No additional self-describing “senior” sentences were found beyond the supplied replacements. The comparison to a senior Canadian agency is retained, as permitted. Client build / Concept build labels and Australia's “Agency project work vs. offshore hiring” section are unchanged.

## HOLD decisions

All five entries remain commented out in `constants/locations.ts` and are excluded from rendered content:

1. US payment FAQ: Frank must confirm the accepted payment method.
2. UK international GDPR FAQ: Frank must confirm he will sign a data processing agreement and the required UK international-transfer terms.
3. Canadian payment FAQ replacement: Frank must confirm CAD or USD invoicing before replacing the safe live answer.
4. Canadian PIPEDA / Quebec Law 25 FAQ: Frank must confirm the DPA commitment and documentation of data storage and access.
5. Australian data-storage FAQ: Frank must confirm hosting in the client's name, Australian-region availability and the DPA commitment.

## Verification

- Production build passed, including TypeScript and all 41 static pages. All 66 existing automated tests passed; targeted ESLint passed.
- Production browser checks passed for all four pages at 1440 px and 390 px: exact prices by package, three From labels, unchanged proposal note, market-specific order features, exact FAQ answers, updated description / Open Graph / Twitter metadata, preserved internal links and project labels, no forbidden phrases, no HOLD content, no placeholder text, and no horizontal overflow or browser runtime errors.
- All existing JSON-LD blocks parsed successfully and location descriptions matched the metadata. These location pages do not emit FAQPage JSON-LD, so no FAQ schema required updating.
- Eight WCAG A/AA audits of pricing and the expanded FAQ sections passed with zero violations. Pricing and FAQs rendered on all four pages with JavaScript disabled. The PlumberAnswered case study returned HTTP 200.
- Homepage and Uganda main copy, internal links and JSON-LD matched the before-change baseline after whitespace normalization. Uganda's data and the Australian offshore-hiring section matched exactly.
- The pre-existing decorative `[ ]` mobile-service icon remains; no square-bracket placeholder is active. All changed copy was checked for em dashes.

Evidence: [production browser results](verification/international-location-copy-results.json). No new Lighthouse or field Core Web Vitals score is claimed for this copy update. No dependencies, client state, database queries, layout rules or rendering/cache policies were added.
