import type { BlogPost } from "@/constants/blog";
import { type InferSelectModel } from "drizzle-orm";
import { blogPosts } from "@/db/schema";

export function mapDbPostToClientPost(row: InferSelectModel<typeof blogPosts>): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    featured: row.featured,
    publishedAt: row.publishedAt instanceof Date ? row.publishedAt.toISOString() : row.publishedAt,
    readTime: row.readTime,
    author: row.author,
    heroAlt: row.heroAlt,
    heroSrc: row.heroSrc,
    toc: row.toc,
    body: row.body,
    relatedSlugs: row.relatedSlugs,
    classes: row.classes,
  };
}
