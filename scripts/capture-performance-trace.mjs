import { createRequire } from "node:module";
import { join } from "node:path";
import { writeFileSync } from "node:fs";

const auditRequire = createRequire(join(process.env.VEILCODE_AUDIT_TOOLS || join(process.env.TEMP, "veilcode-lighthouse-tools"), "package.json"));
const { chromium } = auditRequire("playwright");
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  for (const [label, url] of [["baseline", "http://localhost:3101"], ["after", "http://localhost:3100"]]) {
    const context = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true });
    await context.route(/https:\/\/(?:www\.)?facebook\.com\/tr/, (route) => route.abort());
    await context.route("**/api/chatbot/settings", (route) => route.fulfill({ json: { enabled: true } }));
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    const completed = new Promise((resolve) => cdp.once("Tracing.tracingComplete", resolve));
    await cdp.send("Tracing.start", { categories: "devtools.timeline,v8.execute,blink.user_timing,loading", transferMode: "ReturnAsStream" });
    await page.goto(url, { waitUntil: "networkidle" });
    for (const top of [800, 1800, 3200, 5000, 0]) {
      await page.evaluate((value) => window.scrollTo({ top: value, behavior: "instant" }), top);
      await page.waitForTimeout(150);
    }
    await page.getByRole("button", { name: "Open VeilCode assistant", exact: true }).click();
    await page.getByPlaceholder("Ask about a project or service...").waitFor();
    await page.getByRole("button", { name: "Close chatbot", exact: true }).click();
    await cdp.send("Tracing.end");
    const { stream } = await completed;
    const chunks = [];
    while (true) {
      const chunk = await cdp.send("IO.read", { handle: stream });
      chunks.push(chunk.base64Encoded ? Buffer.from(chunk.data, "base64").toString("utf8") : chunk.data);
      if (chunk.eof) break;
    }
    await cdp.send("IO.close", { handle: stream });
    writeFileSync(`docs/lighthouse/${label}-interaction-performance-trace.json`, chunks.join(""));
    await context.close();
    console.log(`${label}: captured load, scroll, and chatbot open/close; no messages submitted`);
  }
} finally {
  await browser.close();
}
