import { PublicShell } from "@/components/public/PublicShell";
import React from "react";
import { eq, ne, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { mapDbPostToClientPost } from "@/lib/blog/mappers";
import { BlogPostHero } from "@/app/(client)/blog/[slug]/BlogPostHero";
import { SocialShare } from "@/app/(client)/blog/[slug]/SocialShare";
import { ArticleBody } from "@/app/(client)/blog/[slug]/ArticleBody";
import { ArticleSidebar } from "@/app/(client)/blog/[slug]/ArticleSidebar";
import { NewsletterCTA } from "@/app/(client)/blog/[slug]/Newsletter";
import { RelatedPosts } from "@/app/(client)/blog/[slug]/RelatedPosts";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSinglePostPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  // 1. Fetch the requested post
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, Number(id)))
    .limit(1);

  if (!row) notFound();

  const post = mapDbPostToClientPost(row);

  // 2. Fetch related posts (simple approach: get latest 2 that aren't this one)
  // In a real scenario, you'd match by tags/category or by relatedSlugs array if stored.
  const relatedRows = await db
    .select()
    .from(blogPosts)
    .where(ne(blogPosts.id, Number(id)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(2);

  const related = relatedRows.map(mapDbPostToClientPost);

  return (
    <div className="min-w-0 max-w-full rounded-2xl border border-line bg-page">
      {/* Admin Preview Banner */}
      <div className="flex min-w-0 items-center justify-between border-b border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand sm:px-6">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="/admin/blog"
            className="flex items-center gap-1 font-medium hover:underline"
          >
            <ChevronLeft className="size-4" />
            Back to Dashboard
          </Link>
          <span className="h-4 w-px bg-brand/20"></span>
          <span className="min-w-0 break-words font-semibold">
            Live Preview: {post.title}
          </span>
        </div>
      </div>

      {/* Main Client Content */}
      <PublicShell>
        <div className="min-w-0 max-w-full pb-12">
          <BlogPostHero post={post} />
          <section className="w-full min-w-0 max-w-full overflow-x-clip border-t border-line px-5 py-16 sm:px-6 md:px-10 xl:px-20">
            <div className="mx-auto w-full min-w-0 max-w-300">
              <div className="flex w-full min-w-0 flex-col items-start gap-14 lg:flex-row xl:gap-20">
                {/* Article column */}
                <div className="relative w-full min-w-0 flex-1">
                  <SocialShare post={post} />
                  <ArticleBody blocks={post.body} />
                </div>

                {/* Sidebar */}
                <ArticleSidebar post={post} />
              </div>
            </div>
          </section>

          <NewsletterCTA />
          {related.length > 0 && <RelatedPosts posts={related} />}
        </div>
      </PublicShell>
    </div>
  );
}
