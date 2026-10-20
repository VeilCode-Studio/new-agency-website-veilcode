import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { ContactForm } from "../contact/_components/ContactForm";

export default function StartProjectPage() {
  return (
    <div className="min-h-dvh bg-page px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-180">
        <div className="public-standalone-nav">
          <Link href="/">← Back to VeilCode</Link>
          <ThemeToggle size="sm" />
        </div>
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">
            Start a project
          </p>
          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold tracking-tight text-ink">
            Tell us what you need.
          </h1>
          <p className="mx-auto mt-4 max-w-130 font-sans text-sm leading-relaxed text-ink-muted sm:text-base">
            Four quick details are enough to begin. We&apos;ll work through the
            scope together.
          </p>
        </div>
        <ContactForm standalone showBudget={false} />
      </div>
    </div>
  );
}
