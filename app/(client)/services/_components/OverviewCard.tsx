import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedArrow } from "@/components/extras/Primitives";
import { fadeUp } from "@/lib/motion";
import type { Service } from "@/db/schema";


export function OverviewCard({
  card,
  index,
}: {
  card: Service;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const c = card.overviewClasses;
  const href = card.seoEnabled && card.slug ? `/services/${card.slug}` : `#${card.id}`;

  return (
    <motion.a
      href={href}
      variants={fadeUp(index * 0.07)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col rounded-xl p-8 bg-surface border border-line
        overflow-hidden no-underline cursor-pointer
        transition-all duration-300 hover:bg-surface-hi
        ${c.hoverBorder} ${c.hoverShadow}`}
    >
      {/* Number watermark */}
      <span
        aria-hidden
        className={`absolute -top-2 right-4 font-display font-extrabold
          text-[80px] leading-none tracking-tight select-none pointer-events-none
          opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300
          ${c.accent}`}
      >
        {card.number}
      </span>

      {/* Icon */}
      <span className={`text-[28px] leading-none mb-5 block ${c.accent}`} aria-hidden>
        {card.icon}
      </span>

      {/* Tagline */}
      <span
        className={`font-mono text-[10px] tracking-widest uppercase mb-3
          px-2.5 py-1 rounded border self-start
          ${c.dimBg} ${c.border} ${c.accent}`}
      >
        {card.tagline}
      </span>

      {/* Title */}
      <h3 className="font-display text-[22px] font-bold tracking-tight text-ink mb-3 mt-1">
        {card.title}
      </h3>

      {/* Desc */}
      <p className="font-sans text-sm text-ink-muted leading-relaxed mb-6 flex-1">
        {card.desc}
      </p>

      {/* Bullets */}
      <ul className="space-y-1.5 mb-7 list-none p-0 m-0">
        {card.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2.5 font-sans text-sm text-ink-muted">
            <span className={`size-1 rounded-full shrink-0 bg-current ${c.accent}`} aria-hidden />
            {b}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className={`flex items-center gap-1.5 font-sans text-sm font-medium ${c.accent}`}>
        <span>View full details</span>
        <AnimatedArrow hovered={hovered} />
      </div>
    </motion.a>
  );
}
