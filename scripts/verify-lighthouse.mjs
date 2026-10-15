import { createRequire } from "node:module";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";

// Audit-only dependencies live outside the application dependency tree.
const auditRequire = createRequire(join(process.env.VEILCODE_AUDIT_TOOLS || join(process.env.TEMP, "veilcode-lighthouse-tools"), "package.json"));
const { chromium } = auditRequire("playwright");
const { default: AxeBuilder } = auditRequire("@axe-core/playwright");
const base = process.env.VEILCODE_AUDIT_URL || "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const results = { base, date: new Date().toISOString(), themes: {}, routes: [], errors: [], network: {} };

try {
  const context = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  page.on("pageerror", (error) => results.errors.push(error.message));
  // Stable local settings response prevents chatbot tests changing remote state.
  await context.route("**/api/chatbot/settings", (route) => route.fulfill({ json: { enabled: true } }));
  await page.goto(base, { waitUntil: "networkidle" });
  assert.match(await page.locator("p.font-sans").first().evaluate((el) => getComputedStyle(el).fontFamily), /ui-sans-serif/);
  assert.match(await page.locator(".font-mono").first().evaluate((el) => getComputedStyle(el).fontFamily), /ui-monospace/);
  assert.equal(await page.locator("main").count(), 1);
  assert.equal(await page.locator("button a, a button").count(), 0);
  assert.equal(await page.getByRole("link", { name: "Back to top", exact: true }).count(), 1);
  assert.equal(requests.filter((url) => /facebook\.com|connect\.facebook\.net/.test(url)).length, 0);
  const beforeChat = requests.filter((url) => url.includes("/_next/static/") && url.includes(".js"));
  for (const theme of ["light", "dark", "midnight", "linen"]) {
    await page.evaluate((value) => { document.documentElement.className = value; document.documentElement.style.colorScheme = /dark|midnight/.test(value) ? "dark" : "light"; }, theme);
    await page.waitForTimeout(250);
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    results.themes[theme] = audit.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }));
  }
  await page.evaluate(() => { document.documentElement.className = "midnight"; });
  const beforeOpen = new Set(requests);
  await page.route("**/_next/static/**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await route.continue();
  });
  await page.getByRole("button", { name: "Open VeilCode assistant", exact: true }).click();
  await page.getByText("Loading assistant…", { exact: true }).waitFor();
  await page.getByRole("textbox", { name: "Your message", exact: true }).waitFor();
  await page.unroute("**/_next/static/**/*.js");
  results.slowPanel = "Accessible loading feedback shown during a delayed panel download";
  assert.equal(await page.getByRole("textbox", { name: "Your message", exact: true }).evaluate((el) => document.activeElement === el), true);
  await page.getByRole("textbox", { name: "Your message", exact: true }).fill("Unsaved local test draft");
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Open VeilCode assistant", exact: true }).evaluate((el) => document.activeElement === el), true);
  await page.getByRole("button", { name: "Open VeilCode assistant", exact: true }).click();
  assert.equal(await page.getByRole("textbox", { name: "Your message", exact: true }).inputValue(), "Unsaved local test draft");
  await page.keyboard.press("Escape");
  results.network = { initialScriptCount: beforeChat.length, newScriptsOnChatOpen: requests.filter((url) => !beforeOpen.has(url) && url.includes("/_next/static/") && url.includes(".js")), facebookRequests: requests.filter((url) => /facebook\.com|connect\.facebook\.net/.test(url)) };
  assert.ok(results.network.newScriptsOnChatOpen.length > 0, "Chat panel should fetch a separate chunk on activation");
  await page.getByRole("link", { name: "See our work", exact: true }).click();
  await page.waitForURL(base + "/work");
  await page.getByRole("button", { name: "Open VeilCode assistant", exact: true }).click();
  assert.equal(await page.getByRole("textbox", { name: "Your message", exact: true }).inputValue(), "Unsaved local test draft");
  await page.keyboard.press("Escape");
  await page.locator('header a[href="/"]').first().click();
  await page.waitForURL(base + "/");
  await page.getByRole("link", { name: "Start a Project", exact: true }).first().click();
  await page.waitForURL(base + "/start");
  assert.equal(await page.getByRole("button", { name: "Open VeilCode assistant", exact: true }).count(), 0);
  await page.goBack();
  await page.waitForURL(base + "/");
  await page.getByRole("button", { name: "Open VeilCode assistant", exact: true }).click();
  assert.equal(await page.getByRole("textbox", { name: "Your message", exact: true }).inputValue(), "Unsaved local test draft");
  await page.keyboard.press("Escape");
  results.clientNavigation = "Chat draft survives static/animated navigation and hidden project-form routes";
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("dialog", { name: "Mobile navigation", exact: true }).waitFor();
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    assert.equal(await page.getByRole("dialog", { name: "Mobile navigation", exact: true }).evaluate((el) => el.contains(document.activeElement)), true);
  }
  await page.keyboard.press("Escape");
  await page.getByRole("dialog", { name: "Mobile navigation", exact: true }).waitFor({ state: "hidden" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  results.reducedMotionActiveAnimations = await page.locator("[data-ambient]").evaluateAll((nodes) => nodes.flatMap((node) => node.getAnimations({ subtree: true })).filter((animation) => animation.playState === "running" && animation.effect.getComputedTiming().duration > 1).length);
  assert.equal(results.reducedMotionActiveAnimations, 0);
  const pageHeight = await page.locator("body").evaluate((el) => el.scrollHeight);
  for (let top = 0; top < pageHeight; top += 700) {
    await page.evaluate((value) => window.scrollTo({ top: value, behavior: "instant" }), top);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
  await page.getByRole("link", { name: "Back to top", exact: true }).click();
  await page.waitForFunction(() => window.scrollY <= 1);
  results.backToTop = "Native anchor scrolls to the page top without route prefetching";
  await page.screenshot({ path: "docs/lighthouse/after-home-mobile.png", fullPage: true, scale: "css" });
  await page.screenshot({ path: "docs/lighthouse/after-hero-mobile.png", scale: "css" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "docs/lighthouse/after-home-desktop.png", fullPage: true });
  const detailLinks = await page.locator('a[href^="/work/"], a[href^="/blog/"], a[href^="/services/"]').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.getAttribute("href")))].slice(0, 9));
  for (const path of [...new Set(["/services", "/work", "/blog", "/about", "/careers", "/contact", "/start", "/locations/uganda", "/privacy-policy", "/not-a-real-page", "/work/not-a-real-project", ...detailLinks])]) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    const nestedControls = await page.locator("button a, a button").count();
    results.routes.push({ path, status: response.status(), h1: await page.locator("h1").first().textContent(), nestedControls });
    assert.equal(nestedControls, 0, path);
    assert.equal(await page.locator("main").count(), 1, `${path} main landmark`);
    assert.equal(response.status(), path.includes("not-a-real") ? 404 : 200, path);
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 412, height: 823 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base);
  assert.equal(await staticPage.locator("h1").isVisible(), true);
  assert.ok(await staticPage.locator("#services a").count() > 0);
  assert.equal(await staticPage.locator("button a").count(), 0);
  results.noJavaScript = "Homepage heading, service links and CTAs remain present";
  const fallbackUrl = base + "/services";
  const initialHtml = await (await context.request.get(fallbackUrl)).text();
  const initialScripts = new Set([...initialHtml.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => new URL(match[1].replaceAll("&amp;", "&"), base).pathname));
  let blockedFeatures = 0;
  const noMotion = await browser.newContext({ viewport: { width: 412, height: 823 } });
  await noMotion.route("**/_next/static/**/*.js", async (route) => {
    // Initial scripts are server-discovered. Optional features load separately.
    if (!initialScripts.has(new URL(route.request().url()).pathname)) {
      blockedFeatures++;
      return route.abort();
    }
    return route.continue();
  });
  const delayedPage = await noMotion.newPage();
  await delayedPage.goto(fallbackUrl, { waitUntil: "networkidle" });
  results.deferredFeaturesFallback = { headingVisible: await delayedPage.locator("h1").isVisible(), serviceHeadingVisible: await delayedPage.locator("h2").first().isVisible() };
  assert.equal(results.deferredFeaturesFallback.headingVisible, true);
  assert.equal(results.deferredFeaturesFallback.serviceHeadingVisible, true);
  assert.ok(blockedFeatures > 0, "The deferred feature failure must actually be exercised");
  results.deferredFeaturesFallback.blockedChunks = blockedFeatures;
  await delayedPage.getByRole("button", { name: "Open menu", exact: true }).click();
  await delayedPage.locator("[data-motion-failed]").waitFor({ state: "attached" });
  const fallbackMenu = delayedPage.getByRole("dialog", { name: "Mobile navigation", exact: true });
  await fallbackMenu.evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {}))));
  assert.equal(await fallbackMenu.evaluate((el) => getComputedStyle(el).opacity), "1");
  assert.ok((await fallbackMenu.boundingBox()).x >= 0, "The fallback menu must be on screen");
  results.deferredFeaturesFallback.menuUsable = true;
  const disabledContext = await browser.newContext({ viewport: { width: 412, height: 823 } });
  await disabledContext.route("**/api/chatbot/settings", (route) => route.fulfill({ json: { enabled: false } }));
  const disabledPage = await disabledContext.newPage();
  const disabledRequests = [];
  disabledPage.on("request", (request) => disabledRequests.push(request.url()));
  await disabledPage.goto(base, { waitUntil: "networkidle" });
  assert.equal(await disabledPage.getByRole("button", { name: "Open VeilCode assistant", exact: true }).count(), 0);
  assert.equal(disabledRequests.some((url) => results.network.newScriptsOnChatOpen.includes(url)), false);
  results.disabledChatbot = "No launcher or panel chunk";
  const failedChatContext = await browser.newContext({ viewport: { width: 412, height: 823 } });
  await failedChatContext.route("**/api/chatbot/settings", (route) => route.fulfill({ json: { enabled: true } }));
  await failedChatContext.route("**/_next/static/**/*.js", (route) => results.network.newScriptsOnChatOpen.includes(route.request().url()) ? route.abort() : route.continue());
  const failedChatPage = await failedChatContext.newPage();
  await failedChatPage.goto(base, { waitUntil: "networkidle" });
  await failedChatPage.getByRole("button", { name: "Open VeilCode assistant", exact: true }).click();
  const failedChatAlert = failedChatPage.getByRole("alert").filter({ hasText: "The assistant could not load." });
  await failedChatAlert.waitFor();
  await failedChatPage.getByRole("button", { name: "Hide VeilCode assistant", exact: true }).click();
  await failedChatAlert.waitFor({ state: "hidden" });
  results.failedChatbot = "Failed panel download offers the project form and can be dismissed";
  // Only intercepted requests are submitted; no subscription email is sent.
  await page.goto(base, { waitUntil: "networkidle" });
  await page.route("**/api/newsletter", (route) => route.fulfill({ status: 409, json: { message: "Already subscribed!" } }));
  await page.locator("#newsletter input[type=email]").fill("audit@example.com");
  await page.locator("#newsletter button[type=submit]").click();
  await page.locator("#newsletter").getByText("This email is subscribed!", { exact: true }).waitFor();
  await page.unroute("**/api/newsletter");
  await page.route("**/api/newsletter", (route) => route.fulfill({ status: 201, json: { success: true } }));
  await page.locator("#newsletter button[type=submit]").click();
  await page.locator("#newsletter form").waitFor({ state: "hidden" });
  results.newsletter = "Mocked duplicate and success responses; optional HTTP client loads on submission";
  for (let i = 0; i < 3; i++) {
    const response = await context.request.get(base + "/robots.txt");
    assert.equal(response.status(), 200);
    assert.match(response.headers()["content-type"], /text\/plain/);
    assert.match(await response.text(), /Sitemap:/);
  }
  results.robots = "Three complete 200 text/plain responses";
  assert.deepEqual(results.errors, []);
  for (const [theme, violations] of Object.entries(results.themes)) assert.deepEqual(violations, [], `${theme} accessibility`);
  await context.tracing.stop({ path: "docs/lighthouse/browser-trace.zip" });
} catch (error) {
  results.failure = error.stack;
  process.exitCode = 1;
} finally {
  writeFileSync("docs/lighthouse/browser-verification.json", JSON.stringify(results, null, 2));
  await browser.close();
  console.log(JSON.stringify({ ...results, themes: Object.fromEntries(Object.entries(results.themes).map(([theme, issues]) => [theme, issues.map((issue) => `${issue.id}: ${issue.nodes.length}`)])) }, null, 2));
}
