import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { SeoPagesTable, type SeoPageListRow } from "@/components/admin/seo-pages/SeoPagesTable";

export const dynamic = "force-dynamic";

export default async function SeoPagesAdminPage() {
  await requireAdmin();

  let rows: SeoPageListRow[] = [];
  let schemaMissing = false;

  try {
    rows = await db
      .select({
        id: seoPages.id,
        slug: seoPages.slug,
        pageType: seoPages.pageType,
        countryName: seoPages.countryName,
        title: seoPages.title,
        published: seoPages.published,
        indexable: seoPages.indexable,
        updatedAt: seoPages.updatedAt,
      })
      .from(seoPages)
      .orderBy(asc(seoPages.updatedAt));
  } catch (error) {
    console.warn("[admin/seo-pages] seo_pages table missing or query failed:", error);
    schemaMissing = true;
  }

  return (
    <>
      <PageHeader
        title="SEO Pages"
        description="Manage location pages, service-location pages, and other search landing pages."
        action={
          <Link
            href="/admin/seo-pages/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New page
          </Link>
        }
      />

      {schemaMissing ? (
        <div className="rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">The seo_pages table is missing.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run <code className="rounded bg-surface px-1.5 py-0.5 text-ink">npx drizzle-kit push</code>{" "}
            from the project root to apply the schema. SEO pages will appear here once the table exists.
          </p>
        </div>
      ) : (
        <SeoPagesTable rows={rows} />
      )}
    </>
  );
}
