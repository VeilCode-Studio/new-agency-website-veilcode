# GLOBAL CONTEXT FOR ALL LOCATION PAGES

Stack: Next.js 15, Tailwind v4, shadcn/ui, Framer Motion, TypeScript
File location: /app/locations/[slug]/page.tsx (or equivalent route)
Shared components: Navbar, Footer already exist — do not rebuild them
Design system: VeilCode brand uses indigo-blue as default theme

TECHNICAL FIXES REQUIRED ON EVERY PAGE:

1. Title tag must NOT duplicate the brand name. Format: "[Page Title] | VeilCode" — never "VeilCode | VeilCode". Keep titles to roughly 60 characters; Google truncates or rewrites long ones
2. OG image must NOT use the logo. Use a project screenshot or a location-specific hero image variable. The shared fallback is DEFAULT_OG_IMAGE
3. Do not emit a meta keywords tag (Google ignores it). Location pages set `keywords: []`
4. Add LocalBusiness or ProfessionalService JSON-LD to location pages only, and only with details that are true (no invented street addresses; only Uganda has an address locality)
5. Add canonical tag pointing to the correct URL
6. Location pages share one hreflang set (en-UG, en-US, en-GB, en-CA, en-AU) plus x-default pointing to /locations. Source: lib/seo/locationAlternates.ts

CONTENT RULES:

- No placeholder "Pricing context" sections. Either show real price anchors or remove the heading entirely
- Portfolio must show projects with a connection to that market (add a relevance note if needed)
- Every FAQ must include one entry that directly addresses the remote/offshore trust question
- Add a visible "cross-market" footer link section: "Also serving [other markets]"
- The hero H1 should include the target keyword in a natural way (not bolted on)
