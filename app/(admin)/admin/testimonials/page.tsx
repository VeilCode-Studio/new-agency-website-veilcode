import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  TestimonialsTable,
  type TestimonialListRow,
} from "@/components/admin/testimonials/TestimonialsTable";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await requireAdmin();

  let rows: TestimonialListRow[] = [];
  let schemaMissing = false;

  try {
    rows = await db
      .select({
        id: testimonials.id,
        name: testimonials.name,
        role: testimonials.role,
        company: testimonials.company,
        quote: testimonials.quote,
        avatar: testimonials.avatar,
        createdAt: testimonials.createdAt,
        updatedAt: testimonials.updatedAt,
      })
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  } catch (err) {
    console.warn("[admin/testimonials] testimonials table missing or query failed:", err);
    schemaMissing = true;
  }

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Manage client stories shown on the landing page carousel."
        action={
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New testimonial
          </Link>
        }
      />

      {schemaMissing && (
        <div className="mb-6 rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">The testimonials table is missing.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
              npx drizzle-kit push
            </code>{" "}
            from the project root to apply the schema. Testimonials will appear
            here once the table exists.
          </p>
        </div>
      )}

      {!schemaMissing && <TestimonialsTable rows={rows} />}
    </>
  );
}
