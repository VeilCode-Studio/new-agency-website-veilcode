import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import ts from "typescript";

function loadModule(path, dependencies = {}) {
  const code = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, console: { log() {}, error() {} }, Date, Response, URL,
    require: (name) => {
      assert.ok(name in dependencies, `Unexpected real dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename: path });
  return exports;
}

test("Meta Pixel stays disabled unless explicitly enabled with a numeric ID", () => {
  const { getMetaPixelId } = loadModule("lib/analytics/meta-pixel.ts");
  for (const [enabled, id] of [[undefined, undefined], [undefined, "123"], ["false", "123"], ["TRUE", "123"], ["true", ""], ["true", "123';alert(1)"], ["true", " 123"]]) {
    assert.equal(getMetaPixelId(enabled, id), null);
  }
  assert.equal(getMetaPixelId("true", "1233482635537855"), "1233482635537855");
});

// Exercise actual route handlers with fake persistence: no production writes.
const serviceImages = loadModule("lib/service-images.ts");
const serviceImageInput = loadModule("lib/services/image-input.ts", { "@/lib/service-images": serviceImages });
for (const category of ["projects", "services", "blog"]) {
  for (const method of ["POST", "PUT", "DELETE"]) {
    for (const scenario of ["success", "unauthorized", "database failure"]) {
      test(`${category} ${method}: ${scenario} invalidates home only after a successful write`, async () => {
        const invalidated = [];
        let writes = 0;
        const row = { id: "test", title: "Test", slug: "test" };
        const chain = {
          values() { return chain; }, set() { return chain; },
          where() {
            if (method === "DELETE") {
              if (scenario === "database failure") throw new Error("Simulated outage");
              return Promise.resolve();
            }
            return chain;
          },
          returning() {
            if (scenario === "database failure") throw new Error("Simulated outage");
            return Promise.resolve([row]);
          },
        };
        const mutate = () => { writes++; return chain; };
        const dependencies = {
          "next/cache": { revalidatePath: (path) => invalidated.push(path) },
          "next/server": { NextResponse: Object.assign(class extends Response {}, { json: Response.json.bind(Response) }) },
          "drizzle-orm": { eq: () => ({}), asc() {}, desc() {} },
          "@/db/drizzle": { db: { insert: mutate, update: mutate, delete: mutate } },
          "@/db/schema": { projects: {}, services: {}, blogPosts: {} },
          "@/lib/auth/admin": { getAdminContext: async () => scenario === "unauthorized" ? null : { userId: "test-admin" } },
          "@/lib/services/image-input": serviceImageInput,
          "@/lib/blog/validation": { blogPostInputSchema: { safeParse: () => ({ success: true, data: row }) }, formatBlogValidationError() {} },
        };
        const path = `app/api/admin/${category}/${method === "POST" ? "" : "[id]/"}route.ts`;
        const handler = loadModule(path, dependencies)[method];
        const response = await handler({ json: async () => row }, { params: Promise.resolve({ id: "1" }) });
        assert.equal(response.status, scenario === "success" ? (method === "POST" ? 201 : method === "DELETE" ? 204 : 200) : scenario === "unauthorized" ? 401 : 500);
        assert.deepEqual(invalidated, scenario === "success" ? ["/"] : []);
        assert.equal(writes, scenario === "unauthorized" ? 0 : 1);
      });
    }
  }
}
