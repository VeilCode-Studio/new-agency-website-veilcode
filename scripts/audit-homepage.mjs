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
const output = join("docs", "redesign", label);
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
  for (const formFactor of ["mobile", "desktop"]) {
    for (let run = 1; run <= (formFactor === "mobile" ? 3 : 1); run++) {
      const mobile = formFactor === "mobile";
      const { lhr } = await lighthouse(
        process.env.VEILCODE_AUDIT_URL || "http://localhost:3100",
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
        join(output, `${formFactor}-${run}.json`),
        JSON.stringify(lhr),
      );
      const summary = {
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
} finally {
  await chrome.kill();
}
