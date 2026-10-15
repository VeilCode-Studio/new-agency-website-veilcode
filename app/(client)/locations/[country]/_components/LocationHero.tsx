"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import * as m from "framer-motion/m";
import type { LocationMarket } from "@/constants/locations";
import { GridBg, GlowOrb, SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, stagger } from "@/lib/motion";

const SERVICE_LABELS: Record<string, { label: string; href: string }> = {
  web: { label: "Web Solutions", href: "/services/web-solutions" },
  mobile: { label: "Mobile Applications", href: "/services/mobile-applications" },
  ai: { label: "AI Automation", href: "/services/ai-automation" },
  data: { label: "Data Analytics", href: "/services" },
  social: { label: "Social Marketing", href: "/services" },
};

export function LocationHero({ market }: { market: LocationMarket }) {
  return (
    <section className="relative min-h-[72vh] overflow-hidden flex items-center">
      <GridBg />
      <GlowOrb color="rgba(0,229,255,0.10)" size={560} top="5%" left="58%" />
      <GlowOrb
        color="rgba(16,217,160,0.07)"
        size={400}
        bottom="0%"
        left="0%"
        delay="2s"
      />

      <div
        aria-hidden
        className="absolute inset-x-0 h-px pointer-events-none bg-linear-to-r from-transparent via-brand/20 to-transparent animate-scan"
      />

      <div className="relative z-10 w-full max-w-300 mx-auto px-6 md:px-10 pt-36 pb-24">
        <m.div variants={stagger} initial="hidden" animate="visible" className="max-w-205">
          <m.div variants={fadeUp(0)}>
            <SectionTag>{market.eyebrow}</SectionTag>
            <AccentLine width={56} />
          </m.div>

          {market.locationBadge && (
            <m.div
              variants={fadeUp(0.04)}
              className="mb-5 inline-flex items-center gap-2 rounded-md border border-brand-border bg-brand-dim px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-brand"
            >
              <MapPin className="size-3.5" aria-hidden />
              <span>{market.locationBadge}</span>
            </m.div>
          )}

          <m.h1
            variants={fadeUp(0.08)}
            className="font-display font-extrabold leading-16 tracking-wider text-[clamp(40px,6vw,64px)] text-ink mb-6"
          >
            {market.h1}
          </m.h1>

          <m.p
            variants={fadeUp(0.16)}
            className="font-sans font-light text-lg text-ink-muted leading-relaxed max-w-145 mb-10"
          >
            {market.heroCopy}
          </m.p>

          <m.div variants={fadeUp(0.22)} className="flex flex-wrap gap-2.5">
            {market.serviceFocus.map((service) => {
              const item = SERVICE_LABELS[service] ?? { label: service, href: "/services" };

              return (
                <Link
                  key={service}
                  href={item.href}
                  className="font-mono text-[11px] tracking-widest uppercase px-3.5 py-1.5 rounded border border-line bg-surface text-ink-faint transition-colors hover:border-line-hi hover:text-ink"
                >
                  {item.label}
                </Link>
              );
            })}
          </m.div>

          <m.div variants={fadeUp(0.28)} className="mt-10 flex flex-wrap gap-3">
            <Link
              href={market.primaryCtaHref ?? "/start"}
              className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
            >
              {market.primaryCtaLabel ?? "Start a Project"}
            </Link>
            <Link
              href={market.secondaryCtaHref ?? "/services"}
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
            >
              {market.secondaryCtaLabel ?? "Explore services"}
            </Link>
          </m.div>

          {(market.statLine || market.stats?.length) && (
            <m.div
              variants={fadeUp(0.34)}
              className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/70 px-4 py-3 text-sm text-ink-muted"
            >
              {(market.stats ?? [market.statLine]).filter(Boolean).map((stat, index, list) => (
                <span key={stat} className="flex items-center gap-3">
                  <span className="font-medium text-ink">{stat}</span>
                  {index < list.length - 1 && <span className="text-brand">·</span>}
                </span>
              ))}
            </m.div>
          )}
        </m.div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-page to-transparent pointer-events-none"
      />
    </section>
  );
}
