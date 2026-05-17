import test from "node:test";
import assert from "node:assert/strict";
import { getBlogGridPosts, toBlogGridPost } from "./grid.ts";
import type { BlogPost } from "../../constants/blog";

const basePost: BlogPost = {
  slug: "base",
  title: "Base",
  excerpt: "Base excerpt",
  category: "Engineering",
  tags: ["Next.js"],
  featured: false,
  publishedAt: "2026-01-01T00:00:00.000Z",
  readTime: "4 min read",
  author: {
    name: "Frank Tamale",
    role: "Founder",
    initials: "FT",
    bio: "",
    linkedin: "#",
    twitter: "#",
    accent: "text-brand",
    dimBg: "bg-brand-dim",
    border: "border-brand-border",
  },
  heroAlt: "",
  heroSrc: null,
  toc: [],
  body: [],
  relatedSlugs: [],
  classes: {
    accent: "text-brand",
    dimBg: "bg-brand-dim",
    border: "border-brand-border",
  },
};

function post(slug: string, publishedAt: string, featured = false): BlogPost {
  return {
    ...basePost,
    slug,
    title: slug,
    publishedAt,
    featured,
  };
}

test("getBlogGridPosts sorts by newest first and applies a limit", () => {
  const posts = [
    post("oldest", "2026-01-01T00:00:00.000Z"),
    post("newest", "2026-03-01T00:00:00.000Z"),
    post("middle", "2026-02-01T00:00:00.000Z"),
  ];

  const result = getBlogGridPosts(posts, { limit: 2 });

  assert.deepEqual(
    result.map((item) => item.slug),
    ["newest", "middle"],
  );
});

test("getBlogGridPosts can exclude featured posts and a specific slug", () => {
  const posts = [
    post("featured", "2026-04-01T00:00:00.000Z", true),
    post("skip-me", "2026-03-01T00:00:00.000Z"),
    post("show-me", "2026-02-01T00:00:00.000Z"),
  ];

  const result = getBlogGridPosts(posts, {
    excludeFeatured: true,
    excludeSlug: "skip-me",
  });

  assert.deepEqual(
    result.map((item) => item.slug),
    ["show-me"],
  );
});

test("toBlogGridPost keeps card fields and omits article body payloads", () => {
  const result = toBlogGridPost({
    ...basePost,
    body: [{ type: "p", html: "Long article body" }],
    toc: [{ id: "intro", level: 2, text: "Intro" }],
    relatedSlugs: ["next-post"],
  });

  assert.equal(result.slug, "base");
  assert.equal(result.title, "Base");
  assert.equal("body" in result, false);
  assert.equal("toc" in result, false);
  assert.equal("relatedSlugs" in result, false);
});
