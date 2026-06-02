import test from "node:test";
import assert from "node:assert/strict";
import { toDisplayTestimonial } from "./display.ts";

test("toDisplayTestimonial derives initials and combines role with company", () => {
  const result = toDisplayTestimonial({
    id: 1,
    name: "Amina Hassan",
    role: "Head of Growth",
    company: "Vantage",
    quote: "The automation work paid for itself quickly.",
    avatar: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-02"),
  });

  assert.equal(result.initials, "AH");
  assert.equal(result.role, "Head of Growth, Vantage");
  assert.equal(result.name, "Amina Hassan");
  assert.equal(result.quote, "The automation work paid for itself quickly.");
});
