"use client";

import { motion } from "framer-motion";
import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, staggerChildren, useReveal } from "@/lib/motion";

/**
 * Placeholder copy. Each paragraph is marked TODO-FRANK and must be replaced
 * with Frank's own words before this page ships.
 */
const PARAGRAPHS = [
  {
    id: "why",
    text: "TODO-FRANK: Why I started VeilCode. What I kept seeing in the work that made me want to build products a different way, and what I decided this studio would do instead.",
  },
  {
    id: "background",
    text: "TODO-FRANK: My background. Where I learned to build, the kinds of systems I have shipped, and what those years taught me about what actually holds up in production.",
  },
  {
    id: "today",
    text: "TODO-FRANK: How I work today. What an engagement looks like from the first call onward, who you talk to, and how decisions about your product get made.",
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
        <motion.div
          ref={ref}
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp()}>
            <SectionTag>Our Story</SectionTag>
            <AccentLine width={64} />
          </motion.div>

          <motion.h2
            variants={fadeUp(0.08)}
            className="mt-8 font-display text-[clamp(1.9rem,4.5vw,3.25rem)]
              font-extrabold tracking-tight leading-[1.08] text-ink max-w-3xl"
          >
            Built by an engineer,{" "}
            <span className="text-brand drop-shadow-[0_0_20px_var(--color-brand-glow)]">
              not an account manager
            </span>
          </motion.h2>

          <div className="mt-10 flex flex-col gap-6 max-w-2xl">
            {PARAGRAPHS.map((paragraph, i) => (
              <motion.p
                key={paragraph.id}
                variants={fadeUp(0.16 + i * 0.08)}
                className="font-sans text-base md:text-lg font-light
                  text-ink-muted leading-relaxed"
              >
                {paragraph.text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
