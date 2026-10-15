import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { writeFileSync } from "node:fs";

const auditRequire = createRequire(join(process.env.VEILCODE_AUDIT_TOOLS || join(process.env.TEMP, "veilcode-lighthouse-tools"), "package.json"));
const { default: lighthouse } = await import(pathToFileURL(auditRequire.resolve("lighthouse")).href);
const chromeLauncher = await import(pathToFileURL(auditRequire.resolve("chrome-launcher")).href);
const targets = [
  ...(process.env.VEILCODE_AUDIT_BASELINE_URL ? [{ label: "baseline-local", url: process.env.VEILCODE_AUDIT_BASELINE_URL }] : []),
  { label: "after-local", url: process.env.VEILCODE_AUDIT_URL || "http://localhost:3100" },
];
const chrome = await chromeLauncher.launch({ chromePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", chromeFlags: ["--headless", "--no-first-run", "--disable-extensions"] });
const runs = [];
try {
  for (let round = 1; round <= 3; round++) {
    for (const target of targets) {
      const { lhr } = await lighthouse(target.url, { port: chrome.port, output: "json", logLevel: "error" }, {
        extends: "lighthouse:default",
        settings: {
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
          // Download the original scripts for measurement without sending test PageViews.
          blockedUrlPatterns: ["*facebook.com/tr*"],
          formFactor: "mobile", throttlingMethod: "simulate",
          screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
          throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
        },
      });
      writeFileSync(`docs/lighthouse/${target.label}-run-${round}.json`, JSON.stringify(lhr));
      const result = {
        label: target.label, round, version: lhr.lighthouseVersion,
        scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, value.score * 100])),
        metrics: Object.fromEntries(["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index", "total-byte-weight"].map((id) => [id, lhr.audits[id]?.numericValue])),
        warnings: lhr.runWarnings, error: lhr.runtimeError,
      };
      runs.push(result);
      console.log(JSON.stringify(result));
      writeFileSync("docs/lighthouse/local-comparison.json", JSON.stringify(runs, null, 2));
    }
  }
} finally {
  await chrome.kill();
}
