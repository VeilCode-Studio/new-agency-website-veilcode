import test from "node:test";
import assert from "node:assert/strict";
import { normalizeChatbotEnabledValue } from "./settings.ts";

test("normalizeChatbotEnabledValue defaults to enabled", () => {
  assert.equal(normalizeChatbotEnabledValue(undefined), true);
  assert.equal(normalizeChatbotEnabledValue(null), true);
  assert.equal(normalizeChatbotEnabledValue(""), true);
  assert.equal(normalizeChatbotEnabledValue("unexpected"), true);
});

test("normalizeChatbotEnabledValue reads explicit enabled and disabled values", () => {
  assert.equal(normalizeChatbotEnabledValue(true), true);
  assert.equal(normalizeChatbotEnabledValue(false), false);
  assert.equal(normalizeChatbotEnabledValue("true"), true);
  assert.equal(normalizeChatbotEnabledValue("false"), false);
});
