import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import {
  analyzeSeoPageImport,
  importSeoPagesFromPayload,
} from "@/lib/seo/seoPageImport";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await req.json();
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode");

    if (mode === "preview") {
      const summary = await analyzeSeoPageImport(payload);
      return NextResponse.json({ ok: true, mode: "preview", ...summary });
    }

    const { summary, results } = await importSeoPagesFromPayload(payload);
    return NextResponse.json({ ok: true, mode: "import", summary, results });
  } catch (error) {
    console.error("[api/admin/seo-pages/import] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import SEO pages" },
      { status: 500 },
    );
  }
}
