"use server";

import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";
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

export async function deleteInquiriesAction(ids: number[]): Promise<{ error?: string }> {
  try {
    await guardAdmin();
    const uniqueIds = Array.from(
      new Set(ids.filter((id) => Number.isInteger(id) && id > 0)),
    );

    if (uniqueIds.length === 0) {
      return { error: "No inquiries selected" };
    }

    await db.delete(clientInquiries).where(inArray(clientInquiries.id, uniqueIds));
    revalidatePath("/admin/inquiries");
    return {};
  } catch (err) {
    console.error("[admin/inquiries] bulk delete error:", err);
    return { error: "Failed to delete inquiries" };
  }
}
