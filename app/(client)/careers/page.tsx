'use client';

import { motion } from 'framer-motion';
import { openings } from '@/constants/careers';
import NoCareersOpenings from './_components/NoCareerOpenings';
import CareersCTA from './_components/CareersCTA';
import AvailableCareers from './_components/AvailableCareers';


export default function page() {
    const hasOpenings = openings.length > 0;

    return (
        <div className="min-h-screen bg-base pt-20 pb-24">
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-line">
                <div className="max-w-5xl mx-auto px-6 py-24">
                    <motion.div
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
                            and automate the impossible with AI. We&apos;re looking for visionaries who move fast and think deeper.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6">
                {hasOpenings ? (
                    <AvailableCareers openings={openings} />
                ) : (
                    <NoCareersOpenings />
                )}

                {/* Always Visible CTA Section */}
                <CareersCTA />
            </div>
        </div>
    );
}