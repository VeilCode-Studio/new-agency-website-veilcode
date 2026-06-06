import {
  normalizeInquiryBudget,
  normalizeInquiryService,
  normalizeInquiryTimeline,
} from "../inquiries/normalize.ts";
import type { ChatbotLeadDraft } from "./schema.ts";

export type ChatbotInquiryInput = {
  name: string;
  email: string;
  service: string;
  message: string;
  company?: string | null;
  budget?: string | null;
  timeline?: string | null;
  goals?: string[];
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isLeadReadyForSubmission(leadDraft: ChatbotLeadDraft) {
  return Boolean(
    clean(leadDraft.name) &&
      clean(leadDraft.email) &&
      clean(leadDraft.service) &&
      clean(leadDraft.message).length >= 20,
  );
}

export function buildChatbotInquiryInput(
  leadDraft: ChatbotLeadDraft,
): ChatbotInquiryInput {
  const message = clean(leadDraft.message);

  return {
    name: clean(leadDraft.name),
    email: clean(leadDraft.email),
    service: normalizeInquiryService(leadDraft.service),
    budget: normalizeInquiryBudget(leadDraft.budget),
    timeline: normalizeInquiryTimeline(leadDraft.timeline),
    company: clean(leadDraft.company) || null,
    goals: leadDraft.goals ?? [],
    message: `Chatbot-qualified lead.\n\n${message}`,
  };
}
