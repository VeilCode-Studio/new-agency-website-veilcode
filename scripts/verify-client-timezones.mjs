import { createRequire } from "node:module";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const req = createRequire(
  join(process.env.TEMP, "veilcode-lighthouse-tools/package.json"),
);
const { chromium } = req("playwright");
const b = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const rows = [];
const base = process.env.VEILCODE_VERIFY_URL || "http://localhost:3100";
try {
  for (const timezoneId of [
    "America/Los_Angeles",
    "Pacific/Kiritimati",
    "Asia/Tokyo",
  ]) {
    const context = await b.newContext({ timezoneId });
    const p = await context.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/blog", { waitUntil: "networkidle" });
    rows.push({ timezoneId, errors });
    console.log(JSON.stringify(rows.at(-1)));
    await context.close();
  }
  assert.ok(rows.every((r) => !r.errors.length));
} finally {
  writeFileSync(
    "docs/redesign/client-pages/verification/timezones.json",
    JSON.stringify(rows, null, 2),
  );
  await b.close();
}
