import "server-only";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { admins } from "@/db/schema";

export function getBootstrapAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isBootstrapAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getBootstrapAdminEmails().includes(email.toLowerCase());
}

export type AdminContext = {
  userId: string;
  email: string;
  name: string | null;
  isBootstrap: boolean;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  let user;
  try {
    user = await currentUser();
  } catch {
    // Clerk's backend API can fail transiently on the first request after
    // sign-in before the session has fully propagated. Surface a recoverable
    // error so the admin error boundary can prompt a refresh.

    // throw new Error("Clerk session lookup failed — please refresh the page.");
    return null;
  }
  if (!user) return null;

  const email = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  )?.emailAddress?.toLowerCase();

  if (!email) return null;

  const isBootstrap = isBootstrapAdminEmail(email);

  try {
    const [existing] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    if (existing) {
      if (!existing.clerkUserId || existing.clerkUserId !== user.id) {
        await db
          .update(admins)
          .set({ clerkUserId: user.id })
          .where(eq(admins.id, existing.id));
      }
      return {
        userId: user.id,
        email,
        name: existing.name ?? user.fullName ?? null,
        isBootstrap,
      };
    }

    if (isBootstrap) {
      await db.insert(admins).values({
        email,
        clerkUserId: user.id,
        name: user.fullName ?? null,
        addedBy: "bootstrap",
      });
      return {
        userId: user.id,
        email,
        name: user.fullName ?? null,
        isBootstrap: true,
      };
    }

    return null;
  } catch (err) {
    // DB unreachable or `admins` table missing — fall back to env bootstrap
    // so an admin can still load the panel and run `drizzle-kit push`.
    console.warn("[admin/auth] admins table lookup failed, falling back to ADMIN_EMAILS:", err);
    if (isBootstrap) {
      return {
        userId: user.id,
        email,
        name: user.fullName ?? null,
        isBootstrap: true,
      };
    }
    return null;
  }
}

export async function requireAdmin(): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (!ctx) redirect("/no-access");
  return ctx;
}
