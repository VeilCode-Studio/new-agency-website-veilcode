"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { setChatbotEnabled } from "@/lib/chatbot/settings.server";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function updateChatbotEnabledAction(
  enabled: boolean,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await setChatbotEnabled(enabled);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return {};
  } catch (err) {
    console.error("[admin/settings] update chatbot setting error:", err);
    return { error: "Failed to update chatbot visibility" };
  }
}
