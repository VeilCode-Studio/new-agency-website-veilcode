import React from "react";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CaseStudyHero } from "@/app/(client)/work/[slug]/_components/CaseStudyHero";
import { CaseStudyBody } from "@/app/(client)/work/[slug]/_components/CaseStudyBody";
import { ScreenshotGallery } from "@/app/(client)/work/[slug]/_components/ScreenShotGallery";
import { CaseStudyTestimonial } from "@/app/(client)/work/[slug]/_components/CaseStudyTestimonial";
import { CTA } from "@/components/shared/CTA";
import { NextProject } from "@/app/(client)/work/[slug]/_components/NextProject";

export const dynamic = "force-dynamic";

export default async function AdminSingleProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(id)))
    .limit(1);

  if (!project) notFound();

  // Fetch next project if it exists for a better preview
  let nextProject = null;
  if (project.nextSlug) {
    const [next] = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, project.nextSlug))
      .limit(1);
    nextProject = next || null;
  }

  return (
    <div className="rounded-2xl border border-line bg-page overflow-clip">
      {/* Admin Preview Banner */}
      <div className="flex items-center justify-between border-b border-brand/20 bg-brand/5 px-6 py-3 text-sm text-brand">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="flex items-center gap-1 font-medium hover:underline">
            <ChevronLeft className="size-4" />
            Back to Dashboard
          </Link>
          <span className="h-4 w-px bg-brand/20"></span>
          <span className="font-semibold">Live Preview: {project.title}</span>
        </div>
      </div>

      {/* Main Client Content */}
      <div className="pb-12">
        <CaseStudyHero project={project as any} />
        <CaseStudyBody project={project as any} />
        <ScreenshotGallery project={project as any} />
        <CaseStudyTestimonial project={project as any} />
        <CTA />
        <NextProject project={project as any} nextProject={nextProject as any} />
      </div>
    </div>
  );
}