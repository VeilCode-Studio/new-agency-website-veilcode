import React from 'react'
import { AboutHeroSection } from './_components/AboutHeroSection'
import { MissionVision } from './_components/MissionVision'
import { CoreValues } from './_components/CoreValues'
import { Team } from './_components/TeamComponent'
import { FounderStory } from './_components/FounderStory'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { DEFAULT_OG_IMAGE } from '@/lib/seo/site'

export const metadata = buildPageMetadata({
  title: "About VeilCode Studio | Founder-led product studio in Kampala",
  description:
    "Learn about VeilCode Studio — a founder-led product studio in Kampala. Our story, mission, values, and the engineer behind the work.",
  path: "/about",
  image: DEFAULT_OG_IMAGE,
});

const AboutUsPage = () => {
  return (
      <>
          <AboutHeroSection />
          <FounderStory />
          <MissionVision />
          <CoreValues />
          <Team />
      </>
  )
}

export default AboutUsPage