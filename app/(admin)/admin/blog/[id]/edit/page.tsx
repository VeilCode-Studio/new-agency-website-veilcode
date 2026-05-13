import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import type { BlogFormData } from "@/components/admin/blog/BlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
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
    .from(blogPosts)
    .where(eq(blogPosts.id, numId))
    .limit(1);

  if (!row) notFound();

  const initialData: BlogFormData = {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags ?? [],
    featured: row.featured,
    publishedAt: new Date(row.publishedAt).toISOString().slice(0, 10),
    readTime: row.readTime,
    author: row.author,
    heroAlt: row.heroAlt,
    heroSrc: row.heroSrc ?? null,
    toc: row.toc ?? [],
    body: row.body ?? [],
    relatedSlugs: row.relatedSlugs ?? [],
    classes: row.classes,
    published: row.published,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <BlogPostForm mode="edit" id={row.id} initialData={initialData} />
    </div>
  );
}
