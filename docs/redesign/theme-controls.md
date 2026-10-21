# Linen default and visible mobile theme control

Implemented 21 October 2026. Linen is the default when a visitor has no saved theme. Existing saved light, dark, midnight, linen and system preferences are respected.

## UI review

| Before | After | Why |
| --- | --- | --- |
| New visitors defaulted to Midnight. | New visitors default to Linen; the switcher's fallback also uses Linen. | Match the requested default consistently. |
| Navbar theme control was hidden below 640 px. | The same control is visible beside the mobile navigation button, with a 44 px touch target below 640 px. Existing desktop sizing is retained. | Make theme selection directly available without opening navigation. |
| Lists between the theme menu and its menuitemradio buttons had native list roles. | Those structural lists use presentation roles. | Expose the menu's radio items with the correct accessible hierarchy. |

The existing drawer control remains available. Theme choices, persistence, styles and loading behavior continue to use the existing ThemeToggle and next-themes provider. No dependencies, runtime requests or client state were added.

## Verification

- Production build, TypeScript, all 66 automated tests, targeted ESLint and `git diff --check` passed.
- Twelve production browser cases passed across the homepage, US location page and web-solutions service page at 320, 390, 768 and 1440 px, covering all three navbar variants.
- Fresh contexts defaulted to Linen even with a dark operating-system preference. Five additional saved-preference checks preserved light, dark, midnight, linen and system settings.
- The theme button was visible with navigation closed. Mobile touch targets measured 44 by 44 px; dropdowns fit within the viewport and did not collide with the logo.
- Touch/mouse theme selection, persistence after reload, keyboard opening, Escape dismissal and mobile navigation opening/closing passed. All three visible theme choices were exercised.
- Twelve WCAG A/AA navbar audits with the theme menu open passed with zero violations. No horizontal overflow or browser runtime errors were observed.
- Phone and desktop screenshots were visually reviewed. No Lighthouse or field Core Web Vitals result is claimed for this scoped UI change.

Review: plan alignment, system integrity and production verification passed. No unresolved implementation issue was found.

Evidence: [theme-control verification results](verification/theme-controls-results.json).
