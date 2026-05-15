import { readFile } from "fs/promises";
import path from "path";

export const BLOG_SAMPLE_JSON_FILENAME = "blog-post-workflow-automation.json";
export const BLOG_SAMPLE_JSON_CONTENT_TYPE = "application/json; charset=utf-8";

export type BlogSampleJson = {
  filename: string;
  contentType: string;
  content: string;
};

export async function readBlogSampleJson(): Promise<BlogSampleJson> {
  const filePath = path.join(process.cwd(), "docs", BLOG_SAMPLE_JSON_FILENAME);
  const content = await readFile(filePath, "utf8");

  return {
    filename: BLOG_SAMPLE_JSON_FILENAME,
    contentType: BLOG_SAMPLE_JSON_CONTENT_TYPE,
    content,
  };
}
