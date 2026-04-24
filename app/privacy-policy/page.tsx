'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Globe } from 'lucide-react';
import Link from 'next/link';
import { PrimaryButton } from '@/components/extras/Primitives';
import InfoCollected from './_components/InfoCollected';
import HowWeUseInfo from './_components/HowWeUseInfo';
import InfoSharingAndDisclosure from './_components/InfoSharingAndDisclosure';
import PrivacyFooter from './_components/PrivacyFooter';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-page pt-20 pb-24 text-ink">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <PrimaryButton>
            <Link href="/" className='flex gap-2 items-center justify-start'>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to VeilCode
            </Link>
          </PrimaryButton>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-3xl bg-surface border border-brand-border mb-6">
            <Shield className="w-5 h-5 text-brand" />
            <span className="font-medium text-sm tracking-[0.5px] text-brand">LEGAL</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-semibold tracking-tighter mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-ink-muted max-w-md mx-auto">
            Last updated: March 25, 2026
          </p>
          <p className="text-base text-ink-faint mt-8 max-w-lg mx-auto">
            At VeilCode, we build with precision and protect with purpose. 
            Your privacy is foundational to the trust we earn with every project.
          </p>
        </motion.div>

        <div className="prose prose-invert max-w-none">
          {/* Introduction */}
          <Card className="bg-surface border-line mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Eye className="w-6 h-6 text-brand" />
                <span className='text-white/80'>1. Introduction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-ink-muted leading-relaxed space-y-6">
              <p>
                VeilCode Studio Ltd (&ldquo;VeilCode&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) 
                operates the website <span className="text-brand">https://veilcode.studio</span> and provides premium 
                digital solutions including web development, mobile applications, data analytics, 
                marketing, and AI automation.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information 
                when you visit our website, engage with our services, or communicate with us. We are committed to 
                transparency, security, and respecting your privacy in line with global standards including GDPR and 
                the Data Protection Act of Uganda.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <InfoCollected />

          {/* How We Use Your Information */}
          <HowWeUseInfo />

          {/* Sharing & Disclosure */}
          <InfoSharingAndDisclosure />

          {/* Cookies & Tracking */}
          <Card className="bg-surface border-line mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="w-6 h-6 text-brand" />
                <span className="text-white/80">5. Cookies &amp; Tracking Technologies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-ink-muted leading-relaxed">
              We use essential cookies to operate the site and optional analytics cookies to understand visitor behavior. 
              You can manage preferences via our cookie banner or browser settings. Full details are in our{' '}
              <Link href="/cookie-policy" className="text-brand hover:underline">Cookie Policy</Link>.
            </CardContent>
          </Card>

          {/* Your Rights & Data Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-surface border-line">
              <CardHeader>
                <CardTitle className="text-xl text-white/90">6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-ink-muted text-sm leading-relaxed">
                You have the right to access, correct, delete, or restrict your personal data. 
                To exercise these rights, contact us at privacy@veilcode.studio. We respond within 30 days.
              </CardContent>
            </Card>

            <Card className="bg-surface border-line">
              <CardHeader>
                <CardTitle className="text-xl text-white/90">7. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="text-ink-muted text-sm leading-relaxed">
                We implement industry-standard security measures (encryption, access controls, regular audits) 
                to protect your information. However, no system is 100% secure.
              </CardContent>
            </Card>
          </div>

          {/* Final Sections */}
          <div className="space-y-8 text-ink-muted text-base">
            <div>
              <h3 className="font-display text-xl mb-3">8. International Data Transfers</h3>
              <p>We may transfer data outside Uganda/East Africa using appropriate safeguards such as Standard Contractual Clauses.</p>
            </div>

            <div>
              <h3 className="font-display text-xl mb-3">9. Children’s Privacy</h3>
              <p>Our services are not directed at children under 16. We do not knowingly collect data from minors.</p>
            </div>

            <div>
              <h3 className="font-display text-xl mb-3">10. Changes to This Policy</h3>
              <p>We may update this policy. The &ldquo;Last updated&rdquo; date will be revised. Continued use after changes constitutes acceptance.</p>
            </div>

            <Separator className="bg-line" />

            <div className="text-center py-8">
              <p className="text-sm text-ink-faint">
                Questions about this Privacy Policy? Reach out anytime.
              </p>
              <Button
                size="lg"
                className="mt-6 bg-brand hover:bg-brand/90 text-black font-medium px-10"
                asChild
              >
                <a href="mailto:hello@veilcode.studio">Contact Our Privacy Team</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <PrivacyFooter />
      </div>
    </div>
  );
}