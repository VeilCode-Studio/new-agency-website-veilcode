import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { appSettings } from "@/db/schema";
import {
  CHATBOT_ENABLED_SETTING_KEY,
  normalizeChatbotEnabledValue,
  serializeChatbotEnabledValue,
} from "./settings";

export async function getChatbotEnabled(): Promise<boolean> {
  try {
    const [row] = await db
      .select({ value: appSettings.value })
      .from(appSettings)
      .where(eq(appSettings.key, CHATBOT_ENABLED_SETTING_KEY))
      .limit(1);

    return normalizeChatbotEnabledValue(row?.value);
  } catch (err) {
    console.warn("[chatbot/settings] failed to read chatbot setting:", err);
    return true;
  }
}

export async function setChatbotEnabled(enabled: boolean): Promise<void> {
  await db
    .insert(appSettings)
    .values({
      key: CHATBOT_ENABLED_SETTING_KEY,
      value: serializeChatbotEnabledValue(enabled),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: {
        value: serializeChatbotEnabledValue(enabled),
        updatedAt: new Date(),
      },
    });
}
