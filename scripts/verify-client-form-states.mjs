import { createRequire } from "node:module";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const req = createRequire(
  join(process.env.TEMP, "veilcode-lighthouse-tools/package.json"),
);
const { chromium } = req("playwright");
const { default: AxeBuilder } = req("@axe-core/playwright");
const base = process.env.VEILCODE_VERIFY_URL || "http://localhost:3100";
const output = "docs/redesign/client-pages/verification/form-states.json";
const results = { states: {}, navigation: {}, errors: [] };
const save = () => writeFileSync(output, JSON.stringify(results, null, 2));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await c.route(/facebook\.com|connect\.facebook\.net/, (r) => r.abort());
  await c.route("**/api/**", (r) =>
    r.request().method() === "GET"
      ? r.continue()
      : r.fulfill({
          status: 503,
          json: { message: "Intercepted local verification" },
        }),
  );
  const p = await c.newPage();
  p.setDefaultTimeout(20000);
  p.setDefaultNavigationTimeout(60000);
  await p.addInitScript(() =>
    localStorage.setItem("theme", window.name || "light"),
  );
  p.on("pageerror", (e) =>
    results.errors.push({ url: p.url(), message: e.message, stack: e.stack }),
  );
  const axe = async (name) => {
    const r = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    results.states[name] = r.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    }));
    save();
  };
  let release;
  await p.route("**/api/messages", async (r) => {
    await new Promise((resolve) => (release = resolve));
    await r.fulfill({
      status: 201,
      json: { success: true, message: "Local verification" },
    });
  });
  await p.route("**/api/newsletter", (r) =>
    r.fulfill({ status: 201, json: { success: true } }),
  );
  for (const theme of ["light", "linen", "midnight", "dark"]) {
    await p.evaluate((t) => (window.name = t), theme);
    await p.goto(base + "/contact", { waitUntil: "networkidle" });
    const form = p.locator("#form-message form");
    await form.locator('button[type="submit"]').click();
    await p.locator("#form-message").scrollIntoViewIfNeeded();
    await axe(theme + "-enquiry-validation");
    await form.locator("#name").fill("Verification Only");
    await form.locator("#email").fill("verification@example.com");
    await form.locator("#service-group button").first().click();
    await form
      .locator("#message")
      .fill("Local browser verification. No real message will be sent.");
    await form.getByRole("button", { name: /Add project details/ }).click();
    await axe(theme + "-enquiry-details");
    await form.locator('button[type="submit"]').click();
    await p.waitForFunction(
      () =>
        document
          .querySelector("#form-message form")
          ?.getAttribute("aria-busy") === "true",
    );
    assert.ok(await form.locator('button[type="submit"]').isDisabled());
    await p.waitForFunction(
      () => document.querySelector("#form-message fieldset")?.disabled,
    );
    while (!release) await p.waitForTimeout(20);
    release();
    release = undefined;
    await p.locator('#form-message [role="status"]').waitFor();
    await axe(theme + "-enquiry-success");
    await p.goto(base + "/blog", { waitUntil: "networkidle" });
    const news = p.locator("#newsletter");
    await news.scrollIntoViewIfNeeded();
    await news.locator('button[type="submit"]').click();
    await news.getByRole("alert").waitFor();
    await axe(theme + "-newsletter-validation");
    await news.locator('input[type="email"]').fill("verification@example.com");
    await news.locator('button[type="submit"]').click();
    await news.getByRole("status").waitFor();
    await axe(theme + "-newsletter-success");
  }
  const documents = [];
  p.on("request", (r) => {
    if (r.resourceType() === "document") documents.push(r.url());
  });
  await p.goto(base + "/work", { waitUntil: "networkidle" });
  let before = documents.length;
  await p.locator(".public-project-copy h2 a").first().click();
  await p.waitForURL((u) => u.pathname.startsWith("/work/"));
  await p.locator("h1").waitFor();
  assert.equal(documents.length, before);
  results.navigation.projectUsesClientNavigation = true;
  before = documents.length;
  await p.locator('footer a[href="/about"]').click();
  await p.waitForURL((u) => u.pathname === "/about");
  assert.equal(documents.length, before);
  results.navigation.footerUsesClientNavigation = true;
  await p.setViewportSize({ width: 390, height: 844 });
  await p.getByRole("button", { name: "Open menu", exact: true }).click();
  before = documents.length;
  await p.locator('#mobile-navigation a[href="/services"]').click();
  await p.waitForURL((u) => u.pathname === "/services");
  assert.equal(documents.length, before);
  assert.equal(
    await p
      .locator('#navbar button[aria-controls="mobile-navigation"]')
      .getAttribute("aria-expanded"),
    "false",
  );
  results.navigation.mobileMenuUsesClientNavigation = true;
  save();
  const bad = Object.entries(results.states).filter(([, v]) => v.length);
  assert.equal(bad.length, 0, JSON.stringify(bad));
  assert.equal(results.errors.length, 0);
  console.log(
    JSON.stringify({
      states: Object.keys(results.states).length,
      navigation: results.navigation,
      errors: results.errors,
    }),
  );
} finally {
  save();
  await browser.close();
}
