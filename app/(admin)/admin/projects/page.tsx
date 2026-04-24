import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  ProjectsTable,
  type ProjectListRow,
} from "@/components/admin/projects/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await requireAdmin();

  let rows: ProjectListRow[] = [];
  let schemaMissing = false;

  try {
    rows = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        title: projects.title,
        client: projects.client,
        service: projects.service,
        serviceLabel: projects.serviceLabel,
        year: projects.year,
        featured: projects.featured,
        published: projects.published,
        sortOrder: projects.sortOrder,
        screenshots: projects.screenshots,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.id));
  } catch (err) {
    console.warn("[admin/projects] projects table missing or query failed:", err);
    schemaMissing = true;
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Manage case studies shown in the public portfolio."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New project
          </Link>
        }
      />

      {schemaMissing && (
        <div className="mb-6 rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">The projects table is missing.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
              npx drizzle-kit push
            </code>{" "}
            from the project root to apply the schema. Projects will appear
            here once the table exists.
          </p>
        </div>
      )}

      {!schemaMissing && <ProjectsTable rows={rows} />}
    </>
  );
}
