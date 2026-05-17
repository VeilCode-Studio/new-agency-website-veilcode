import { readFile } from "fs/promises";
import path from "path";

export const PROJECT_SAMPLE_JSON_FILENAME = "project-case-study-sample.json";
export const PROJECT_SAMPLE_JSON_CONTENT_TYPE = "application/json; charset=utf-8";

export type ProjectSampleJson = {
  filename: string;
  contentType: string;
  content: string;
};

export async function readProjectSampleJson(): Promise<ProjectSampleJson> {
  const filePath = path.join(process.cwd(), "docs", PROJECT_SAMPLE_JSON_FILENAME);
  const content = await readFile(filePath, "utf8");

  return {
    filename: PROJECT_SAMPLE_JSON_FILENAME,
    contentType: PROJECT_SAMPLE_JSON_CONTENT_TYPE,
    content,
  };
}
