"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function deleteProjectAction(id: number): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/admin/projects");
    return {};
  } catch (err) {
    console.error("[admin/projects] delete error:", err);
    return { error: "Failed to delete project" };
  }
}

export async function togglePublishAction(
  id: number,
  published: boolean,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db
      .update(projects)
      .set({ published, updatedAt: new Date() })
      .where(eq(projects.id, id));
    revalidatePath("/admin/projects");
    return {};
  } catch (err) {
    console.error("[admin/projects] togglePublish error:", err);
    return { error: "Failed to update project" };
  }
}

export async function toggleFeaturedAction(
  id: number,
  featured: boolean,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db
      .update(projects)
      .set({ featured, updatedAt: new Date() })
      .where(eq(projects.id, id));
    revalidatePath("/admin/projects");
    return {};
  } catch (err) {
    console.error("[admin/projects] toggleFeatured error:", err);
    return { error: "Failed to update project" };
  }
}
