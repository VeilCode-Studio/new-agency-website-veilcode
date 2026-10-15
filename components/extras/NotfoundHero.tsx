import React from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { GhostButton, PrimaryButton } from './Primitives'

const NotfoundHero = () => {
  return (
      <>
          <div
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border border-brand-border bg-surface mb-10 relative">
            <div className="absolute inset-0 bg-brand-glow/10 rounded-full blur-3xl" />
            <span className="text-[6.5rem] font-display font-black tracking-tighter text-brand/90 select-none">404</span>
          </div>
        </div>

        <div
        >
          <h1 className="text-7xl md:text-8xl font-display font-semibold tracking-tighter mb-4 text-ink">
            Page Not Found
          </h1>
          <p className="text-2xl text-ink-muted mb-3 font-light">
            The veil has hidden this page.
          </p>
          <p className="max-w-md mx-auto text-ink-muted text-lg leading-relaxed">
            We couldn&apos;t find the page you&apos;re looking for. It might have moved, been removed, or never existed in our digital realm.
          </p>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <PrimaryButton asChild
            className="bg-brand hover:bg-brand/90 text-black font-medium px-10 group flex items-center gap-3"
          >
            <Link href="/" className='flex gap-2 items-center justify-center'>
              <Home className="w-5 h-5" />
              Return to Home
            </Link>
          </PrimaryButton>

          <GhostButton asChild
            className="border-brand-border hover:bg-surface-hi text-ink hover:text-brand px-8"
          >
            <Link href="/#services">
              Explore Our Services
            </Link>
          </GhostButton>
        </div>
      </>
  )
}

export default NotfoundHero