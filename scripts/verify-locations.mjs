import { createRequire } from "node:module";
import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { LOCATION_MARKETS } from "../constants/locations.ts";

const auditRequire = createRequire(
  join(
    process.env.VEILCODE_AUDIT_TOOLS ||
      join(process.env.TEMP, "veilcode-lighthouse-tools"),
    "package.json",
  ),
);
const { chromium } = auditRequire("playwright");
const { default: AxeBuilder } = auditRequire("@axe-core/playwright");
const base = process.env.VEILCODE_VERIFY_URL || "http://localhost:3100";
const output = "docs/redesign/locations/verification";
mkdirSync(output, { recursive: true });
const results = process.env.VEILCODE_VERIFY_RESUME
  ? JSON.parse(readFileSync(join(output, "results.json"), "utf8"))
  : {
      markets: {},
      links: {},
      errors: [],
      noJavaScript: {},
      hub: {},
    };
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const save = () =>
  writeFileSync(join(output, "results.json"), JSON.stringify(results, null, 2));
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await context.route(/facebook\.com|connect\.facebook\.net/, (route) =>
    route.abort(),
  );
  // No test may write to a live form, chat session, or mailing list.
  await context.route("**/api/**", (route) =>
    route.request().method() === "GET"
      ? route.continue()
      : route.fulfill({
          status: 503,
          json: { message: "Intercepted by local verification" },
        }),
  );
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(60000);
  page.on("pageerror", (error) =>
    results.errors.push({
      message: error.message,
      url: page.url(),
      stack: error.stack,
    }),
  );
  const destinations = new Set();
  const selectedMarkets = process.env.VEILCODE_VERIFY_COUNTRIES
    ? LOCATION_MARKETS.filter((m) =>
        process.env.VEILCODE_VERIFY_COUNTRIES.split(",").includes(m.slug),
      )
    : LOCATION_MARKETS;
  for (const market of selectedMarkets) {
    const route = `/locations/${market.slug}`;
    const response = await page.goto(`${base}${route}`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("h1").textContent(), market.h1);
    assert.equal(await page.locator("main").count(), 1);
    assert.equal(await page.locator("a button, button a").count(), 0);
    assert.equal(await page.title(), market.metaTitle);
    assert.equal(
      await page.locator('meta[name="description"]').getAttribute("content"),
      market.metaDescription,
    );
    assert.equal(await page.locator('meta[name="keywords"]').count(), 0);
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      `https://www.veilcode.studio${route}`,
    );
    assert.equal(
      await page.locator('meta[property="og:image"]').getAttribute("content"),
      `https://www.veilcode.studio${market.ogImage}`,
    );
    assert.equal(
      await page.locator('meta[name="twitter:card"]').getAttribute("content"),
      "summary_large_image",
    );
    assert.equal(
      await page.locator('meta[name="robots"][content*="noindex"]').count(),
      0,
    );
    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => JSON.parse(node.textContent)),
      );
    const business = schemas.find((s) => s["@type"] === market.schemaType);
    assert.ok(business, `${market.slug} business schema`);
    if (market.slug === "uganda")
      assert.equal(business.address.addressLocality, "Kampala");
    else {
      assert.equal(business.address, undefined);
      assert.equal(business.areaServed, market.areaServed);
    }
    const crumbs = schemas.find((s) => s["@type"] === "BreadcrumbList");
    assert.equal(crumbs.itemListElement.length, 3);
    assert.equal(
      crumbs.itemListElement[1].item,
      "https://www.veilcode.studio/locations",
    );
    assert.ok(schemas.find((s) => s["@type"] === "WebPage"));
    const record = (results.markets[market.slug] = {
      status: response.status(),
      cache: response.headers()["cache-control"],
      themes: {},
      viewports: {},
      faq: {},
      images: [],
    });
    for (const theme of ["light", "linen", "midnight", "dark"]) {
      await page.evaluate(
        (value) => localStorage.setItem("theme", value),
        theme,
      );
      await page.reload({ waitUntil: "networkidle" });
      assert.ok(await page.locator(`html.${theme}`).count());
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      record.themes[theme] = axe.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map((n) => n.target),
      }));
      save();
      assert.equal(
        axe.violations.length,
        0,
        `${market.slug}/${theme}: ${JSON.stringify(record.themes[theme])}`,
      );
    }
    // Exercise the real selector and verify persistence, not only token injection.
    await page
      .getByRole("button", { name: "Choose theme", exact: true })
      .click();
    await page.getByRole("menuitemradio", { name: /^Linen/ }).click();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.evaluate(() => localStorage.getItem("theme")),
      "linen",
    );
    assert.ok(await page.locator("html.linen").count());
    const summaries = page.locator(".location-faqs summary");
    assert.equal(await summaries.count(), market.faqs.length);
    for (let i = 0; i < market.faqs.length; i++) {
      const summary = summaries.nth(i);
      await summary.focus();
      await page.keyboard.press("Enter");
      assert.equal(await summary.locator("..").getAttribute("open"), "");
      assert.equal(
        await summary.locator("..").locator("p").textContent(),
        market.faqs[i].answer,
      );
      await page.keyboard.press("Enter");
      assert.equal(await summary.locator("..").getAttribute("open"), null);
    }
    record.faq.keyboard = "pass";
    // Open every answer for a separate accessibility pass.
    await page
      .locator(".location-faqs details")
      .evaluateAll((nodes) => nodes.forEach((n) => (n.open = true)));
    const openAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    record.faq.accessibility = openAxe.violations;
    assert.equal(openAxe.violations.length, 0);
    await page
      .locator(".location-faqs details")
      .evaluateAll((nodes) => nodes.forEach((n) => (n.open = false)));
    for (const [width, height] of [
      [1440, 900],
      [1280, 720],
      [768, 1024],
      [390, 844],
      [320, 740],
    ]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      const ctas = await page
        .locator(".location-actions a")
        .evaluateAll((nodes) =>
          nodes.map((n) => {
            const r = n.getBoundingClientRect();
            return {
              text: n.textContent,
              top: r.top,
              bottom: r.bottom,
              height: r.height,
              width: r.width,
            };
          }),
        );
      record.viewports[`${width}x${height}`] = { overflow, ctas };
      save();
      assert.equal(overflow, false, `${market.slug} overflow ${width}`);
      assert.ok(
        ctas.every((r) => r.bottom <= height && r.top >= 64 && r.height >= 44),
        `${market.slug} CTA visibility ${width}: ${JSON.stringify(ctas)}`,
      );
      if (width === 1440 || width === 390) {
        await page.screenshot({
          path: join(output, `${market.slug}-${width}-linen.png`),
          fullPage: true,
        });
        await page.screenshot({
          path: join(output, `${market.slug}-${width}-hero-linen.png`),
        });
      }
    }
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    assert.equal(
      await page
        .locator("#navbar")
        .getByRole("button", { name: "Close menu", exact: true })
        .getAttribute("aria-expanded"),
      "true",
    );
    assert.ok(await page.locator("#mobile-navigation").isVisible());
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .getAttribute("aria-expanded"),
      "false",
    );
    record.mobileMenu = "open and Escape close passed";
    await page.locator(".location-related").last().scrollIntoViewIfNeeded();
    await page.locator(".location-work-image").first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".location-work-image img")].every(
        (n) => n.complete && n.naturalWidth > 0,
      ),
    );
    record.images = await page
      .locator(".locations-design img")
      .evaluateAll((nodes) =>
        nodes.map((n) => ({
          src: n.currentSrc,
          loading: n.loading,
          priority: n.fetchPriority,
          sizes: n.sizes,
          naturalWidth: n.naturalWidth,
        })),
      );
    assert.ok(
      record.images.every(
        (i) => i.src.includes("/_next/image?") && i.sizes && i.naturalWidth > 0,
      ),
    );
    assert.equal(
      record.images.filter(
        (i) => i.loading === "eager" && i.priority === "high",
      ).length,
      1,
    );
    assert.ok(record.images.slice(1).every((i) => i.loading === "lazy"));
    for (const href of await page
      .locator("main a[href]")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href"))))
      if (href.startsWith("/")) destinations.add(href.split("#")[0]);
    await page.setViewportSize({ width: 1440, height: 900 });
    save();
    console.log(
      `${market.slug}: metadata/schema, 4 themes, FAQ keyboard, 5 viewports passed`,
    );
  }
  const hub = await page.goto(`${base}/locations`, {
    waitUntil: "networkidle",
  });
  assert.equal(hub.status(), 200);
  assert.equal(await page.locator(".location-hub-card").count(), 5);
  const hubAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.equal(hubAxe.violations.length, 0);
  results.hub = { status: 200, accessibilityViolations: 0, markets: 5 };
  if (process.env.VEILCODE_VERIFY_RESUME) {
    for (const market of LOCATION_MARKETS) {
      const response = await context.request.get(
        `${base}/locations/${market.slug}`,
      );
      assert.equal(response.status(), 200);
      const html = await response.text();
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
      for (const match of main.matchAll(/<a\b[^>]*href="([^"]+)"/g))
        if (match[1].startsWith("/")) destinations.add(match[1].split("#")[0]);
    }
  }
  for (const href of destinations) {
    const r = await context.request.get(`${base}${href}`);
    results.links[href] = r.status();
    assert.equal(r.status(), 200, href);
  }
  const missing = await context.request.get(`${base}/locations/not-a-market`);
  assert.equal(missing.status(), 404);
  assert.match(await missing.text(), /name="robots" content="noindex"/);
  const sitemap = await context.request.get(`${base}/sitemap.xml`);
  const xml = await sitemap.text();
  assert.equal(sitemap.status(), 200);
  for (const market of LOCATION_MARKETS)
    assert.ok(xml.includes(`/locations/${market.slug}</loc>`));
  assert.ok(xml.includes("/locations</loc>"));
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  for (const market of LOCATION_MARKETS) {
    await staticPage.goto(`${base}/locations/${market.slug}`, {
      waitUntil: "load",
    });
    assert.equal(await staticPage.locator("h1").textContent(), market.h1);
    assert.equal(
      await staticPage.locator(".location-faqs details p").count(),
      market.faqs.length,
    );
    await staticPage.locator(".location-faqs summary").first().click();
    assert.equal(
      await staticPage
        .locator(".location-faqs details")
        .first()
        .getAttribute("open"),
      "",
    );
    results.noJavaScript[market.slug] = "content, links and native FAQ usable";
  }
  assert.deepEqual(results.errors, []);
  save();
  console.log(
    JSON.stringify({
      markets: 5,
      themeAudits: 20,
      viewportChecks: 25,
      links: destinations.size,
      pageErrors: results.errors,
      hub: results.hub,
      noJavaScript: 5,
    }),
  );
} finally {
  save();
  await browser.close();
}
