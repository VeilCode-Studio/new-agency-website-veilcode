import React from "react";
import { desc, type InferSelectModel } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { mapDbPostToClientPost } from "@/lib/blog/mappers";
import { BlogHero } from "@/app/(client)/blog/_components/BlogHero";
import { FeaturedPost } from "@/app/(client)/blog/_components/FeaturedPost";
import { PostGrid } from "@/app/(client)/blog/_components/PostGrid";
import { NewsletterCTA } from "@/app/(client)/blog/[slug]/Newsletter";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBlogIndexPreviewPage() {
  await requireAdmin();

  let rows: InferSelectModel<typeof blogPosts>[] = [];
  try {
    rows = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
  } catch (err) {
    console.warn("Could not load blog posts for preview:", err);
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-ink-muted">No posts found in the database. Add a post first to preview.</p>
        <Link href="/admin/blog" className="mt-4 font-semibold text-brand hover:underline">
          Back to Blog Admin
        </Link>
      </div>
    );
  }

  const allPosts = rows.map(mapDbPostToClientPost);
  const featured = allPosts.find((post) => post.featured) ?? allPosts[0];
  const gridPosts = allPosts.filter((post) => post.slug !== featured.slug);

  const categories = Array.from(new Set(allPosts.map((p) => p.category))).sort();
  const tags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();

  const totalReadingMinutes = allPosts.reduce((total, post) => {
  const minutes = Number.parseInt(post.readTime, 10);
  return total + (Number.isNaN(minutes) ? 0 : minutes);
}, 0);

  return (
    <div className="rounded-2xl border border-line bg-page overflow-clip">
      {/* Admin Preview Banner */}
      <div className="flex items-center justify-between border-b border-brand/20 bg-brand/5 px-6 py-3 text-sm text-brand">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="flex items-center gap-1 font-medium hover:underline">
            <ChevronLeft className="size-4" />
            Back to Dashboard
          </Link>
          <span className="h-4 w-px bg-brand/20"></span>
          <span className="font-semibold">Live Preview: Blog Feed</span>
        </div>
      </div>

      {/* Main Client Content */}
      <div className="pb-12">
        <BlogHero
          stats={{
            articlesPublished: allPosts.length,
            disciplinesCovered: categories.length,
            readingMinutes: totalReadingMinutes,
          }}
        />
        {featured && <FeaturedPost post={featured} />}
        <PostGrid posts={gridPosts} categories={categories} tags={tags} />
        <NewsletterCTA />
      </div>
    </div>
  );
}
