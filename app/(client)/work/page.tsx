import React from 'react'
import { WorkHero } from './_components/WorkHero'
import { PortfolioGrid } from './_components/PortfolioGrid'
import { CTA } from '@/components/shared/CTA'
import { getAllProjects } from '@/queries'
import { getWorkStats } from '@/lib/projects/kind'
import { DataRecoveryNotice } from '@/components/shared/DataRecoveryNotice'
import type { Project } from '@/db/schema'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { DEFAULT_OG_IMAGE } from '@/lib/seo/site'

export const metadata = buildPageMetadata({
  title: "Our Work",
  description:
    "Client work, our own products, and concept builds for the industries we serve. Each one shows how we'd approach your project.",
  path: "/work",
  image: DEFAULT_OG_IMAGE,
});

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
          <WorkHero stats={getWorkStats(allProjects)} />
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
          <CTA />
      </>
  )
}

export default page
