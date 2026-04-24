import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db/drizzle";
import { jobOpenings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { JobsTable, type JobListRow } from "@/components/admin/careers/JobsTable";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  await requireAdmin();

  let rows: JobListRow[] = [];
  let schemaMissing = false;

  try {
    rows = await db
      .select({
        id: jobOpenings.id,
        title: jobOpenings.title,
        department: jobOpenings.department,
        location: jobOpenings.location,
        type: jobOpenings.type,
        experience: jobOpenings.experience,
        published: jobOpenings.published,
        createdAt: jobOpenings.createdAt,
      })
      .from(jobOpenings)
      .orderBy(asc(jobOpenings.createdAt));
  } catch (err) {
    console.warn("[admin/careers] job_openings table missing or query failed:", err);
    schemaMissing = true;
  }

  return (
    <>
      <PageHeader
        title="Careers"
        description="Manage job openings shown on the public careers page."
        action={
          <Link
            href="/admin/careers/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New opening
          </Link>
        }
      />

      {schemaMissing && (
        <div className="mb-6 rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">The job_openings table is missing.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
              npx drizzle-kit push
            </code>{" "}
            from the project root to apply the schema. Openings will appear
            here once the table exists.
          </p>
        </div>
      )}

      {!schemaMissing && <JobsTable rows={rows} />}
    </>
  );
}
