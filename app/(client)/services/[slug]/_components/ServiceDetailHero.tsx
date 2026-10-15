"use client";

import Link from "next/link";
import * as m from "framer-motion/m";
import { GridBg, GlowOrb, SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, stagger } from "@/lib/motion";
import type { Service } from "@/db/schema";

export function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section className="relative min-h-[72vh] overflow-hidden flex items-center">
      <GridBg />
      <GlowOrb color="rgba(0,229,255,0.10)" size={560} top="5%" left="58%" />
      <GlowOrb
        color="rgba(192,132,252,0.07)"
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
            <SectionTag>{service.tagline}</SectionTag>
            <AccentLine width={56} />
          </m.div>

          <m.h1
            variants={fadeUp(0.08)}
            className="font-display font-extrabold leading-[1.02] tracking-tight text-[clamp(40px,6.5vw,80px)] text-ink mb-6"
          >
            {service.h1 || service.title}
          </m.h1>

          <m.p
            variants={fadeUp(0.16)}
            className="font-sans font-light text-lg text-ink-muted leading-relaxed max-w-145 mb-10"
          >
            {service.intro}
          </m.p>

          <m.div variants={fadeUp(0.22)} className="flex flex-wrap gap-2.5">
            {service.supportingCapabilities.slice(0, 4).map((item) => (
              <span
                key={item}
                className={`font-mono text-[11px] tracking-widest uppercase px-3.5 py-1.5 rounded border ${service.deepDiveClasses.dimBg} ${service.deepDiveClasses.border} ${service.deepDiveClasses.accent}`}
              >
                {item}
              </span>
            ))}
          </m.div>

          <m.div variants={fadeUp(0.28)} className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/start"
              className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
            >
              Start a project
            </Link>
            <Link
              href="/services"
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
            >
              Explore services
            </Link>
          </m.div>
        </m.div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-page to-transparent pointer-events-none"
      />
    </section>
  );
}
