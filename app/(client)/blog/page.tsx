import React from 'react'
import { POSTS } from '@/constants/blog'
import { BlogHero } from './_components/BlogHero';
import { FeaturedPost } from './_components/FeaturedPost';
import { NewsletterCTA } from './[slug]/Newsletter';
import { PostGrid } from './_components/PostGrid';
import { getPublishedBlogs } from '@/queries';
import { mapDbPostToClientPost } from '@/lib/blog/mappers';

export const metadata = {
  title: "Blog — VeilCode",
  description: "Engineering deep-dives, design thinking, and practical AI from the VeilCode team."
}

const page = async () => {
  let allPosts = POSTS;

  try {
    const blogs = await getPublishedBlogs();
    if (blogs.length > 0) allPosts = blogs.map(mapDbPostToClientPost);
  } catch (err) {
    console.warn("[blog] Falling back to static posts:", err);
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
