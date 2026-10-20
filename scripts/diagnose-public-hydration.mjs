import { createRequire } from "node:module";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
const req = createRequire(
  join(process.env.TEMP, "veilcode-lighthouse-tools/package.json"),
);
const { chromium } = req("playwright");
const b = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const p = await b.newPage();
const base = process.env.VEILCODE_DIAGNOSTIC_URL || "http://localhost:3000";
const records = [];
const attempts = [];
const save = () =>
  writeFileSync(
    "docs/redesign/client-pages/verification/hydration-development.json",
    JSON.stringify({ attempts, errors: records }, null, 2),
  );
p.on("console", (m) => {
  if (
    m.type() === "error" &&
    /hydration|hydrate|server rendered/i.test(m.text())
  ) {
    records.push({ url: p.url(), type: "console", message: m.text() });
    save();
  }
});
p.on("pageerror", async (e) => {
  records.push({
    url: p.url(),
    type: "runtime",
    message: e.message,
    stack: e.stack,
  });
  if (/hydration/i.test(e.message))
    records.at(-1).domMutations = await p.evaluate(
      () => window.__reviewMutations,
    );
  save();
});
await p.addInitScript(() => {
  window.__reviewMutations = [];
  new MutationObserver((records) => {
    for (const r of records)
      if (r.target.nodeName === "ASIDE")
        window.__reviewMutations.push({
          html: r.target.outerHTML,
          added: [...r.addedNodes].map((n) => n.nodeName),
          removed: [...r.removedNodes].map((n) => n.nodeName),
        });
  }).observe(document, { childList: true, subtree: true });
  localStorage.setItem("theme", window.name || "light");
});
await p.route("**/_next/image*", (r) => r.abort());
try {
  for (let i = 0; i < 120; i++) {
    await p.evaluate(
      (t) => (window.name = t),
      ["light", "linen", "midnight", "dark"][i % 4],
    );
    const path = [
      "/services/ai-automation",
      "/work/dreamhomes-property-management-solution",
      "/work/cartix-ecommerce-platform",
      "/locations/uganda",
    ][Math.floor(i / 4) % 4];
    const response = await p.goto(base + path, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    attempts.push({ run: i, path, status: response.status() });
    save();
    console.log(
      JSON.stringify({
        run: i,
        path,
        status: response.status(),
        hydration: records.filter(
          (r) =>
            r.message.includes("hydration") || r.message.includes("Hydration"),
        ).length,
      }),
    );
    if (response.status() >= 500) break;
    if (
      records.some(
        (r) =>
          r.message.includes("hydration") || r.message.includes("Hydration"),
      )
    )
      break;
  }
} finally {
  save();
  await b.close();
}
