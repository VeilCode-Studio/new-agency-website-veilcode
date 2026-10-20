import { createRequire } from "node:module";
import { join } from "node:path";
import { writeFileSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
const req = createRequire(
  join(process.env.TEMP, "veilcode-lighthouse-tools/package.json"),
);
const { chromium } = req("playwright");
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const results = process.env.VEILCODE_VERIFY_ASSETS_RESUME
  ? JSON.parse(
      readFileSync(
        "docs/redesign/client-pages/verification/asset-interactions.json",
        "utf8",
      ),
    )
  : { images: {}, interactions: {}, errors: [] };
const base = process.env.VEILCODE_VERIFY_URL || "http://localhost:3100";
const output =
  "docs/redesign/client-pages/verification/asset-interactions.json";
const save = () => writeFileSync(output, JSON.stringify(results, null, 2));
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  await context.route(/facebook\.com|connect\.facebook\.net/, (r) => r.abort());
  await context.route("**/api/**", (r) =>
    r.request().method() === "GET"
      ? r.continue()
      : r.fulfill({
          status: 503,
          json: { message: "Intercepted verification" },
        }),
  );
  const p = await context.newPage();
  p.setDefaultNavigationTimeout(60000);
  p.on("pageerror", (e) =>
    results.errors.push({ url: p.url(), message: e.message, stack: e.stack }),
  );
  const xml = await (await context.request.get(base + "/sitemap.xml")).text();
  const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => p.startsWith("/work/") || p.startsWith("/blog/"));
  for (const route of routes) {
    if (
      process.env.VEILCODE_VERIFY_ASSETS_RESUME &&
      results.images[route]?.length &&
      results.images[route].every((i) => i.loaded)
    )
      continue;
    await p.goto(base + route, { waitUntil: "networkidle" });
    const imgs = p.locator(".public-design img");
    results.images[route] = [];
    for (let i = 0; i < (await imgs.count()); i++) {
      const img = imgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      let loaded = true;
      try {
        await img.evaluate(
          (e) =>
            new Promise((resolve, reject) => {
              if (e.complete)
                return e.naturalWidth
                  ? resolve()
                  : reject(Error("Image failed"));
              e.onload = () => resolve();
              e.onerror = () => reject(Error("Image failed"));
              setTimeout(() => reject(Error("Image timed out")), 30000);
            }),
        );
      } catch {
        loaded = false;
      }
      results.images[route].push(
        await img.evaluate(
          (e, loaded) => ({
            alt: e.alt,
            loaded,
            naturalWidth: e.naturalWidth,
            loading: e.loading,
            srcset: Boolean(e.srcset),
            sizes: e.sizes,
            optimized: e.currentSrc.includes("/_next/image"),
            renderedWidth: Math.round(e.getBoundingClientRect().width),
          }),
          loaded,
        ),
      );
      save();
    }
    console.log(
      JSON.stringify({
        route,
        images: results.images[route].length,
        failed: results.images[route].filter((i) => !i.loaded).length,
      }),
    );
  }
  await p.goto(base + "/blog", { waitUntil: "networkidle" });
  const group = p.getByRole("group", { name: "Filter by category" });
  const buttons = group.getByRole("button");
  results.interactions.blogFilters = [];
  for (let i = 0; i < (await buttons.count()); i++) {
    await buttons.nth(i).click();
    assert.equal(await buttons.nth(i).getAttribute("aria-pressed"), "true");
    results.interactions.blogFilters.push(await buttons.nth(i).innerText());
  }
  const article = routes.find((p) => p.startsWith("/blog/"));
  await p.goto(base + article, { waitUntil: "networkidle" });
  await p
    .getByRole("button", { name: "Copy link", exact: true })
    .filter({ visible: true })
    .click();
  await p
    .getByRole("button", { name: "Copied!", exact: true })
    .filter({ visible: true })
    .waitFor();
  assert.equal(
    await p.evaluate(() => navigator.clipboard.readText()),
    base + article,
  );
  results.interactions.copyArticleLink = true;
  await p.evaluate(() => {
    window.__verificationOpened = [];
    window.open = (url) => {
      window.__verificationOpened.push(url);
      return null;
    };
  });
  await p
    .getByRole("button", { name: "Share on LinkedIn", exact: true })
    .filter({ visible: true })
    .click();
  assert.match(
    (await p.evaluate(() => window.__verificationOpened))[0],
    /^https:\/\/www.linkedin.com\/sharing\/share-offsite/,
  );
  results.interactions.shareOpensCorrectIntent = true;
  const toc = p
    .getByRole("navigation", { name: "Table of contents" })
    .locator("a")
    .first();
  if (await toc.count()) {
    await toc.click();
    const href = await toc.getAttribute("href");
    assert.equal(await p.locator(href).count(), 1);
    results.interactions.articleContents = true;
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(base + article, { waitUntil: "networkidle" });
  const details = p
    .locator("details")
    .filter({ has: p.locator("summary").filter({ hasText: "On this page" }) });
  await details.locator("summary").click();
  assert.ok((await details.getAttribute("open")) !== null);
  results.interactions.mobileContents = true;
  await p.goto(base + "/about", { waitUntil: "networkidle" });
  assert.equal(await p.locator('#navbar a[href="/start"]').isVisible(), false);
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.getByRole("button", { name: "Choose theme" }).click();
  await p.getByRole("menuitemradio", { name: /Linen/ }).click();
  await p.reload({ waitUntil: "networkidle" });
  assert.ok(await p.locator("html.linen").count());
  results.interactions.themePersistence = true;
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const rp = await reduced.newPage();
  await rp.goto(base + "/about");
  results.interactions.reducedMotion = await rp
    .locator(".public-button")
    .first()
    .evaluate((e) => getComputedStyle(e).transitionDuration === "0s");
  await reduced.close();
  save();
  const failed = Object.values(results.images)
    .flat()
    .filter((i) => !i.loaded || !i.optimized || !i.srcset);
  assert.equal(failed.length, 0, JSON.stringify(failed));
  assert.equal(results.errors.length, 0);
  console.log(
    JSON.stringify({
      images: Object.values(results.images).flat().length,
      interactions: results.interactions,
      errors: results.errors,
    }),
  );
} finally {
  save();
  await browser.close();
}
