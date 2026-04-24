"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { jobOpenings } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function deleteJobAction(id: number): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db.delete(jobOpenings).where(eq(jobOpenings.id, id));
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return {};
  } catch (err) {
    console.error("[admin/careers] delete error:", err);
    return { error: "Failed to delete job opening" };
  }
}

export async function togglePublishJobAction(
  id: number,
  published: boolean,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db
      .update(jobOpenings)
      .set({ published, updatedAt: new Date() })
      .where(eq(jobOpenings.id, id));
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return {};
  } catch (err) {
    console.error("[admin/careers] togglePublish error:", err);
    return { error: "Failed to update job opening" };
  }
}
