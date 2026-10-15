"use client";

import * as m from "framer-motion/m";
import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, stagger, useReveal } from "@/lib/motion";
import { ValueCard } from "./ValueCard";
import { VALUES } from "@/constants";

export function CoreValues() {
  const [ref, inView] = useReveal();

  return (
    <section className="py-32 px-6 md:px-10 bg-surface border-y border-line">
      <div className="max-w-300 mx-auto">

        {/* Header */}
        <m.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16"
        >
          <m.div variants={fadeUp()}>
            <SectionTag>Core Values</SectionTag>
            <AccentLine />
          </m.div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <m.h2
              variants={fadeUp(0.1)}
              className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
                tracking-tight text-ink leading-[1.1] max-w-120"
            >
              The Principles We{" "}
              <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
                Refuse to Compromise
              </span>
            </m.h2>

            <m.p
              variants={fadeUp(0.18)}
              className="font-sans text-[15px] text-ink-muted max-w-90 leading-relaxed"
            >
              These aren&apos;t aspirational statements. They&apos;re operational
              commitments that shape how we hire, how we work, and how we deliver.
            </m.p>
          </div>
        </m.div>

        {/* Cards grid — 3 × 2 */}
        <m.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {VALUES.map((v, i) => (
            <ValueCard key={v.number} value={v} index={i} />
          ))}
        </m.div>
      </div>
    </section>
  );
}