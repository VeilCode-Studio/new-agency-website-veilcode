# Homepage presentation patterns

The redesign lives in `components/home/`; `Homepage.tsx` is server-only. `homepage.css` is scoped to `.homepage` and named homepage classes. Other public pages keep their existing visual system.

| Pattern | Decision |
| --- | --- |
| Theme surfaces | Reuse `--page`, `--surface`, `--line`, `--ink`, `--ink-muted`. Linen uses warm paper; light uses white; dark/midnight retain their current surfaces. |
| Accent palette | Periwinkle `#6c82f5`, peach `#ffc49e`, mint `#a3e4d1` for decoration. Use separate AA-readable link/button tokens, with brighter text accents in dark themes. |
| Typography | Existing system sans and mono stacks. Body 400; headings 750–850. Major headings use a fluid 29–42px scale; the hero adapts to both viewport width and short laptop heights. |
| Layout | 1200px content maximum, 64/48/40px total responsive gutters; 90/72/60px section padding. Cards flow from three columns to two or one; industry links from six to three to two. |
| Service cards | Soft 28–38px corners, a single orbit motif, quiet surface border and slight offset base. |
| Process/benefit cards | Strong border, small radius, offset shadow, colored heading strip. Numbers retain full contrast. |
| Actions | One link or button per action, 44px minimum controls, visible focus outlines, immediate CSS feedback. Navigation buttons use `next/link`; same-page jumps use native anchors. |
| Media | Fixed ratios or intrinsic dimensions, responsive `sizes`, eager/high priority only for the hero, lazy loading elsewhere. Project kinds stay explicit. |
| Interaction | Server-rendered native FAQ disclosures. Gallery controls scroll existing DOM; no autoplay, hidden-on-scroll text, WebGL, or animation runtime. Form client uses the current JSON API and shows real pending/error/success states. |
| Theme switching | Keep all four provider themes and saved preferences. Homepage colors are presentation tokens; they do not replace the root theme definitions. |

Keep future page redesigns separate until their own content and performance baseline have been reviewed. These are homepage patterns, not authorization to restyle the admin application.
