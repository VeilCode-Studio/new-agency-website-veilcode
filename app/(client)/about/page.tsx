import React from 'react'
import { AboutHeroSection } from './_components/AboutHeroSection'
import { MissionVision } from './_components/MissionVision'
import { CoreValues } from './_components/CoreValues'
import { Team } from './_components/TeamComponent'
import { FounderStory } from './_components/FounderStory'

export const metadata = {
  title: "About Us — VeilCode",
  description:
    "Learn about VeilCode Studio — a founder-led product studio in Kampala. Our story, mission, values, and the engineer behind the work.",
};

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