import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { normalizeSeoPageInput, validateSeoPageInput } from "@/lib/seo/seoPageInput";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(seoPages)
      .orderBy(asc(seoPages.updatedAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/admin/seo-pages] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch SEO pages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = normalizeSeoPageInput(await req.json());
    validateSeoPageInput(body);

    const [created] = await db
      .insert(seoPages)
      .values(body)
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[api/admin/seo-pages] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create SEO page" },
      { status: 500 },
    );
  }
}
