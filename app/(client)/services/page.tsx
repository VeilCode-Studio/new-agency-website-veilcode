import React from 'react'
import { ServicesHero } from './_components/ServicesHero'
import { ServicesOverview } from './_components/ServicesOverview'
import { ServiceDeepDives } from './_components/ServicesDeepDive'
import { DeliveryProcess } from './_components/DeliveryProcess'
import { PricingTiers } from './_components/PricingTiers'
import { FAQ } from './_components/FAQ'
import { getPublishedServices } from '@/queries'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Services | Web, Mobile, and AI Automation",
  description:
    "Explore VeilCode services across web solutions, mobile application development, AI automation, and supporting digital capabilities.",
  path: "/services",
});

const page = async () => {
  const serviceList = await getPublishedServices();

  return (
    <>
      <ServicesHero />
      <ServicesOverview serviceList={serviceList} />
      <ServiceDeepDives serviceList={serviceList} />
      <DeliveryProcess />
      <PricingTiers />
      <FAQ />
    </>
  )
}

export default page
