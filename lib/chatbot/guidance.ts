import type { ChatMessage, ChatbotLeadDraft } from "./schema";

const SERVICE_LIST_REPLY = `Our core services:
- Web Solutions: conversion-focused websites and web platforms.
- Mobile Applications: cross-platform iOS and Android apps.
- AI Automation: AI assistants, workflow automation, internal copilots, and business process tools.

Data analytics, reporting, dashboards, and social media support are available as supporting capabilities inside those core services when they fit the project.

Which one best matches what you are trying to improve?`;

function latestUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function uniqueGoals(existing: string[] | undefined, next: string[]) {
  return [...new Set([...(existing ?? []), ...next])];
}

function mergeMessage(existing: string | undefined, latest: string) {
  const cleanLatest = latest.trim();
  const cleanExisting = existing?.trim();

  if (!cleanLatest) return cleanExisting;
  if (!cleanExisting) return cleanLatest;
  if (cleanExisting.toLowerCase().includes(cleanLatest.toLowerCase())) return cleanExisting;

  return `${cleanExisting}\n${cleanLatest}`;
}

export function buildGuidedChatbotFallback(
  messages: ChatMessage[],
  leadDraft: ChatbotLeadDraft,
) {
  const latest = latestUserMessage(messages);
  const lower = latest.toLowerCase();
  const draft: ChatbotLeadDraft = { ...leadDraft };

  if (
    includesAny(lower, ["what services", "services do you offer", "list"]) ||
    (includesAny(lower, ["summarize", "summary"]) && lower.includes("service"))
  ) {
    return {
      reply: SERVICE_LIST_REPLY,
      leadDraft: draft,
    };
  }

  if (
    includesAny(lower, [
      "competitor analysis",
      "competitive analysis",
      "competitor research",
      "market research",
      "competitive intelligence",
    ])
  ) {
    draft.service = draft.service || "AI Automation";
    draft.message = mergeMessage(draft.message, latest);
    draft.goals = uniqueGoals(draft.goals, ["Data-driven decisions", "Reduce manual work"]);

    return {
      reply:
        "That fits an AI Automation project with a data-intelligence layer. We can scope a competitor analysis tool that tracks selected competitors, gathers public signals, summarizes changes, and turns them into useful recommendations. What output matters most first: feature gaps, pricing changes, content/SEO moves, automation opportunities, or a dashboard with alerts?",
      leadDraft: draft,
    };
  }

  if (includesAny(lower, ["ai automation", "automate", "automation", "workflow", "copilot", "chatbot"])) {
    draft.service = draft.service || "AI Automation";
    draft.message = mergeMessage(draft.message, latest);
    draft.goals = uniqueGoals(draft.goals, ["Reduce manual work"]);

    return {
      reply:
        "That sounds like a fit for AI Automation. To scope it properly, what process should the tool handle first, and what should happen after the AI produces its result?",
      leadDraft: draft,
    };
  }

  if (includesAny(lower, ["next step", "next steps", "what now", "start"])) {
    const service = draft.service ? ` for ${draft.service}` : "";

    return {
      reply: `The next step is a short discovery${service}. I need the primary outcome, target users, data sources or tools involved, preferred timeline, and budget range. What is the main outcome you want from this project?`,
      leadDraft: draft,
    };
  }

  draft.message = mergeMessage(draft.message, latest);

  return {
    reply:
      "I can help scope that. What outcome are you trying to achieve, and who will use the finished tool or system?",
    leadDraft: draft,
  };
}
