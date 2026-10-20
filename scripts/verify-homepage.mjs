import { createRequire } from "node:module";
import { join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

// Optional audit dependencies live outside the application, as in the existing
// Lighthouse workflow. Every form/chat write is intercepted before navigation.
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
const output = "docs/redesign/verification";
mkdirSync(output, { recursive: true });
const results = { themes: {}, viewports: {}, forms: {}, links: {}, errors: [] };
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await context.route(/facebook\.com|connect\.facebook\.net/, (route) =>
    route.abort(),
  );
  await context.route("**/api/chatbot/settings", (route) =>
    route.fulfill({ json: { enabled: true } }),
  );
  await context.route("**/api/chatbot/messages", (route) =>
    route.fulfill({
      status: 503,
      json: { message: "Intercepted by local verification" },
    }),
  );
  await context.route("**/api/newsletter", (route) =>
    route.fulfill({ status: 409, json: { message: "Already subscribed!" } }),
  );
  let formResponse = 500;
  const submissions = [];
  let releaseSubmission;
  let holdSubmission = false;
  await context.route("**/api/messages", async (route) => {
    submissions.push(route.request().postDataJSON());
    if (holdSubmission)
      await new Promise((resolve) => {
        releaseSubmission = resolve;
      });
    await route.fulfill({
      status: formResponse,
      json: { success: formResponse === 201 },
    });
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => results.errors.push(error.message));
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  const response = await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  if (base.includes(":3100"))
    assert.match(response.headers()["cache-control"], /s-maxage=300/);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("main").count(), 1);
  assert.equal(await page.locator("button a, a button").count(), 0);
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    "https://www.veilcode.studio",
  );
  assert.ok(await page.locator('script[type="application/ld+json"]').count());
  results.cache = response.headers()["cache-control"];
  results.images = await page.locator(".homepage img").evaluateAll((images) =>
    images.map((image) => ({
      src: image.currentSrc || image.getAttribute("src"),
      loading: image.loading,
      priority: image.fetchPriority,
      sizes: image.sizes,
    })),
  );
  assert.equal(
    results.images.filter((image) => image.priority === "high").length,
    1,
  );
  assert.ok(
    results.images.filter((image) => image.loading === "lazy").length >= 6,
  );

  // Audit the real selector, persistence, and all supported theme tokens.
  for (const theme of ["light", "linen", "midnight", "dark"]) {
    if (theme === "dark") {
      await page.evaluate(() => localStorage.setItem("theme", "dark"));
      await page.reload({ waitUntil: "networkidle" });
    } else {
      await page
        .getByRole("button", { name: "Choose theme", exact: true })
        .click();
      await page
        .getByRole("menuitemradio", {
          name: new RegExp(`^${theme[0].toUpperCase()}${theme.slice(1)}`),
        })
        .click();
    }
    assert.equal(
      await page.evaluate(() => localStorage.getItem("theme")),
      theme,
    );
    assert.ok(
      await page
        .locator("html")
        .evaluate((element, value) => element.classList.contains(value), theme),
    );
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    results.themes[theme] = audit.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    }));
    await page.screenshot({ path: `${output}/desktop-${theme}.png` });
  }
  await page.getByRole("button", { name: "Choose theme", exact: true }).click();
  await page.getByRole("menuitemradio", { name: /^Linen/ }).click();
  for (const section of [
    "home-process",
    "home-portfolio",
    "home-pricing",
    "home-questions",
  ]) {
    await page
      .locator(`.${section}`)
      .screenshot({ path: `${output}/${section}-linen.png` });
  }

  const track = page.locator(".home-gallery-track");
  const initialScroll = await track.evaluate((element) => element.scrollLeft);
  await page
    .getByRole("button", { name: "Next featured projects", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector(".home-gallery-track").scrollLeft > 100,
  );
  assert.ok(
    (await track.evaluate((element) => element.scrollLeft)) > initialScroll,
  );
  await page
    .getByRole("button", { name: "Previous featured projects", exact: true })
    .click();
  results.gallery =
    "Native scroll-snap gallery controls move the server-rendered slides.";

  const question = page.locator(".home-faq details").first();
  await question.locator("summary").press("Enter");
  assert.equal(await question.getAttribute("open"), "");
  await question.locator("summary").press("Enter");
  assert.equal(await question.getAttribute("open"), null);
  results.faq = "Native disclosures open and close from the keyboard.";

  const form = page.locator(".home-contact-panel form");
  await form.locator('[name="name"]').fill("Local Verification");
  await form.locator('[name="email"]').fill("local-verification@example.com");
  await form.locator('[name="service"]').selectOption("AI Automation");
  await form.locator('[name="budget"]').selectOption("$1,500 – $5,000");
  await form
    .locator('[name="message"]')
    .fill(
      "This is a locally intercepted test of the redesigned homepage form.",
    );
  await form.getByRole("button", { name: "Send Message", exact: true }).click();
  await form.getByRole("alert").waitFor();
  assert.equal(
    await form.locator('[name="name"]').inputValue(),
    "Local Verification",
  );
  results.forms.failure =
    "An intercepted 500 shows an error and preserves the draft.";
  formResponse = 201;
  holdSubmission = true;
  await form.getByRole("button", { name: "Send Message", exact: true }).click();
  await form
    .getByRole("button", { name: "Sending your message…", exact: true })
    .waitFor();
  assert.equal(
    await form
      .getByRole("button", { name: "Sending your message…", exact: true })
      .isDisabled(),
    true,
  );
  while (!releaseSubmission)
    await new Promise((resolve) => setTimeout(resolve, 10));
  releaseSubmission();
  await page
    .getByRole("heading", { name: "Message received.", exact: true })
    .waitFor();
  assert.equal(submissions.length, 2);
  assert.equal(submissions[1].budget, "$1,500 – $5,000");
  assert.equal(
    await page
      .locator(".home-form-success")
      .evaluate((element) => document.activeElement === element),
    true,
  );
  await page
    .getByRole("button", { name: "Send another message", exact: true })
    .click();
  assert.equal(await form.locator('[name="name"]').inputValue(), "");
  results.forms.success =
    "An intercepted 201 shows confirmation, resets fields, and moves focus; duplicate submission is disabled while pending.";

  const beforeChat = new Set(requests);
  await page
    .getByRole("button", { name: "Open VeilCode assistant", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Your message", exact: true })
    .waitFor();
  assert.ok(
    requests.some(
      (url) =>
        !beforeChat.has(url) &&
        url.includes("/_next/static/") &&
        url.includes(".js"),
    ),
  );
  await page
    .getByRole("textbox", { name: "Your message", exact: true })
    .fill("Local unsent draft");
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "See our work", exact: true }).click();
  await page.waitForURL(base + "/work");
  assert.equal(await page.locator(".home-navigation").count(), 0);
  await page
    .getByRole("button", { name: "Open VeilCode assistant", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("textbox", { name: "Your message", exact: true })
      .inputValue(),
    "Local unsent draft",
  );
  await page.keyboard.press("Escape");
  results.chat =
    "Panel downloads on activation, and the unsent draft persists when navigating to /work. No chat messages sent.";
  await page.goto(base, { waitUntil: "networkidle" });
  const destinations = [
    ...new Set(
      await page
        .locator('a[href^="/"]')
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute("href").split("#")[0]),
        ),
    ),
  ];
  for (const destination of destinations) {
    const linkResponse = await context.request.get(base + destination);
    results.links[destination] = linkResponse.status();
    assert.equal(linkResponse.status(), 200, destination);
  }
  const hashTargets = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((link) => ({
      href: link.getAttribute("href"),
      exists: Boolean(
        document.getElementById(link.getAttribute("href").slice(1)),
      ),
    })),
  );
  assert.ok(hashTargets.every((target) => target.exists));
  results.hashTargets = hashTargets;
  const anchorPage = await context.newPage();
  await anchorPage.goto(base, { waitUntil: "networkidle" });
  await anchorPage.locator('header a[href="#contact"]').click();
  await anchorPage.waitForFunction(() => {
    const top = document.getElementById("contact").getBoundingClientRect().top;
    return top >= 65 && top <= 160;
  });
  results.coldAnchor =
    "A direct contact anchor lands below the fixed header before the long page has been scrolled.";
  await anchorPage.close();

  for (const [width, height] of [
    [1440, 900],
    [1280, 720],
    [768, 1024],
    [390, 844],
    [320, 740],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      ctaBottom: document
        .querySelector(".home-hero-actions")
        .getBoundingClientRect().bottom,
    }));
    assert.ok(dimensions.scroll <= dimensions.client, `Overflow at ${width}`);
    assert.ok(
      dimensions.ctaBottom <= height,
      `Hero actions below viewport at ${width} × ${height}`,
    );
    results.viewports[`${width}x${height}`] = dimensions;
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("dialog", { name: "Mobile navigation" }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .evaluate((element) => document.activeElement === element),
    true,
  );
  results.mobileMenu = "Mobile menu opens and Escape restores focus.";
  const mobileAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  results.mobileAccessibility = mobileAudit.violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map(({ target }) => target),
  }));
  await page.screenshot({ path: `${output}/mobile-linen.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".home-button")
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
    "0s",
  );
  results.reducedMotion = "Homepage transitions respect reduced motion.";
  await context.close();

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(base, { waitUntil: "domcontentloaded" });
  assert.ok(await noJsPage.locator("h1").isVisible());
  assert.ok(await noJsPage.locator(".home-hero-actions").isVisible());
  await noJsPage.locator(".home-faq summary").first().click();
  assert.equal(
    await noJsPage.locator(".home-faq details").first().getAttribute("open"),
    "",
  );
  assert.equal(
    await noJsPage
      .getByRole("button", { name: "Send Message", exact: true })
      .isDisabled(),
    true,
  );
  assert.ok(
    await noJsPage
      .locator("noscript")
      .getByRole("link", { name: "email frank@veilcode.studio", exact: true })
      .count(),
  );
  results.noJavaScript =
    "Server content and FAQs remain usable; form submission is disabled and a direct email fallback is present.";
  await noJs.close();
  assert.deepEqual(results.errors, []);
  for (const [theme, issues] of Object.entries(results.themes))
    assert.deepEqual(issues, [], `${theme} accessibility`);
  assert.deepEqual(results.mobileAccessibility, []);
} catch (error) {
  results.failure = error.stack;
  process.exitCode = 1;
} finally {
  writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(
    JSON.stringify(
      {
        passed: !results.failure,
        themes: Object.fromEntries(
          Object.entries(results.themes).map(([theme, issues]) => [
            theme,
            issues.length,
          ]),
        ),
        viewports: Object.keys(results.viewports),
        destinationsChecked: Object.keys(results.links).length,
        forms: results.forms,
        cache: results.cache,
        pageErrors: results.errors,
        failure: results.failure,
      },
      null,
      2,
    ),
  );
  await browser.close();
}
