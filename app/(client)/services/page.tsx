import React from 'react'
import { db } from '@/db/drizzle'
import { services } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { ServicesHero } from './_components/ServicesHero'
import { ServicesOverview } from './_components/ServicesOverview'
import { ServiceDeepDives } from './_components/ServicesDeepDive'
import { DeliveryProcess } from './_components/DeliveryProcess'
import { PricingTiers } from './_components/PricingTiers'
import { FAQ } from './_components/FAQ'

export const dynamic = "force-dynamic";

const page = async () => {
  const serviceList = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder));

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