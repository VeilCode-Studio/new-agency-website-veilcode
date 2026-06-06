import test from "node:test";
import assert from "node:assert/strict";
import { createClientInquiry } from "./service.ts";

test("createClientInquiry normalizes and stores an inquiry, then sends client and admin emails", async () => {
  const insertedRows: unknown[] = [];
  const sentEmails: unknown[] = [];

  const result = await createClientInquiry(
    {
      name: " Sarah ",
      email: " sarah@example.com ",
      company: " Vantage ",
      service: "ai",
      budget: "$60,000+",
      timeline: "ASAP",
      message: "We need workflow automation for lead routing.",
      goals: ["Reduce manual work"],
    },
    {
      insertInquiry: async (values) => {
        insertedRows.push(values);
        return { id: 42 };
      },
      sendEmail: async (email) => {
        sentEmails.push(email);
        return {};
      },
    },
  );

  assert.equal(result.id, 42);
  assert.deepEqual(insertedRows[0], {
    name: "Sarah",
    email: "sarah@example.com",
    company: "Vantage",
    service: "AI Automation",
    budget: "$60,000",
    timeline: "ASAP — urgent project",
    message: "We need workflow automation for lead routing.",
    goals: ["Reduce manual work"],
  });
  assert.equal(sentEmails.length, 2);
});

test("createClientInquiry rejects missing required values before touching dependencies", async () => {
  let inserted = false;

  await assert.rejects(
    () =>
      createClientInquiry(
        {
          name: "",
          email: "sarah@example.com",
          service: "ai",
          message: "We need workflow automation for lead routing.",
        },
        {
          insertInquiry: async () => {
            inserted = true;
            return { id: 1 };
          },
          sendEmail: async () => ({}),
        },
      ),
    /Name, email, service and message are required/,
  );

  assert.equal(inserted, false);
});

test("createClientInquiry drops goals that are not supported by the database enum", async () => {
  const insertedRows: unknown[] = [];

  await createClientInquiry(
    {
      name: "Sarah",
      email: "sarah@example.com",
      service: "ai",
      message: "We need workflow automation for lead routing.",
      goals: ["Reduce manual work", "Unknown goal"],
    },
    {
      insertInquiry: async (values) => {
        insertedRows.push(values);
        return { id: 7 };
      },
      sendEmail: async () => ({}),
    },
  );

  assert.deepEqual((insertedRows[0] as { goals: string[] }).goals, [
    "Reduce manual work",
  ]);
});
