"use client";
import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { PrimaryButton } from '@/components/extras/Primitives'
import Link from 'next/link'


const NoCareersOpenings = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="relative mb-8">
      <div className="w-24 h-24 rounded-full bg-brand-dim/50 flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-brand" />
      </div>
      <div className="absolute -inset-4 bg-brand-glow/10 rounded-full blur-xl" />
    </div>

    <h2 className="text-4xl font-display font-semibold tracking-tight mb-3">
      No Open Positions Right Now
    </h2>
    <p className="max-w-md text-ink-muted text-lg">
      We&apos;re always growing. Even when we don&apos;t have open roles, 
      we love meeting exceptional talent. Send us your portfolio or résumé — 
      we keep the best ones close.
    </p>

    <PrimaryButton
      className="mt-10 bg-brand hover:bg-brand/90 text-black font-medium px-10"
    >
      <Link href="mailto:support@veilcode.studio">
        Send Your Application Anyway
      </Link>
    </PrimaryButton>
  </motion.div>
  )
}

export default NoCareersOpenings;