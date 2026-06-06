import test from "node:test";
import assert from "node:assert/strict";
import {
  buildChatbotInquiryInput,
  isLeadReadyForSubmission,
} from "./lead.ts";

test("isLeadReadyForSubmission requires name, email, service, and message", () => {
  assert.equal(
    isLeadReadyForSubmission({
      name: "Sarah",
      email: "sarah@example.com",
      service: "ai",
      message: "We need to automate internal reporting and approvals.",
    }),
    true,
  );

  assert.equal(
    isLeadReadyForSubmission({
      name: "Sarah",
      email: "sarah@example.com",
      service: "ai",
      message: "short",
    }),
    false,
  );
});

test("buildChatbotInquiryInput normalizes fields and appends chatbot context", () => {
  const input = buildChatbotInquiryInput({
    name: " Sarah ",
    email: " sarah@example.com ",
    service: "ai",
    budget: "$60,000+",
    timeline: "ASAP",
    company: " Vantage ",
    message: "We need an assistant to qualify inbound leads and route them to sales.",
    goals: ["Reduce manual work", "Launch a new product"],
  });

  assert.equal(input.name, "Sarah");
  assert.equal(input.email, "sarah@example.com");
  assert.equal(input.service, "AI Automation");
  assert.equal(input.budget, "$60,000");
  assert.equal(input.timeline, "ASAP — urgent project");
  assert.equal(input.company, "Vantage");
  assert.deepEqual(input.goals, ["Reduce manual work", "Launch a new product"]);
  assert.match(input.message, /^Chatbot-qualified lead\./);
  assert.match(input.message, /qualify inbound leads/);
});
