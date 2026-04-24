'use client';

import { motion } from 'framer-motion';
import NotfoundHero from '@/components/extras/NotfoundHero';
import NotFoundLinks from '@/components/extras/NotFoundLinks';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center overflow-hidden relative pt-20 pb-24">
      {/* Subtle background glow & noise consistency */}
      <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_0.8px,transparent_1px)] bg-size-[40px_40px] opacity-5 pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <NotfoundHero />

        {/* Helpful Quick Links */}
        <NotFoundLinks />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-xs text-ink-faint font-mono tracking-widest"
        >
          © 2026 VeilCode Studio • Built with precision in the shadows
        </motion.p>
      </div>
    </div>
  );
}