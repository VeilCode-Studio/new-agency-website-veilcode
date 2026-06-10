export const CHATBOT_ENABLED_SETTING_KEY = "chatbot_enabled";

export function normalizeChatbotEnabledValue(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return true;

  const normalized = value.trim().toLowerCase();
  if (normalized === "false") return false;
  if (normalized === "true") return true;

  return true;
}

export function serializeChatbotEnabledValue(enabled: boolean): string {
  return enabled ? "true" : "false";
}
