import React from 'react'
import { db } from '@/db/drizzle'
import { projects } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { WorkHero } from './_components/WorkHero'
import { PortfolioGrid } from './_components/PortfolioGrid'
import { WorkImpact } from './_components/WorkImpact'
import { CTA } from '@/components/shared/CTA'

export const dynamic = "force-dynamic";

const page = async () => {
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder));

  return (
      <>
          <WorkHero />
          <PortfolioGrid projects={allProjects} />
          <WorkImpact />
          <CTA />
      </>
  )
}

export default page