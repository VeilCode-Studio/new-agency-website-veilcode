import { createRequire } from "node:module";
import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const req = createRequire(
  join(process.env.TEMP, "veilcode-lighthouse-tools/package.json"),
);
const { chromium } = req("playwright");
const { default: AxeBuilder } = req("@axe-core/playwright");
const base = process.env.VEILCODE_VERIFY_URL || "http://localhost:3100";
const dir = "docs/redesign/client-pages/verification";
mkdirSync(dir, { recursive: true });
const results = process.env.VEILCODE_VERIFY_RESUME
  ? JSON.parse(readFileSync(join(dir, "results.json"), "utf8"))
  : {
      environment: {
        next: createRequire(import.meta.url)("next/package.json").version,
        node: process.version,
      },
      routes: {},
      errors: [],
      links: {},
      interactions: {},
      noJavaScript: {},
    };
const save = () =>
  writeFileSync(join(dir, "results.json"), JSON.stringify(results, null, 2));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await context.route(/facebook\.com|connect\.facebook\.net/, (r) => r.abort());
  await context.route("**/api/**", (r) =>
    r.request().method() === "GET"
      ? r.continue()
      : r.fulfill({
          status: 503,
          json: { message: "Intercepted by local verification" },
        }),
  );
  const page = await context.newPage();
  await page.addInitScript(() =>
    localStorage.setItem("theme", window.name || "light"),
  );
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(60000);
  page.on("pageerror", (e) => {
    results.errors.push({
      url: page.url(),
      message: e.message,
      stack: e.stack,
    });
    save();
  });
  const xml = await (await context.request.get(base + "/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => p !== "/" && !p.startsWith("/locations"));
  const routes = [
    ...new Set([
      ...paths,
      "/careers",
      "/newsletter/confirmed",
      "/newsletter/expired",
      "/newsletter/invalid",
    ]),
  ];
  const selected = process.env.VEILCODE_VERIFY_ROUTES?.split(",");
  const destinations = new Set();
  const screens = new Set([
    "/about",
    "/services",
    "/work",
    "/blog",
    "/contact",
    "/start",
    "/careers",
    "/seo",
    "/privacy-policy",
    "/newsletter/expired",
  ]);
  for (const prefix of ["/services/", "/work/", "/blog/", "/seo/"]) {
    const p = routes.find((p) => p.startsWith(prefix));
    if (p) screens.add(p);
  }
  for (const path of routes.filter((p) => !selected || selected.includes(p))) {
    const entry = (results.routes[path] = { themes: {}, viewports: {} });
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const theme of ["light", "linen", "midnight", "dark"]) {
      await page.evaluate((t) => {
        window.name = t;
      }, theme);
      const response = await page.goto(base + path, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, path);
      await page.waitForFunction(
        (t) => document.documentElement.classList.contains(t),
        theme,
      );
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      entry.themes[theme] = axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      }));
      save();
    }
    entry.metadata = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: document.querySelector('meta[name="robots"]')?.content,
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent),
      schemas: [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ].map((s) => JSON.parse(s.textContent)),
    }));
    assert.equal(entry.metadata.h1.length, 1, path + " needs one h1");
    if (!path.includes("/newsletter/") && path !== "/careers") {
      assert.ok(
        entry.metadata.title && entry.metadata.description,
        path + " metadata",
      );
      assert.equal(new URL(entry.metadata.canonical).pathname, path);
    } else assert.match(entry.metadata.robots, /noindex/);
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((els) => els.map((a) => a.getAttribute("href"))))
      if (href.startsWith("/") && !href.startsWith("//"))
        destinations.add(href.split("#")[0]);
    for (const [width, height] of [
      [1440, 900],
      [1280, 720],
      [768, 1024],
      [390, 844],
      [320, 740],
    ]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      entry.viewports[width] = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        offenders: [...document.querySelectorAll("body *")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return r.right > innerWidth + 1 || r.left < -1;
          })
          .slice(0, 8)
          .map((e) => ({ tag: e.tagName, class: e.getAttribute("class") })),
        hiddenHeadings: [...document.querySelectorAll("h1,h2")].filter(
          (h) => getComputedStyle(h).opacity === "0",
        ).length,
      }));
    }
    if (screens.has(path)) {
      await page.evaluate(() => {
        window.name = "linen";
      });
      await page.reload({ waitUntil: "networkidle" });
      for (const [width, height] of [
        [1440, 900],
        [390, 844],
      ]) {
        await page.setViewportSize({ width, height });
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
        );
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        const name = path.slice(1).replaceAll("/", "-");
        await page.screenshot({
          path: join(dir, name + "-" + width + "-hero.png"),
        });
        await page.screenshot({
          path: join(dir, name + "-" + width + "-full.png"),
          fullPage: true,
        });
      }
    }
    console.log(
      JSON.stringify({
        path,
        themes: Object.fromEntries(
          Object.entries(entry.themes).map(([t, v]) => [t, v.length]),
        ),
        overflow: Object.entries(entry.viewports)
          .filter(([, v]) => v.overflow)
          .map(([w]) => w),
      }),
    );
    save();
  }
  // Filter controls, keyboard FAQs and mobile navigation; no real writes.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + "/work", { waitUntil: "networkidle" });
  const filter = page.getByRole("group", {
    name: "Filter projects by service",
  });
  const buttons = filter.getByRole("button");
  results.interactions.portfolio = [];
  for (let i = 0; i < (await buttons.count()); i++) {
    await buttons.nth(i).click();
    assert.equal(await buttons.nth(i).getAttribute("aria-pressed"), "true");
    results.interactions.portfolio.push({
      filter: await buttons.nth(i).innerText(),
      count: await page.getByRole("status").first().innerText(),
    });
  }
  await page.goto(base + "/services", { waitUntil: "networkidle" });
  const faq = page.locator("details").first();
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  assert.ok((await faq.getAttribute("open")) !== null);
  results.interactions.nativeFaq = true;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/about", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  assert.equal(
    await page
      .locator('#navbar button[aria-controls="mobile-navigation"]')
      .getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .locator('#navbar button[aria-controls="mobile-navigation"]')
      .getAttribute("aria-expanded"),
    "false",
  );
  results.interactions.mobileMenu = true;
  for (const path of ["/contact", "/start"]) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    const form = page.locator("#form-message form");
    await form.locator('button[type="submit"]').click();
    assert.ok((await form.getByRole("alert").count()) >= 3);
    await form.locator("#name").fill("Verification Only");
    await form.locator("#email").fill("verification@example.com");
    await form.locator("#service-group button").first().click();
    await form
      .locator("#message")
      .fill("Local browser verification. This submission is intercepted.");
    await form.getByRole("button", { name: /Add project details/ }).click();
    assert.ok(await form.locator("#company").isVisible());
    await form.locator('button[type="submit"]').click();
    await page
      .getByText(
        "Something went wrong. Please try again or email us directly at",
      )
      .waitFor();
    await page.route("**/api/messages", (r) =>
      r.fulfill({
        status: 201,
        json: { success: true, message: "Local verification success" },
      }),
    );
    await form.locator('button[type="submit"]').click();
    await page.getByRole("heading", { name: /Message Received/i }).waitFor();
    await page.unroute("**/api/messages");
    results.interactions[path] = {
      validation: true,
      optionalDetails: true,
      error: true,
      success: true,
    };
  }
  await page.goto(base + "/blog", { waitUntil: "networkidle" });
  const news = page.locator("#newsletter");
  await news.locator('input[type="email"]').fill("verification@example.com");
  await page.route("**/api/newsletter", (r) =>
    r.fulfill({ status: 201, json: { success: true } }),
  );
  await news.locator('button[type="submit"]').click();
  await news.getByText("Check your inbox", { exact: true }).waitFor();
  results.interactions.newsletter = true;
  // Every discovered public destination, plus unknown details, retains real HTTP semantics.
  for (const path of destinations) {
    const response = await context.request.get(base + (path || "/"));
    results.links[path || "/"] = response.status();
  }
  for (const path of [
    "/services/not-a-real-service",
    "/work/not-a-real-project",
    "/blog/not-a-real-post",
    "/seo/not-a-real-guide",
    "/not-a-real-page",
  ]) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 404);
    assert.match(
      await page.locator('meta[name="robots"]').getAttribute("content"),
      /noindex/,
    );
    results.links[path] = 404;
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const np = await nojs.newPage();
  for (const path of [...screens].filter((p) => !p.startsWith("/newsletter"))) {
    const response = await np.goto(base + path);
    assert.equal(response.status(), 200);
    assert.equal(await np.locator("h1").count(), 1);
    assert.ok(await np.locator("h1").isVisible());
    results.noJavaScript[path] = true;
    if (path === "/contact" || path === "/start") {
      assert.ok(await np.locator("#form-message fieldset[disabled]").count());
      assert.ok(
        await np
          .locator('noscript a[href="mailto:support@veilcode.studio"]')
          .count(),
      );
    }
    if (path === "/blog" || path.startsWith("/blog/"))
      assert.ok(await np.locator("#newsletter fieldset[disabled]").count());
  }
  await nojs.close();
  save();
  const failures = Object.entries(results.routes).flatMap(([p, r]) => [
    ...Object.entries(r.themes)
      .filter(([, v]) => v.length)
      .map(([t]) => p + " " + t + " accessibility"),
    ...Object.entries(r.viewports)
      .filter(([, v]) => v.overflow || v.hiddenHeadings)
      .map(([w]) => p + " " + w + " layout"),
  ]);
  failures.push(
    ...Object.entries(results.links)
      .filter(([p, s]) => !p.includes("not-a-real") && s >= 400)
      .map(([p, s]) => p + " " + s),
  );
  if (results.errors.length)
    failures.push("Browser runtime errors: " + results.errors.length);
  results.failures = failures;
  save();
  console.log(
    JSON.stringify({
      routes: Object.keys(results.routes).length,
      links: Object.keys(results.links).length,
      failures,
    }),
  );
  if (failures.length) process.exitCode = 1;
} finally {
  save();
  await browser.close();
}
