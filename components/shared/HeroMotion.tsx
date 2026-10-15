import type { ReactNode } from "react";
import { StatItem } from "../extras/StatItem";
import { STATS } from "@/constants";

// Essential hero content is static HTML; decorative motion is handled by CSS.
export function HeroContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function HeroTypewriter({ words }: { words: readonly string[] }) {
  return <p aria-hidden="true" className="font-mono text-sm tracking-wide text-brand mb-10 min-h-[1.5em]"><span className="text-ink-faint">&gt; </span>{words.join(" \u00b7 ")}</p>;
}

export function HeroStats() {
  return <div className="flex flex-wrap gap-10 md:gap-16 mb-10 mt-5">{STATS.map((stat) => <StatItem key={stat.val} {...stat} />)}</div>;
}

export function HeroScrollCue() {
  return <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" aria-hidden="true"><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint">Scroll</span><div className="w-px h-10 bg-linear-to-b from-brand to-transparent" /></div>;
}
