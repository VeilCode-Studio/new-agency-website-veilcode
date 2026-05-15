import test from "node:test";
import assert from "node:assert/strict";
import { parseBlogJsonForForm } from "./importJson.ts";

const validPayload = {
  slug: "imported-blog-post",
  title: "Imported Blog Post",
  excerpt: "A complete blog post imported from JSON.",
  category: "Engineering",
  tags: ["Import", "Admin"],
  featured: false,
  publishedAt: "2026-05-15T10:30:00.000Z",
  readTime: "5 min read",
  author: {
    name: "Frank Tamale",
    role: "Founder & Lead Engineer",
    initials: "FT",
    bio: "Full-stack engineer.",
    linkedin: "#",
    twitter: "#",
    accent: "text-brand",
    dimBg: "bg-brand-dim",
    border: "border-brand-border",
  },
  heroAlt: "Imported post hero",
  heroSrc: null,
  toc: [{ id: "intro", level: 2, text: "Intro" }],
  body: [
    { type: "h2", id: "intro", text: "Intro" },
    { type: "p", html: "Imported body content." },
  ],
  relatedSlugs: ["next-post"],
  classes: {
    accent: "text-brand",
    dimBg: "bg-brand-dim",
    border: "border-brand-border",
  },
  published: false,
};

test("parseBlogJsonForForm returns form data for a valid blog JSON payload", () => {
  const result = parseBlogJsonForForm(JSON.stringify(validPayload));

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.data.slug, "imported-blog-post");
  assert.equal(result.data.publishedAt, "2026-05-15");
  assert.deepEqual(result.data.tags, ["Import", "Admin"]);
  assert.equal(result.data.body[0].type, "h2");
});

test("parseBlogJsonForForm reports malformed JSON without throwing", () => {
  const result = parseBlogJsonForForm("{not-json");

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.equal(result.error, "Import file is not valid JSON.");
});

test("parseBlogJsonForForm reports schema validation errors", () => {
  const result = parseBlogJsonForForm(JSON.stringify({ ...validPayload, title: "" }));

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.equal(result.error, "Title is required");
});
