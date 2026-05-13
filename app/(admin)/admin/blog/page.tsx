import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus, Eye } from "lucide-react";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  BlogPostsTable,
  type BlogPostListRow,
} from "@/components/admin/blog/BlogPostsTable";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  await requireAdmin();

  let rows: BlogPostListRow[] = [];
  let schemaMissing = false;

  try {
    rows = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        category: blogPosts.category,
        heroSrc: blogPosts.heroSrc,
        featured: blogPosts.featured,
        publishedAt: blogPosts.publishedAt,
        readTime: blogPosts.readTime,
        published: blogPosts.published,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
  } catch (err) {
    console.warn("[admin/blog] blog_posts table missing or query failed:", err);
    schemaMissing = true;
  }

  return (
    <>
      <PageHeader
        title="Blog"
        description="Manage articles shown on the public blog."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog/preview"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-line-hi hover:bg-surface-hi"
            >
              <Eye className="size-4" />
              Preview Blog
            </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New post
          </Link>
        </div>
        }
      />

      {schemaMissing && (
        <div className="mb-6 rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">The blog_posts table is missing.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
              npx drizzle-kit push
            </code>{" "}
            from the project root to apply the schema. Posts will appear
            here once the table exists.
          </p>
        </div>
      )}

      {!schemaMissing && <BlogPostsTable rows={rows} />}
    </>
  );
}
