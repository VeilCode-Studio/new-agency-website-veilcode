import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeInquiryService,
  normalizeInquiryBudget,
  normalizeInquiryTimeline,
} from "./normalize.ts";

test("normalizeInquiryService maps start wizard ids to stored service labels", () => {
  assert.equal(
    normalizeInquiryService("web"),
    "Web Solutions (Design & Development)",
  );
  assert.equal(normalizeInquiryService("ai"), "AI Automation");
  assert.equal(normalizeInquiryService("multiple"), "Multiple Services");
});

test("normalizeInquiryService preserves supported contact form service labels", () => {
  assert.equal(
    normalizeInquiryService("Mobile Application Development"),
    "Mobile Application Development",
  );
  assert.equal(normalizeInquiryService("Not Sure Yet"), "Not Sure Yet");
});

test("normalizeInquiryService falls back to Not Sure Yet for unknown values", () => {
  assert.equal(normalizeInquiryService("growth strategy"), "Not Sure Yet");
  assert.equal(normalizeInquiryService(" "), "Not Sure Yet");
});

test("normalizeInquiryService does not store supporting capabilities as major services", () => {
  assert.equal(normalizeInquiryService("Data Analytics"), "Not Sure Yet");
  assert.equal(normalizeInquiryService("Social Media Marketing"), "Not Sure Yet");
});

test("normalizeInquiryBudget and normalizeInquiryTimeline keep only enum-compatible values", () => {
  assert.equal(normalizeInquiryBudget("$5,000 – $15,000"), "$5,000 – $15,000");
  assert.equal(normalizeInquiryBudget("$60,000+"), "$60,000");
  assert.equal(normalizeInquiryBudget("enterprise"), null);

  assert.equal(normalizeInquiryTimeline("1–3 months"), "1–3 months");
  assert.equal(normalizeInquiryTimeline("ASAP"), "ASAP — urgent project");
  assert.equal(
    normalizeInquiryTimeline("Just exploring"),
    "Just exploring for now",
  );
  assert.equal(normalizeInquiryTimeline("next decade"), null);
});
