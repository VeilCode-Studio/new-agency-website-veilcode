"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { clientInquiries } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

async function guardAdmin() {
  const ctx = await getAdminContext();
  if (!ctx) throw new Error("Unauthorized");
}

export async function deleteInquiryAction(id: number): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    await db.delete(clientInquiries).where(eq(clientInquiries.id, id));
    revalidatePath("/admin/inquiries");
    return {};
  } catch (err) {
    console.error("[admin/inquiries] delete error:", err);
    return { error: "Failed to delete inquiry" };
  }
}
