import Link from "next/link";
import { PrimaryButton, GhostButton, GridBg, GlowOrb, AccentLine } from "@/components/extras/Primitives";
import { ServiceVisualField } from "@/components/extras/ServiceVisualField";
import { TYPEWRITER_WORDS } from "@/constants";
import { HeroParallax, HeroScrollCue, HeroStats, HeroTypewriter } from "./HeroMotion";

// Server component: the H1 and intro paragraph are static, server-rendered
// HTML. Motion (parallax, typewriter, stats, scroll cue) lives in client
// islands from ./HeroMotion.

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pb-16">

      {/* Grid */}
      <GridBg />
      <ServiceVisualField />

      {/* Orbs */}
      <GlowOrb color="rgba(0,229,255,0.12)" size={600} top="12%" left="55%" />
      <GlowOrb color="rgba(16,217,160,0.08)" size={400} bottom="8%" left="4%" delay="2.5s" />

      {/* Horizontal scan line */}
      <div
        aria-hidden
        className="absolute inset-x-0 h-px pointer-events-none
          bg-linear-to-r from-transparent via-brand/20 to-transparent
          animate-scan"
      />

      {/* Parallax wrapper */}
      <HeroParallax className="relative z-10 w-full max-w-300 mx-auto px-6 md:px-10 pt-36 pb-24">
        {/* Available badge */}
        <div className="inline-flex items-center gap-2.5
          bg-brand-dim border border-brand-border
          rounded-full px-4 py-1.5 mb-10">
          <span className="size-1.5 rounded-full bg-brand
            shadow-[0_0_8px_var(--color-brand)]
            animate-[pulse-glow_2s_ease-in-out_infinite]" />
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-brand">
            Available for web, mobile and AI projects
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-extrabold leading-[1.05] tracking-tight
            text-[clamp(36px,5.6vw,72px)] text-ink mb-6 max-w-225"
        >
          Web development, mobile apps and AI automation!
        </h1>

        {/* Intro */}
        <p className="font-sans text-lg font-light text-ink-muted max-w-140 leading-relaxed mb-4">
          Founder-led studio. You work directly with the engineer building your product.
        </p>

        {/* Decorative typewriter (aria-hidden) */}
        <HeroTypewriter words={TYPEWRITER_WORDS} />

        {/* CTAs */}
        <PrimaryButton className="text-[15px]! px-8! py-4!">
          <Link href="/start">Start a Project</Link>
        </PrimaryButton>
        <GhostButton className="text-[15px]! px-8! py-4! ml-2">
          <Link href="/work">See our work</Link>
        </GhostButton>

        {/* Stats */}
        <AccentLine width={60} />
        <HeroStats />
      </HeroParallax>

      {/* Scroll indicator */}
      <HeroScrollCue />
    </section>
  );
}
