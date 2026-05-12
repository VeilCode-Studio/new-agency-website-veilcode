import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus, Eye } from "lucide-react";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  ServicesTable,
  type ServiceListRow,
} from "@/components/admin/services/ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  await requireAdmin();

  let rows: ServiceListRow[] = [];
  let schemaMissing = false;

  try {
    rows = await db
      .select({
        id: services.id,
        number: services.number,
        icon: services.icon,
        title: services.title,
        tagline: services.tagline,
        sortOrder: services.sortOrder,
        published: services.published,
        updatedAt: services.updatedAt,
      })
      .from(services)
      .orderBy(asc(services.sortOrder));
  } catch (err) {
    console.warn("[admin/services] services table missing or query failed:", err);
    schemaMissing = true;
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="Manage the services shown on the public services page."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/services/preview"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-line-hi hover:bg-surface-hi"
            >
              <Eye className="size-4" />
              Live preview
            </Link>
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              New service
            </Link>
          </div>
        }
      />

      {schemaMissing && (
        <div className="mb-6 rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">The services table is missing.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
              npx drizzle-kit push
            </code>{" "}
            from the project root to apply the schema. Services will appear
            here once the table exists.
          </p>
        </div>
      )}

      {!schemaMissing && <ServicesTable rows={rows} />}
    </>
  );
}
