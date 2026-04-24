import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import type { ProjectFormData } from "@/components/admin/projects/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, numId))
    .limit(1);

  if (!row) notFound();

  const initialData: ProjectFormData = {
    slug: row.slug,
    service: row.service,
    serviceLabel: row.serviceLabel,
    year: row.year,
    title: row.title,
    client: row.client,
    industry: row.industry,
    duration: row.duration,
    team: row.team,
    summary: row.summary,
    challenge: row.challenge,
    approach: row.approach,
    outcome: row.outcome,
    metric: row.metric,
    metricLabel: row.metricLabel,
    tags: row.tags ?? [],
    featured: row.featured,
    published: row.published,
    sortOrder: row.sortOrder,
    results: row.results ?? [],
    deliverables: row.deliverables ?? [],
    screenshots: row.screenshots ?? [],
    testimonial: row.testimonial ?? null,
    nextSlug: row.nextSlug ?? "",
    classes: row.classes,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <ProjectForm mode="edit" id={row.id} initialData={initialData} />
    </div>
  );
}
