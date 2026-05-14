import React from 'react'
import { notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { CaseStudyHero } from './_components/CaseStudyHero';
import { CaseStudyBody } from './_components/CaseStudyBody';
import { ScreenshotGallery } from './_components/ScreenShotGallery';
import { CaseStudyTestimonial } from './_components/CaseStudyTestimonial';
import { CTA } from '@/components/shared/CTA';
import { NextProject } from './_components/NextProject';
import { StructuredData } from '@/lib/seo/StructuredData';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo/jsonLd';
import { buildPageMetadata } from '@/lib/seo/metadata';

interface Params {
  params: Promise<{slug: string}>
}

export const dynamic = "force-dynamic";

async function getPublishedProject(slug: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);

  return project ?? null;
}

// generate metadata
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);

  if (!project) return {};

  return buildPageMetadata({
    title: `${project.title} - VeilCode Case Study`,
    description: project.summary,
    path: `/work/${project.slug}`,
    image: project.screenshots[0]?.src,
  });
}

const page = async ({ params }: Params) => {
  const { slug } = await params;
  const project = await getPublishedProject(slug);

  if (!project) return notFound();

  let nextProject = null;
  if (project.nextSlug) {
    const [next] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, project.nextSlug), eq(projects.published, true)))
      .orderBy(asc(projects.sortOrder))
      .limit(1);

    nextProject = next ?? null;
  }
  
  return (
    <>
      <StructuredData
        data={webPageJsonLd({
          name: `${project.title} - VeilCode Case Study`,
          description: project.summary,
          path: `/work/${project.slug}`,
        })}
      />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Work", href: "/work" },
          { name: project.title, href: `/work/${project.slug}` },
        ])}
      />
      <CaseStudyHero project={project} />
      <CaseStudyBody project={project} />
      <ScreenshotGallery project={project} />
      <CaseStudyTestimonial project={project} />
      <CTA />
      <NextProject project={project} nextProject={nextProject} />
    </>
  )
}

export default page
