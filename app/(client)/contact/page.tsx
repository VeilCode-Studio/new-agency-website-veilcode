import React from 'react'
import { ContactHero } from './_components/ContactHero'
import { ContactMain } from './_components/ContactMain'
import { TrustStrip } from './_components/TrustStrip'
import { BookingCTA } from './_components/BookingCTA'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { DEFAULT_OG_IMAGE } from '@/lib/seo/site'

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Talk to VeilCode Studio about a web platform, mobile app or AI automation project. Founder-led studio in Kampala working with clients worldwide.",
  path: "/contact",
  image: DEFAULT_OG_IMAGE,
});

const page = () => {
    return (
        <>
            <ContactHero />
            <ContactMain />
            <TrustStrip />
            <BookingCTA />
        </>
    )
}

export default page