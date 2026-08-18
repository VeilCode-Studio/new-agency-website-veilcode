"use client";
import React from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion'
import { GhostButton, PrimaryButton } from '@/components/extras/Primitives';

const links = [
    { linkUrl: "#", linkText: "Follow us on LinkedIn", type: "linkedIn", classNames: "text-[15px]! px-8! py-4!" },
    { linkUrl: "mailto:support@veilcode.studio", linkText: "Email Us Your CV", type: "email", classNames: "text-[15px]! px-8! py-4!" }
]

const CareersCTA = () => {
    return (
        <div className="py-20 border-t border-line mt-12">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-surface border border-brand-border/50 rounded-3xl p-12 md:p-16 text-center"
            >
                <h3 className="text-3xl font-display font-semibold mb-4">
                    Don&apos;t see your role?
                </h3>
                <p className="text-ink-muted max-w-md mx-auto mb-8">
                    We believe great people create their own opportunities.
                    Reach out — we review every serious application.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {links.map((link, index) => (
                        link.type === "linkedIn" ? (
                            link.type === "linkedIn" && link.linkUrl !== "#" && (
                                <PrimaryButton key={link.linkUrl + index}>
                                    <Link target="_blank" href={link.linkUrl}>{link.linkText}</Link>
                                </PrimaryButton>
                            )
                        ) : (
                            <GhostButton key={link.linkUrl + index}>
                                <Link href={link.linkUrl}>{link.linkText}</Link>
                            </GhostButton>
                        )
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default CareersCTA