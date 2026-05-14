import Link from "next/link";
import type { LocationMarket } from "@/constants/locations";

export function LocationHero({ market }: { market: LocationMarket }) {
  return (
    <section className="relative overflow-hidden border-b border-line px-6 pb-20 pt-36 md:px-10">
      <div
        aria-hidden
        className="absolute right-[-8%] top-16 h-90 w-90 rounded-full bg-brand-dim blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-300">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-brand">
          {market.eyebrow}
        </p>
        <h1 className="max-w-220 font-display text-[clamp(42px,6vw,78px)] font-extrabold leading-[1.02] tracking-tight text-ink">
          {market.h1}
        </h1>
        <p className="mt-7 max-w-170 text-lg leading-relaxed text-ink-muted">
          {market.heroCopy}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/start"
            className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            {market.ctaLabel}
          </Link>
          <Link
            href="/services"
            className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
          >
            Explore services
          </Link>
        </div>
      </div>
    </section>
  );
}
