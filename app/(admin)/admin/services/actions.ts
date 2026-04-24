"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function deleteServiceAction(id: string): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db.delete(services).where(eq(services.id, id));
    revalidatePath("/admin/services");
    return {};
  } catch (err) {
    console.error("[admin/services] delete error:", err);
    return { error: "Failed to delete service" };
  }
}

export async function togglePublishServiceAction(
  id: string,
  published: boolean,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db
      .update(services)
      .set({ published, updatedAt: new Date() })
      .where(eq(services.id, id));
    revalidatePath("/admin/services");
    return {};
  } catch (err) {
    console.error("[admin/services] togglePublish error:", err);
    return { error: "Failed to update service" };
  }
}
