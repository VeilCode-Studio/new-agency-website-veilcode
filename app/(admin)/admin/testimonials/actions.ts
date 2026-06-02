"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function deleteTestimonialAction(
  id: number,
): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db.delete(testimonials).where(eq(testimonials.id, id));
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return {};
  } catch (err) {
    console.error("[admin/testimonials] delete error:", err);
    return { error: "Failed to delete testimonial" };
  }
}
