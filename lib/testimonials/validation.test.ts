import test from "node:test";
import assert from "node:assert/strict";
import {
  formatTestimonialValidationError,
  testimonialInputSchema,
} from "./validation.ts";

test("testimonialInputSchema trims required testimonial fields", () => {
  const result = testimonialInputSchema.parse({
    name: "  Sarah Okonkwo  ",
    role: "  CEO  ",
    company: "  Nexus Commerce  ",
    quote: "  VeilCode changed our operating rhythm.  ",
    avatar: "  https://example.com/sarah.jpg  ",
  });

  assert.equal(result.name, "Sarah Okonkwo");
  assert.equal(result.role, "CEO");
  assert.equal(result.company, "Nexus Commerce");
  assert.equal(result.quote, "VeilCode changed our operating rhythm.");
  assert.equal(result.avatar, "https://example.com/sarah.jpg");
});

test("testimonialInputSchema stores blank avatar values as null", () => {
  const result = testimonialInputSchema.parse({
    name: "James Thornton",
    role: "CTO",
    company: "FlowMetrics",
    quote: "The data platform has been rock solid.",
    avatar: " ",
  });

  assert.equal(result.avatar, null);
});

test("formatTestimonialValidationError returns the first validation message", () => {
  const result = testimonialInputSchema.safeParse({
    name: "",
    role: "Founder",
    company: "Vantage",
    quote: "Great team.",
    avatar: null,
  });

  assert.equal(result.success, false);
  if (result.success) return;

  assert.equal(formatTestimonialValidationError(result.error), "Name is required");
});
