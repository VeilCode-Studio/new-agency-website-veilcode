import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import ts from "typescript";
import { getServiceHeroImage, isServiceImageSource } from "../lib/service-images.ts";

function load(path, dependencies = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, URL, Date, Response, console: { error() {} }, require(name) {
    assert.ok(name in dependencies, `Unexpected dependency ${name}`);
    return dependencies[name];
  } });
  return exports;
}
const { parseServiceImageInput } = load("lib/services/image-input.ts", {
  "@/lib/service-images": { isServiceImageSource },
});
const uploaded = "https://res.cloudinary.com/studio/image/upload/v123/services/hero.webp";

test("each service gets a distinct, optimized default with alt text and title; clearing restores it", () => {
  const sources = new Set();
  for (const id of ["web", "mobile", "ai"]) {
    const image = getServiceHeroImage({ id, title: id, heroSrc: null });
    assert.ok(image.heroAlt && image.heroTitle);
    assert.ok(statSync(`public${image.heroSrc}`).size < 100_000);
    sources.add(image.heroSrc);
  }
  assert.equal(sources.size, 3);
  assert.equal(getServiceHeroImage({ id: "other", title: "Other" }), null);
  assert.equal(getServiceHeroImage({ id: "constructor", title: "Unknown" }), null);
  assert.equal(getServiceHeroImage({ id: "web", title: "Web", heroSrc: uploaded, heroAlt: "Custom view", heroTitle: "Custom title" }).heroSrc, uploaded);
});

test("image input preserves omitted fields, accepts uploaded replacements and clears overrides", () => {
  assert.equal(JSON.stringify(parseServiceImageInput({}).data), "{}");
  assert.equal(parseServiceImageInput({ heroSrc: uploaded, heroAlt: "Booking interface" }).data.heroSrc, uploaded);
  assert.equal(parseServiceImageInput({ heroSrc: null }).data.heroSrc, null);
  assert.equal(parseServiceImageInput({ heroSrc: "", heroAlt: "Old text" }).data.heroAlt, null);
});

test("image input rejects unsupported sources, missing alt text and malformed values", () => {
  for (const heroSrc of ["javascript:alert(1)", "//example.com/a.png", "https://example.com/a.png", "http://res.cloudinary.com/a/image/upload/b.png", "https://res.cloudinary.com.evil.test/a/image/upload/b.png", "/images/services/../../a.png", "https://res.cloudinary.com/a/image/upload/b.png?x=1", "https://res.cloudinary.com/a/image/upload/b.svg", "https://res.cloudinary.com/a/image/upload/b.gif"]) {
    assert.equal(parseServiceImageInput({ heroSrc, heroAlt: "Description" }).success, false, heroSrc);
  }
  for (const body of [{ heroSrc: uploaded, heroAlt: " " }, { heroSrc: uploaded, heroAlt: 42 }, { heroSrc: {} }, { heroAlt: "Partial edit" }, { heroSrc: uploaded, heroAlt: "x".repeat(501) }, { heroSrc: uploaded, heroAlt: "View", heroTitle: "x".repeat(201) }]) {
    assert.equal(parseServiceImageInput(body).success, false);
  }
});

for (const method of ["POST", "PUT"]) {
  for (const scenario of ["replacement", "clear", "omitted", "invalid", "unauthorized"]) {
    test(`service ${method}: ${scenario} image payload`, async () => {
      let saved;
      const invalidated = [];
      const chain = { values(data) { saved = data; return chain; }, set(data) { saved = data; return chain; }, where() { return chain; }, returning: async () => [{ id: "web", ...saved }] };
      const handler = load(`app/api/admin/services/${method === "POST" ? "" : "[id]/"}route.ts`, {
        "next/cache": { revalidatePath: path => invalidated.push(path) },
        "next/server": { NextResponse: { json: Response.json.bind(Response) } },
        "drizzle-orm": { eq() {}, asc() {} },
        "@/db/drizzle": { db: { insert: () => chain, update: () => chain } },
        "@/db/schema": { services: {} },
        "@/lib/auth/admin": { getAdminContext: async () => scenario === "unauthorized" ? null : {} },
        "@/lib/services/image-input": { parseServiceImageInput },
      })[method];
      const body = scenario === "omitted" ? {} : { heroSrc: scenario === "clear" ? null : uploaded, heroAlt: scenario === "invalid" ? "" : "A booking app", heroTitle: "App preview" };
      const response = await handler({ json: async () => body }, { params: Promise.resolve({ id: "web" }) });
      assert.equal(response.status, scenario === "unauthorized" ? 401 : scenario === "invalid" ? 400 : method === "POST" ? 201 : 200);
      if (["invalid", "unauthorized"].includes(scenario)) { assert.equal(saved, undefined); assert.equal(invalidated.length, 0); }
      else {
        assert.equal(saved.heroSrc, scenario === "clear" ? null : scenario === "omitted" ? undefined : uploaded);
        assert.equal(invalidated.length, 1);
        if (scenario === "omitted") assert.equal(Object.hasOwn(saved, "heroSrc"), false);
      }
    });
  }
}
