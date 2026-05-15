import type { BlogAuthor, ContentBlock, TocEntry } from "../../constants/blog";
import type { BlogPostClasses } from "../../types/content";
import { blogPostInputSchema, formatBlogValidationError } from "./validation.ts";

export type ImportedBlogFormData = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  publishedAt: string;
  readTime: string;
  author: BlogAuthor;
  heroAlt: string;
  heroSrc: string | null;
  toc: TocEntry[];
  body: ContentBlock[];
  relatedSlugs: string[];
  classes: BlogPostClasses;
  published: boolean;
};

export type BlogJsonImportResult =
  | { ok: true; data: ImportedBlogFormData }
  | { ok: false; error: string };

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Import file is not valid JSON.");
  }
}

function formatDateForInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function parseBlogJsonForForm(raw: string): BlogJsonImportResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Paste JSON or choose a JSON file first." };

  let parsed: unknown;
  try {
    parsed = parseJson(trimmed);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Import file is not valid JSON.",
    };
  }

  const validated = blogPostInputSchema.safeParse(parsed);
  if (!validated.success) {
    return { ok: false, error: formatBlogValidationError(validated.error) };
  }

  const post = validated.data;

  return {
    ok: true,
    data: {
      ...post,
      publishedAt: formatDateForInput(post.publishedAt),
    },
  };
}
