"use client";

import { motion } from "framer-motion";
import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, stagger, useReveal } from "@/lib/motion";
import { TeamCard } from "./TeamCard";


const TEAM: TeamMember[] = [
  {
    initials:  "TF",
    name:      "Tamale Frank",
    role:      "Founder & Lead Engineer",
    bio:       "Full-stack engineer with five years in the MERN stack, three in cross-platform mobile, and hands-on AI integration work. Before VeilCode, Solutions Delivery Officer at I&M Bank Uganda.",
    skills:    ["MERN Stack", "React Native", "TypeScript", "AI Integration"],
    linkedin:  "#",
    twitter:   "#",
    accentClass: "text-brand",
    avatarBg:    "from-brand/30 to-brand/5 border-brand-border",
  },
] as const;



export function Team() {
  const [ref, inView] = useReveal();

  return (
    <section id="team" className="py-32 px-6 md:px-10">
      <div className="max-w-300 mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={fadeUp()}>
            <SectionTag>The Team</SectionTag>
            <AccentLine />
          </motion.div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <motion.h2
              variants={fadeUp(0.1)}
              className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
                tracking-tight text-ink leading-[1.1] max-w-120"
            >
              Who You&apos;ll{" "}
              <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
                Work With
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp(0.18)}
              className="font-sans text-[15px] text-ink-muted max-w-90 leading-relaxed"
            >
              No account managers in the middle — you work directly with the
              engineer building your product.
            </motion.p>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-2xl"
        >
          {TEAM.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}