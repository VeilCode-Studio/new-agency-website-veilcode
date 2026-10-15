"use client";

import * as m from "framer-motion/m";

export function CareersHero() {
  return (
    <div className="relative overflow-hidden border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-brand-border mb-6">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            <span className="text-xs font-medium tracking-widest text-brand">JOIN THE VEIL</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tighter mb-6">
            Build the Future.<br />
            <span className="text-brand">With Us.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-ink-muted">
            At Veilcode we craft premium digital experiences, unlock data intelligence,
            and automate the impossible with AI. We&apos;re looking for visionaries who move
            fast and think deeper.
          </p>
        </m.div>
      </div>
    </div>
  );
}
