import React from 'react'
import { ServicesHero } from './_components/ServicesHero'
import { ServicesOverview } from './_components/ServicesOverview'
import { ServiceDeepDives } from './_components/ServicesDeepDive'
import { DeliveryProcess } from './_components/DeliveryProcess'
import { FAQ } from './_components/FAQ'
import { ServicesDataError } from './_components/ServicesDataError'
import { getPublishedSeoServices } from '@/queries'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { Service } from '@/db/schema'

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Services | Web, Mobile, and AI Automation",
  description:
    "Explore VeilCode services across web solutions, mobile application development, AI automation, and supporting digital capabilities.",
  path: "/services",
});

const page = async () => {
  let serviceList: Service[] = []
  let servicesUnavailable = false

  try {
    serviceList = await getPublishedSeoServices();
  } catch (error) {
    servicesUnavailable = true;
    console.error("[services] failed to load published services:", error);
  }

  return (
    <>
      <ServicesHero />
      {servicesUnavailable ? (
        <ServicesDataError />
      ) : (
        <>
          <ServicesOverview serviceList={serviceList} />
          <ServiceDeepDives serviceList={serviceList} />
        </>
      )}
      <DeliveryProcess />
      {/* <PricingTiers /> */}
      <FAQ />
    </>
  )
}

export default page
