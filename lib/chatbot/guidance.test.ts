import test from "node:test";
import assert from "node:assert/strict";
import { buildGuidedChatbotFallback } from "./guidance.ts";

test("buildGuidedChatbotFallback routes competitor analysis tools to AI automation", () => {
  const result = buildGuidedChatbotFallback(
    [
      {
        role: "user",
        content: "I need a tool that does competitor analysis on automation",
      },
    ],
    {},
  );

  assert.equal(result.leadDraft.service, "AI Automation");
  assert.match(result.leadDraft.message ?? "", /competitor analysis/);
  assert.deepEqual(result.leadDraft.goals, [
    "Data-driven decisions",
    "Reduce manual work",
  ]);
  assert.match(result.reply, /What output matters most first/);
});

test("buildGuidedChatbotFallback answers service summaries with a follow-up", () => {
  const result = buildGuidedChatbotFallback(
    [{ role: "user", content: "Summarize the services in a list" }],
    { service: "AI Automation" },
  );

  assert.equal(result.leadDraft.service, "AI Automation");
  assert.match(result.reply, /Our core services/);
  assert.doesNotMatch(result.reply, /^- Data Analytics:/m);
  assert.doesNotMatch(result.reply, /^- Social Media Marketing:/m);
  assert.match(result.reply, /Which one best matches/);
});

test("buildGuidedChatbotFallback routes website estimate requests to web solutions", () => {
  const result = buildGuidedChatbotFallback(
    [
      {
        role: "user",
        content: "I need a website a real estate project, give me an estimate",
      },
    ],
    {},
  );

  assert.equal(result.leadDraft.service, "Web Solutions");
  assert.match(result.leadDraft.message ?? "", /real estate project/);
  assert.match(result.reply, /Web Solutions/);
  assert.match(result.reply, /estimate/i);
  assert.doesNotMatch(result.reply, /finished tool or system/i);
});

test("buildGuidedChatbotFallback routes mobile cost requests to mobile applications", () => {
  const result = buildGuidedChatbotFallback(
    [
      {
        role: "user",
        content: "I need a mobile application, what's the cost?",
      },
    ],
    {},
  );

  assert.equal(result.leadDraft.service, "Mobile Applications");
  assert.match(result.leadDraft.message ?? "", /mobile application/);
  assert.match(result.reply, /Mobile Applications/);
  assert.match(result.reply, /cost|budget|range/i);
  assert.doesNotMatch(result.reply, /finished tool or system/i);
});

test("buildGuidedChatbotFallback asks for the next scoping detail", () => {
  const result = buildGuidedChatbotFallback(
    [{ role: "user", content: "What is the next step?" }],
    {
      service: "AI Automation",
      message: "I need competitor analysis automation.",
    },
  );

  assert.match(result.reply, /short discovery for AI Automation/);
  assert.match(result.reply, /main outcome/);
});
