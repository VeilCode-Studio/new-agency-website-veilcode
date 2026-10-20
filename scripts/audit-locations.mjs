import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";

const auditRequire = createRequire(
  join(
    process.env.VEILCODE_AUDIT_TOOLS ||
      join(process.env.TEMP, "veilcode-lighthouse-tools"),
    "package.json",
  ),
);
const { default: lighthouse } = await import(
  pathToFileURL(auditRequire.resolve("lighthouse")).href
);
const { launch } = await import(
  pathToFileURL(auditRequire.resolve("chrome-launcher")).href
);
const label = process.argv[2] || "homepage";
if (!/^[a-z0-9-]+$/.test(label)) throw new Error("Use a simple audit label.");
const output = join("docs", "redesign", "locations", label);
mkdirSync(output, { recursive: true });
const chrome = await launch({
  chromePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  chromeFlags: [
    "--headless",
    "--no-first-run",
    "--disable-extensions",
    "--no-sandbox",
  ],
});
const results = [];
try {
  for (const country of (
    process.env.VEILCODE_AUDIT_COUNTRIES ||
    "uganda,united-states,united-kingdom,canada,australia"
  ).split(",")) {
    for (const formFactor of ["mobile", "desktop"]) {
      for (let run = 1; run <= (formFactor === "mobile" ? 3 : 1); run++) {
        const mobile = formFactor === "mobile";
        const { lhr } = await lighthouse(
          `${process.env.VEILCODE_AUDIT_URL || "http://localhost:3100"}/locations/${country}`,
          { port: chrome.port, output: "json", logLevel: "error" },
          {
            extends: "lighthouse:default",
            settings: {
              onlyCategories: [
                "performance",
                "accessibility",
                "best-practices",
                "seo",
              ],
              blockedUrlPatterns: ["*facebook.com/tr*"],
              formFactor,
              throttlingMethod: "simulate",
              screenEmulation: {
                mobile,
                width: mobile ? 412 : 1440,
                height: mobile ? 823 : 900,
                deviceScaleFactor: mobile ? 1.75 : 1,
                disabled: false,
              },
              throttling: {
                rttMs: mobile ? 150 : 40,
                throughputKbps: mobile ? 1638.4 : 10240,
                cpuSlowdownMultiplier: mobile ? 4 : 1,
              },
            },
          },
        );
        writeFileSync(
          join(output, `${country}-${formFactor}-${run}.json`),
          JSON.stringify(lhr),
        );
        const summary = {
          country,
          formFactor,
          run,
          fetched: lhr.fetchTime,
          scores: Object.fromEntries(
            Object.entries(lhr.categories).map(([key, value]) => [
              key,
              Math.round(value.score * 100),
            ]),
          ),
          metrics: Object.fromEntries(
            [
              "first-contentful-paint",
              "largest-contentful-paint",
              "total-blocking-time",
              "cumulative-layout-shift",
              "speed-index",
              "total-byte-weight",
            ].map((key) => [key, lhr.audits[key]?.numericValue]),
          ),
          failed: Object.values(lhr.audits)
            .filter(
              (audit) =>
                audit.score !== null &&
                audit.score < 1 &&
                audit.scoreDisplayMode === "binary",
            )
            .map(({ id, title }) => ({ id, title })),
          warnings: lhr.runWarnings,
          error: lhr.runtimeError,
        };
        results.push(summary);
        writeFileSync(
          join(output, "summary.json"),
          JSON.stringify(results, null, 2),
        );
        console.log(JSON.stringify(summary));
      }
    }
  }
  const median = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const budgets = [];
  for (const country of [...new Set(results.map((r) => r.country))]) {
    const mobile = results.filter(
      (r) => r.country === country && r.formFactor === "mobile",
    );
    const desktop = results.find(
      (r) => r.country === country && r.formFactor === "desktop",
    );
    const metrics = {
      performance: median(mobile.map((r) => r.scores.performance)),
      lcp: median(mobile.map((r) => r.metrics["largest-contentful-paint"])),
      tbt: median(mobile.map((r) => r.metrics["total-blocking-time"])),
      cls: Math.max(...mobile.map((r) => r.metrics["cumulative-layout-shift"])),
    };
    const failures = [];
    if (mobile.length !== 3 || !desktop) failures.push("Missing required runs");
    if (metrics.performance < 90) failures.push("Mobile performance below 90");
    if (metrics.lcp > 2500) failures.push("Mobile LCP exceeds 2.5 seconds");
    if (metrics.tbt > 200) failures.push("Mobile TBT exceeds 200ms");
    if (metrics.cls > 0.1) failures.push("Mobile CLS exceeds 0.1");
    if (desktop?.scores.performance < 95)
      failures.push("Desktop performance below 95");
    for (const r of [...mobile, desktop].filter(Boolean)) {
      for (const key of ["accessibility", "best-practices", "seo"])
        if (r.scores[key] !== 100)
          failures.push(`${r.formFactor} ${r.run} ${key} below 100`);
      if (r.error) failures.push(`${r.formFactor} ${r.run} runtime error`);
    }
    budgets.push({
      country,
      mobile: metrics,
      desktop: desktop?.scores,
      failures,
      passed: failures.length === 0,
    });
  }
  writeFileSync(join(output, "budgets.json"), JSON.stringify(budgets, null, 2));
  if (budgets.some((b) => !b.passed)) process.exitCode = 1;
  console.log(JSON.stringify({ budgets }));
} finally {
  await chrome.kill();
}
