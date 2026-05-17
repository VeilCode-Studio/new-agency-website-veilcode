import type { BlogPost } from "@/constants/blog";

export type BlogGridPost = Pick<
  BlogPost,
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "tags"
  | "publishedAt"
  | "readTime"
  | "author"
  | "heroAlt"
  | "heroSrc"
  | "classes"
>;

export type BlogGridPostOptions = {
  limit?: number;
  excludeSlug?: string;
  excludeFeatured?: boolean;
};

function publishedTime(post: BlogPost) {
  const time = Date.parse(post.publishedAt);
  return Number.isNaN(time) ? 0 : time;
}

export function getBlogGridPosts(posts: BlogPost[], options: BlogGridPostOptions = {}) {
  const { limit, excludeSlug, excludeFeatured = false } = options;

  const sorted = [...posts]
    .filter((post) => post.slug !== excludeSlug)
    .filter((post) => !excludeFeatured || !post.featured)
    .sort((a, b) => publishedTime(b) - publishedTime(a));

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function toBlogGridPost(post: BlogPost): BlogGridPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    author: post.author,
    heroAlt: post.heroAlt,
    heroSrc: post.heroSrc,
    classes: post.classes,
  };
}
