import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const seedPath = path.join(process.cwd(), "docs", "seo", "veilcode-seo-page-seed-data.json");
    const raw = await readFile(seedPath, "utf8");
    const data = JSON.parse(raw) as unknown;

    return NextResponse.json({
      ok: true,
      filename: "veilcode-seo-page-seed-data.json",
      pages: data,
    });
  } catch (error) {
    console.error("[api/admin/seo-pages/seed] GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load SEO seed data" },
      { status: 500 },
    );
  }
}
