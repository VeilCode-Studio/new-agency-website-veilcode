import test from "node:test";
import assert from "node:assert/strict";
import { readBlogSampleJson } from "./sampleJson.ts";
import { parseBlogJsonForForm } from "./importJson.ts";

test("readBlogSampleJson returns the workflow automation sample as valid import JSON", async () => {
  const sample = await readBlogSampleJson();

  assert.equal(sample.filename, "blog-post-workflow-automation.json");
  assert.equal(sample.contentType, "application/json; charset=utf-8");

  const parsed = parseBlogJsonForForm(sample.content);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  assert.equal(parsed.data.slug, "automate-business-workflows");
});
