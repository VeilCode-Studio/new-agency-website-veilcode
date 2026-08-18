"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface AvailableCareersProps {
    openings: JobOpening[];
}

const AvailableCareers: React.FC<AvailableCareersProps> = ({ openings }) => {
    return (
        <div className="py-16 space-y-16">
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <Users className="w-6 h-6 text-brand" />
                    <h2 className="text-3xl font-display font-semibold">Open Roles</h2>
                </div>

                <div className="grid gap-6">
                    {openings.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group bg-surface border-line hover:border-brand-border transition-all duration-300 overflow-hidden">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className='space-y-6'>
                                            <CardTitle className="text-2xl text-white/70 font-display group-hover:text-brand transition-colors">
                                                {job.title}
                                            </CardTitle>
                                            <CardDescription className="text-lg mt-1 flex items-center gap-2">
                                                <span>{job.department}</span>
                                                <span className="text-brand">•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" /> {job.location}
                                                </span>
                                            </CardDescription>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="bg-surface-hi text-white/80">
                                                {job.type}
                                            </Badge>
                                            <Badge variant="outline" className="border-brand-border text-brand">
                                                {job.experience}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <p className="text-ink-muted leading-relaxed">{job.description}</p>

                                    <div>
                                        <h4 className="font-medium mb-3 text-sm uppercase tracking-widest text-ink-faint">
                                            What You&apos;ll Do
                                        </h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-ink-muted">
                                            {job.responsibilities.map((item, i) => (
                                                <li key={i} className="flex gap-2 items-center justify-start">
                                                    <span className="text-brand mt-1.5">→</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Separator className="bg-line" />

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 text-sm text-ink-muted">
                                            <Clock className="w-4 h-4" />
                                            <span>Posted {job.posted}</span>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="bg-brand hover:bg-brand/90 text-black font-medium px-10"
                                            asChild
                                        >
                                            <Link href={`mailto:support@veilcode.studio?subject=Application for ${job.title}`}>
                                                Apply Now
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AvailableCareers