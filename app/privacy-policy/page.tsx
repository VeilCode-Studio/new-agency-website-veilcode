'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import { PrimaryButton } from '@/components/extras/Primitives';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-base pt-20 pb-24 text-ink">
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
                1. Introduction
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
          <Card className="bg-surface border-line mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Database className="w-6 h-6 text-brand" />
                2. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="text-ink-muted leading-relaxed space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-ink mb-3">Information You Provide</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> Contact details (name, email, phone, company)</li>
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> Project briefs and requirements</li>
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> Inquiries via forms or email</li>
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> Payment and billing information (processed securely via third parties)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-3">Automatically Collected Information</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> IP address, browser type, device information</li>
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> Usage data (pages visited, time spent)</li>
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> Cookies and similar tracking technologies</li>
                    <li className="flex items-start gap-2"><span className="text-brand mt-px">•</span> Analytics data from tools like Google Analytics</li>
                  </ul>
                </div>
              </div>
              <Separator className="bg-line" />
              <p className="text-xs text-ink-faint italic">
                We never collect sensitive personal data (race, religion, health) unless explicitly required for a project and with your prior written consent.
              </p>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="bg-surface border-line mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Lock className="w-6 h-6 text-brand" />
                3. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-ink-muted leading-relaxed space-y-4">
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">01</div>
                  <div>To respond to your inquiries and deliver our services (web solutions, AI automation, data analytics, etc.)</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">02</div>
                  <div>To improve our website, services, and client experience through analytics</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">03</div>
                  <div>To send important updates, project communications, and (with consent) marketing about new capabilities</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">04</div>
                  <div>To comply with legal obligations and protect our rights</div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Sharing & Disclosure */}
          <Card className="bg-surface border-line mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Users className="w-6 h-6 text-brand" />
                4. Sharing &amp; Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-ink-muted leading-relaxed">
              <p>We do not sell your personal information. We may share data only in these limited cases:</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-3"><span className="text-brand">↗</span> With trusted service providers (Vercel, AWS, Stripe, analytics tools) under strict data-processing agreements</li>
                <li className="flex items-start gap-3"><span className="text-brand">↗</span> When required by law or to protect VeilCode and our clients</li>
                <li className="flex items-start gap-3"><span className="text-brand">↗</span> In the event of a business transfer (merger, acquisition) with appropriate safeguards</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies & Tracking */}
          <Card className="bg-surface border-line mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="w-6 h-6 text-brand" />
                5. Cookies &amp; Tracking Technologies
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
                <CardTitle className="text-xl">6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-ink-muted text-sm leading-relaxed">
                You have the right to access, correct, delete, or restrict your personal data. 
                To exercise these rights, contact us at privacy@veilcode.studio. We respond within 30 days.
              </CardContent>
            </Card>

            <Card className="bg-surface border-line">
              <CardHeader>
                <CardTitle className="text-xl">7. Data Security</CardTitle>
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
                <a href="mailto:privacy@veilcode.studio">Contact Our Privacy Team</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center text-xs text-ink-faint font-mono border-t border-line pt-8"
        >
          © 2026 VeilCode Studio Ltd. All rights reserved.<br />
          Built with precision · Deployed with purpose.
        </motion.div>
      </div>
    </div>
  );
}