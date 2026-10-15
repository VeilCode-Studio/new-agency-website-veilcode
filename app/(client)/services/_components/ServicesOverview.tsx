"use client";

import * as m from "framer-motion/m";
import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, stagger, useReveal } from "@/lib/motion";
import { OverviewCard } from "./OverviewCard";
import type { Service } from "@/db/schema";


export function ServicesOverview({ serviceList }: { serviceList: Service[] }) {
  const [ref, inView] = useReveal();

  return (
    <section className="py-24 px-6 md:px-10">
      <div className="max-w-300 mx-auto">

        {/* Header */}
        <m.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14"
        >
          <m.div variants={fadeUp()}>
            <SectionTag>Service Overview</SectionTag>
            <AccentLine />
          </m.div>
          <m.h2
            variants={fadeUp(0.1)}
            className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
              tracking-tight text-ink leading-[1.1] max-w-140"
          >
            Three Practices.{" "}
            <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
              One Unified Partner.
            </span>
          </m.h2>
        </m.div>

        {/* Grid — 3 top, 2 bottom centred */}
        <m.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {serviceList.slice(0, 3).map((c, i) => (
              <OverviewCard key={c.id} card={c} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-205 mx-auto">
            {serviceList.slice(3).map((c, i) => (
              <OverviewCard key={c.id} card={c} index={i + 3} />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
