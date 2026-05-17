import test from "node:test";
import assert from "node:assert/strict";
import { readProjectSampleJson } from "./sampleJson.ts";
import { parseProjectJsonForForm } from "./importJson.ts";

test("readProjectSampleJson returns the case study sample as valid import JSON", async () => {
  const sample = await readProjectSampleJson();

  assert.equal(sample.filename, "project-case-study-sample.json");
  assert.equal(sample.contentType, "application/json; charset=utf-8");

  const parsed = parseProjectJsonForForm(sample.content);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  assert.equal(parsed.data.slug, "kampala-healthcare-portal");
});
