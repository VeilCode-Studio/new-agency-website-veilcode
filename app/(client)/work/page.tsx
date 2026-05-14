import React from 'react'
import { WorkHero } from './_components/WorkHero'
import { PortfolioGrid } from './_components/PortfolioGrid'
import { WorkImpact } from './_components/WorkImpact'
import { CTA } from '@/components/shared/CTA'
import { getAllProjects } from '@/queries'
import { DataRecoveryNotice } from '@/components/shared/DataRecoveryNotice'
import type { Project } from '@/db/schema'

export const dynamic = "force-dynamic";

const page = async () => {
  let allProjects: Project[] = [];
  let projectsUnavailable = false;

  try {
    allProjects = await getAllProjects();
  } catch (error) {
    projectsUnavailable = true;
    console.error("[work] failed to load projects:", error);
  }

  return (
      <>
          <WorkHero />
          {projectsUnavailable ? (
            <DataRecoveryNotice
              eyebrow="Work data unavailable"
              title="We could not load the project list right now."
              description="This usually means the database is temporarily unavailable or a deployment is still settling. Refresh the page or come back shortly."
              retryLabel="Retry projects"
            />
          ) : (
            <PortfolioGrid projects={allProjects} />
          )}
          <WorkImpact />
          <CTA />
      </>
  )
}

export default page
