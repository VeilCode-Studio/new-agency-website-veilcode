import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("publication dates keep the same calendar day across server and reader timezones", () => {
  for (const timezone of [
    "Africa/Kampala",
    "America/Los_Angeles",
    "Pacific/Kiritimati",
  ]) {
    const probe = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
      import {formatDate} from './constants/blog.ts';
      process.stdout.write(formatDate('2026-10-20T00:30:00.000Z'));
    `,
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, TZ: timezone },
        encoding: "utf8",
      },
    );
    assert.equal(probe.status, 0, probe.stderr);
    assert.equal(probe.stdout, "20 October 2026", timezone);
  }
});
