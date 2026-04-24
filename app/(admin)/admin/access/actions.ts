"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { admins } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";

const addSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  name: z.string().trim().max(120).optional(),
});

export type AddAdminState = {
  ok: boolean;
  error?: string;
};

export async function addAdminAction(
  _prev: AddAdminState,
  formData: FormData,
): Promise<AddAdminState> {
  const me = await requireAdmin();

  const parsed = addSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, name } = parsed.data;

  const [existing] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (existing) {
    return { ok: false, error: "That email already has admin access." };
  }

  await db.insert(admins).values({
    email,
    name: name && name.length > 0 ? name : null,
    addedBy: me.email,
  });

  revalidatePath("/admin/access");
  return { ok: true };
}

export async function removeAdminAction(formData: FormData): Promise<void> {
  const me = await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const [target] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  if (!target) return;

  if (target.email.toLowerCase() === me.email.toLowerCase()) {
    throw new Error("You cannot remove your own admin access.");
  }

  await db.delete(admins).where(eq(admins.id, id));
  revalidatePath("/admin/access");
}
