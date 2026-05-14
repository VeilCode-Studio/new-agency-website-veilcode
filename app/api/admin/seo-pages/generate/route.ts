import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { importSeoPagesFromPayload } from "@/lib/seo/seoPageImport";
import { buildSeoPageGeneratorPages, type SeoPageGeneratorSelection } from "@/lib/seo/seoPageGenerator";

export const runtime = "nodejs";

function readSelection(payload: unknown): SeoPageGeneratorSelection {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      marketSlugs: [],
      serviceIds: [],
      includeLocationPages: false,
      includeServiceLocationPages: false,
      publishMode: "draft",
    };
  }

  const body = payload as Partial<SeoPageGeneratorSelection>;
  return {
    marketSlugs: Array.isArray(body.marketSlugs)
      ? body.marketSlugs.filter((value): value is string => typeof value === "string")
      : [],
    serviceIds: Array.isArray(body.serviceIds)
      ? body.serviceIds.filter(
          (value): value is SeoPageGeneratorSelection["serviceIds"][number] =>
            value === "web" || value === "mobile" || value === "ai",
        )
      : [],
    includeLocationPages: body.includeLocationPages === true,
    includeServiceLocationPages: body.includeServiceLocationPages === true,
    publishMode: body.publishMode === "live" ? "live" : "draft",
  };
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const selection = readSelection(await req.json());
    const generated = buildSeoPageGeneratorPages(selection);

    if (generated.pages.length === 0) {
      return NextResponse.json(
        { error: "Select at least one market and one page type to generate SEO pages" },
        { status: 400 },
      );
    }

    const { summary, results } = await importSeoPagesFromPayload({
      pages: generated.pages,
      publishMode: generated.publishMode,
    });

    return NextResponse.json({ ok: true, summary, results, generated: generated.pages.length });
  } catch (error) {
    console.error("[api/admin/seo-pages/generate] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate SEO pages" },
      { status: 500 },
    );
  }
}
