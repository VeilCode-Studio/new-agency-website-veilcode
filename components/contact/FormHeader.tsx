// components/contact/FormHeader.tsx
import * as m from "framer-motion/m";

export function FormHeader() {
  return (
    <m.div
      className="px-8 py-6 border-b border-line flex items-center gap-3 bg-surface"
    >
      <div className="size-2.5 rounded-full bg-brand shadow-[0_0_10px_var(--color-brand-dim)]" />
      <span className="font-mono text-xs tracking-widest uppercase text-ink-muted">
        Project Enquiry Form
      </span>
    </m.div>
  );
}