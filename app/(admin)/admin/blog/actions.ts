"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function deletePostAction(id: number): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath("/admin/blog");
    return {};
  } catch (err) {
    console.error("[admin/blog] delete error:", err);
    return { error: "Failed to delete post" };
  }
}

export async function togglePublishPostAction(
  id: number,
  published: boolean,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db
      .update(blogPosts)
      .set({ published, updatedAt: new Date() })
      .where(eq(blogPosts.id, id));
    revalidatePath("/admin/blog");
    return {};
  } catch (err) {
    console.error("[admin/blog] togglePublish error:", err);
    return { error: "Failed to update post" };
  }
}
