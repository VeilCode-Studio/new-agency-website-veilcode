import React from 'react'
import { POSTS } from '@/constants/blog'
import { BlogHero } from './_components/BlogHero';
import { FeaturedPost } from './_components/FeaturedPost';
import { NewsletterCTA } from './[slug]/Newsletter';
import { PostGrid } from './_components/PostGrid';
import { DataRecoveryNotice } from '@/components/shared/DataRecoveryNotice';
import { getPublishedBlogs } from '@/queries';
import { mapDbPostToClientPost } from '@/lib/blog/mappers';

export const metadata = {
  title: "Blog — VeilCode",
  description: "Engineering deep-dives, design thinking, and practical AI from the VeilCode team."
}

const page = async () => {
  let allPosts = POSTS;
  let usedFallbackPosts = false;

  try {
    const blogs = await getPublishedBlogs();
    if (blogs.length > 0) allPosts = blogs.map(mapDbPostToClientPost);
  } catch (err) {
    console.warn("[blog] Falling back to static posts:", err);
    usedFallbackPosts = true;
  }

  const featured = allPosts.find((post) => post.featured) ?? allPosts[0];
  const gridPosts = allPosts.filter((post) => post.slug !== featured.slug);
  const categories = Array.from(new Set(allPosts.map((p) => p.category))).sort();
  const tags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();

  const totalReadingMinutes = allPosts.reduce((total, blog) => {
    const minutes = Number.parseInt(blog.readTime, 10);
    return total + (Number.isNaN(minutes) ? 0 : minutes);
  }, 0);


  return (
    <>
      <BlogHero
        stats={{
          articlesPublished: allPosts.length,
          disciplinesCovered: categories.length,
          readingMinutes: totalReadingMinutes,
        }}
      />
      {usedFallbackPosts && (
        <DataRecoveryNotice
          eyebrow="Blog fallback"
          title="We loaded a backup set of posts."
          description="The live blog feed could not be loaded just now, so we are showing the built-in posts instead. Refresh the page in a moment if you want the latest entries."
          retryLabel="Reload blog"
        />
      )}
      <FeaturedPost post={featured} />

      <PostGrid
        posts={gridPosts}
        categories={categories}
        tags={tags}
      />

      <NewsletterCTA />
    </>
  )
}

export default page
