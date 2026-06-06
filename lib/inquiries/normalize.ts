const SERVICE_LABELS = [
  "Web Solutions (Design & Development)",
  "Mobile Application Development",
  "Data Analytics",
  "Social Media Marketing",
  "AI Automation",
  "Multiple Services",
  "Not Sure Yet",
] as const;

const BUDGET_LABELS = [
  "Under $1,500",
  "$1,500 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000 - $60,000",
  "$60,000",
  "Let's Discuss",
] as const;

const TIMELINE_LABELS = [
  "ASAP — urgent project",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Just exploring for now",
] as const;

const GOAL_LABELS = [
  "Increase revenue",
  "Reduce manual work",
  "Launch a new product",
  "Improve user experience",
  "Scale existing systems",
  "Enter a new market",
  "Build internal tools",
  "Data-driven decisions",
] as const;

export type InquiryService = (typeof SERVICE_LABELS)[number];
export type InquiryBudget = (typeof BUDGET_LABELS)[number];
export type InquiryTimeline = (typeof TIMELINE_LABELS)[number];
export type InquiryGoal = (typeof GOAL_LABELS)[number];

const SERVICE_ALIASES: Record<string, InquiryService> = {
  web: "Web Solutions (Design & Development)",
  "web solutions": "Web Solutions (Design & Development)",
  "web-solutions": "Web Solutions (Design & Development)",
  "web solutions (design & development)": "Web Solutions (Design & Development)",
  mobile: "Mobile Application Development",
  "mobile application": "Mobile Application Development",
  "mobile applications": "Mobile Application Development",
  "mobile application development": "Mobile Application Development",
  data: "Data Analytics",
  "data analytics": "Data Analytics",
  social: "Social Media Marketing",
  "social media marketing": "Social Media Marketing",
  ai: "AI Automation",
  "ai automation": "AI Automation",
  multiple: "Multiple Services",
  "multiple services": "Multiple Services",
  "not sure": "Not Sure Yet",
  "not sure yet": "Not Sure Yet",
};

const BUDGET_ALIASES: Record<string, InquiryBudget> = {
  "$60,000+": "$60,000",
};

const TIMELINE_ALIASES: Record<string, InquiryTimeline> = {
  asap: "ASAP — urgent project",
  "just exploring": "Just exploring for now",
};

function key(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeInquiryService(value: unknown): InquiryService {
  if (typeof value !== "string") return "Not Sure Yet";

  const trimmed = value.trim();
  return SERVICE_ALIASES[key(trimmed)] ?? SERVICE_LABELS.find((service) => service === trimmed) ?? "Not Sure Yet";
}

export function normalizeInquiryBudget(value: unknown): InquiryBudget | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return BUDGET_ALIASES[key(trimmed)] ?? BUDGET_LABELS.find((budget) => budget === trimmed) ?? null;
}

export function normalizeInquiryTimeline(value: unknown): InquiryTimeline | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return TIMELINE_ALIASES[key(trimmed)] ?? TIMELINE_LABELS.find((timeline) => timeline === trimmed) ?? null;
}

export function normalizeInquiryGoals(value: unknown): InquiryGoal[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((goal) => {
    if (typeof goal !== "string") return [];
    const trimmed = goal.trim();
    const supported = GOAL_LABELS.find((item) => item === trimmed);
    return supported ? [supported] : [];
  });
}
