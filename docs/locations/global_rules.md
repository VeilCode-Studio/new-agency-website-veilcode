# GLOBAL CONTEXT FOR ALL LOCATION PAGES

Stack: Next.js 15, Tailwind v4, shadcn/ui, Framer Motion, TypeScript
File location: /app/locations/[slug]/page.tsx (or equivalent route)
Shared components: Navbar, Footer already exist — do not rebuild them
Design system: VeilCode brand uses indigo-blue as default theme

TECHNICAL FIXES REQUIRED ON EVERY PAGE:

1. Title tag must NOT duplicate the brand name. Format: "[Page Title] | VeilCode" — never "VeilCode | VeilCode"
2. OG image must NOT use the logo. Use a project screenshot or a location-specific hero image variable
3. Meta keywords must be unique per page — either page-specific or removed entirely
4. Every page must include JSON-LD structured data (LocalBusiness or ProfessionalService schema)
5. Add canonical tag pointing to the correct URL

CONTENT RULES:

- No placeholder "Pricing context" sections. Either show real price anchors or remove the heading entirely
- Portfolio must show projects with a connection to that market (add a relevance note if needed)
- Every FAQ must include one entry that directly addresses the remote/offshore trust question
- Add a visible "cross-market" footer link section: "Also serving [other markets]"
- Hero H1 must contain the target keyword naturally (not bolted on)
