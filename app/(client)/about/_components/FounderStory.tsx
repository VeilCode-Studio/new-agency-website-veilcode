"use client";

import * as m from "framer-motion/m";
import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, staggerChildren, useReveal } from "@/lib/motion";


const PARAGRAPHS = [
  {
    id: "why",
    text: "I started VeilCode after five years of watching businesses pay for software that looked polished and did very little for the business behind it. Before VeilCode I worked as a Solutions Delivery Officer at I&M Bank Uganda. I build software that fixes a real operational problem or changes how customers deal with a company, and I judge it by whether people actually use it.",
  },
  {
    id: "background",
    text: "My work spans web platforms built with React and Node, cross-platform mobile apps built with React Native, and AI automation. You can see it on the work page: a real estate platform, a CRM with AI-drafted outreach, a property management system, an e-commerce store, a fitness app and an AI phone receptionist for plumbers. Building complete products taught me to think past individual features to how the whole system behaves once real people use it.",
  },
  {
    id: "today",
    text: "I build every VeilCode project myself. From the first conversation I work to understand the business problem, agree on what should actually be built, and make the technical decisions that shape it. You talk to the person writing the code, so questions get answered the same day and nothing gets lost in a handoff.",
  },
] as const;

export function FounderStory() {
  const [ref, inView] = useReveal("-100px");

  return (
    <section
      id="story"
      className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-12
        bg-surface border-y border-line overflow-hidden"
    >
      {/* Subtle background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-40 top-20 size-150 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <m.div
          ref={ref}
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <m.div variants={fadeUp()}>
            <SectionTag>Our Story</SectionTag>
            <AccentLine width={64} />
          </m.div>

          <m.h2
            variants={fadeUp(0.08)}
            className="mt-8 font-display text-[clamp(1.9rem,4.5vw,3.25rem)]
              font-extrabold tracking-tight leading-[1.08] text-ink max-w-3xl"
          >
            Built by an engineer,{" "}
            <span className="text-brand drop-shadow-[0_0_20px_var(--color-brand-glow)]">
              not an account manager
            </span>
          </m.h2>

          <div className="mt-10 flex flex-col gap-6 max-w-2xl">
            {PARAGRAPHS.map((paragraph, i) => (
              <m.p
                key={paragraph.id}
                variants={fadeUp(0.16 + i * 0.08)}
                className="font-sans text-base md:text-lg font-light
                  text-ink-muted leading-relaxed"
              >
                {paragraph.text}
              </m.p>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
