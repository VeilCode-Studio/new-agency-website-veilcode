import type { ChatMessage } from "./schema";

export type ChoiceGroup = {
  label: string;
  options: string[];
};

export const SERVICE_OPTIONS = [
  "Web Solutions",
  "Mobile Applications",
  "AI Automation",
];

export const COMPETITOR_OUTPUT_OPTIONS = [
  "Feature gaps",
  "Pricing changes",
  "Content/SEO moves",
  "Automation opportunities",
  "Dashboard with alerts",
];

export const AUTOMATION_PROCESS_OPTIONS = [
  "Lead qualification",
  "Support triage",
  "Reporting",
  "Document processing",
  "Approvals",
  "Follow-ups",
];

export const PROJECT_OUTCOME_OPTIONS = [
  "Reduce manual work",
  "Find market gaps",
  "Monitor competitors",
  "Improve reporting",
  "Speed up decisions",
];

export const USER_AUDIENCE_OPTIONS = [
  "Customers",
  "Internal team",
  "Admins/managers",
  "Partners/vendors",
  "Field staff",
];

export const DATA_SOURCE_OPTIONS = [
  "Competitor websites",
  "Social channels",
  "Search results",
  "Public pricing pages",
  "Internal spreadsheets",
  "CRM data",
];

export const BUDGET_OPTIONS = [
  "Under $1,500",
  "$1,500 - $5,000",
  "$5,000 - $15,000",
  "$15,000 - $30,000",
  "$30,000 - $60,000",
  "$60,000+",
  "Let's discuss",
];

export const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "Just exploring",
];

function latestAssistantContent(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "assistant")?.content ?? "";
}

function activeQuestion(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  const questions = normalized.match(/[^?]*\?/g);
  return (questions?.at(-1) ?? normalized).toLowerCase();
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function getChoiceGroup(messages: ChatMessage[]): ChoiceGroup | null {
  const content = latestAssistantContent(messages);
  if (!content) return null;

  const lower = content.toLowerCase();
  const question = activeQuestion(content);

  if (
    includesAny(question, [
      "choose a service",
      "which one best matches",
      "which service are you interested",
    ]) ||
    lower.includes("core services")
  ) {
    return { label: "Select one or more services", options: SERVICE_OPTIONS };
  }

  if (question.includes("what output matters most first")) {
    return {
      label: "Select one or more outputs",
      options: COMPETITOR_OUTPUT_OPTIONS,
    };
  }

  if (
    includesAny(question, [
      "what process should",
      "main process you want automated",
    ])
  ) {
    return {
      label: "Select one or more processes",
      options: AUTOMATION_PROCESS_OPTIONS,
    };
  }

  if (includesAny(question, ["main outcome", "primary outcome"])) {
    return {
      label: "Select one or more outcomes",
      options: PROJECT_OUTCOME_OPTIONS,
    };
  }

  if (
    includesAny(question, [
      "primary users",
      "target users",
      "targeting",
      "who will use",
      "who are the users",
    ])
  ) {
    return {
      label: "Select one or more user groups",
      options: USER_AUDIENCE_OPTIONS,
    };
  }

  if (question.includes("data sources")) {
    return {
      label: "Select one or more data sources",
      options: DATA_SOURCE_OPTIONS,
    };
  }

  if (question.includes("budget")) {
    return { label: "Select a budget range", options: BUDGET_OPTIONS };
  }

  if (question.includes("timeline")) {
    return { label: "Select a timeline", options: TIMELINE_OPTIONS };
  }

  return null;
}
