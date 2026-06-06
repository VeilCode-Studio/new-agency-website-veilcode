import test from "node:test";
import assert from "node:assert/strict";
import {
  chatbotRequestSchema,
  chatbotModelResponseSchema,
  formatChatbotValidationError,
} from "./schema.ts";

test("chatbotRequestSchema trims and limits messages to the last 12 entries", () => {
  const result = chatbotRequestSchema.parse({
    conversationId: "  abc-123  ",
    messages: Array.from({ length: 14 }, (_, index) => ({
      role: index % 2 === 0 ? "user" : "assistant",
      content: ` message ${index} `,
    })),
    leadDraft: {
      service: " ai ",
      name: "  Sarah ",
      email: " sarah@example.com ",
      message: "  I need workflow automation. ",
    },
    leadSubmitted: false,
  });

  assert.equal(result.conversationId, "abc-123");
  assert.equal(result.messages.length, 12);
  assert.equal(result.messages[0].content, "message 2");
  assert.equal(result.leadDraft.service, "ai");
  assert.equal(result.leadDraft.name, "Sarah");
  assert.equal(result.leadDraft.email, "sarah@example.com");
});

test("chatbotRequestSchema rejects empty latest user message", () => {
  const result = chatbotRequestSchema.safeParse({
    messages: [{ role: "user", content: " " }],
  });

  assert.equal(result.success, false);
  if (result.success) return;

  assert.equal(
    formatChatbotValidationError(result.error),
    "Please enter a message.",
  );
});

test("chatbotRequestSchema rejects oversized messages and invalid email drafts", () => {
  const result = chatbotRequestSchema.safeParse({
    messages: [{ role: "user", content: "x".repeat(1201) }],
    leadDraft: { email: "not-an-email" },
  });

  assert.equal(result.success, false);
  if (result.success) return;

  assert.equal(
    formatChatbotValidationError(result.error),
    "Messages must be 1,200 characters or fewer.",
  );
});

test("chatbotModelResponseSchema accepts the structured model response shape", () => {
  const result = chatbotModelResponseSchema.parse({
    reply: "I can help with that. What timeline are you working toward?",
    leadDraft: {
      service: "AI Automation",
      name: "",
      email: "",
      company: "",
      budget: "",
      timeline: "",
      message: "The visitor needs lead qualification automation.",
      goals: ["Reduce manual work"],
    },
    readyToSubmit: false,
  });

  assert.equal(result.leadDraft.service, "AI Automation");
  assert.equal(result.readyToSubmit, false);
});
