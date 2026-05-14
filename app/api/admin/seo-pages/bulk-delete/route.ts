import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

function readIds(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const ids = (payload as { ids?: unknown }).ids;
  return Array.isArray(ids)
    ? ids.filter((id): id is number => Number.isInteger(id) && id > 0)
    : [];
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const ids = Array.from(new Set(readIds(await req.json())));
    if (ids.length === 0) {
      return NextResponse.json({ error: "No SEO pages selected" }, { status: 400 });
    }

    await db.delete(seoPages).where(inArray(seoPages.id, ids));
    return NextResponse.json({ ok: true, deleted: ids.length });
  } catch (error) {
    console.error("[api/admin/seo-pages/bulk-delete] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete SEO pages" },
      { status: 500 },
    );
  }
}
