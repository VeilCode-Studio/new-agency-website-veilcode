import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { normalizeSeoPageInput, validateSeoPageInput } from "@/lib/seo/seoPageInput";

export const runtime = "nodejs";

function readPagesPayload(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "pages" in payload) {
    const pages = (payload as { pages?: unknown }).pages;
    return Array.isArray(pages) ? pages : [];
  }
  return [];
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await req.json();
    const entries = readPagesPayload(payload);

    if (entries.length === 0) {
      return NextResponse.json({ error: "No SEO pages were provided" }, { status: 400 });
    }

    const results: { slug: string; action: "created" | "updated" }[] = [];

    for (const entry of entries) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return NextResponse.json({ error: "Each SEO page must be an object" }, { status: 400 });
      }

      const body = normalizeSeoPageInput(entry as Record<string, unknown>);
      validateSeoPageInput(body);

      const existing = await db
        .select()
        .from(seoPages)
        .where(eq(seoPages.slug, body.slug))
        .limit(1);

      if (existing[0]) {
        await db
          .update(seoPages)
          .set({
            ...body,
            updatedAt: new Date(),
          })
          .where(eq(seoPages.slug, body.slug));

        results.push({ slug: body.slug, action: "updated" });
        continue;
      }

      await db.insert(seoPages).values({
        ...body,
        updatedAt: new Date(),
      });

      results.push({ slug: body.slug, action: "created" });
    }

    return NextResponse.json({
      ok: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("[api/admin/seo-pages/import] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import SEO pages" },
      { status: 500 },
    );
  }
}
