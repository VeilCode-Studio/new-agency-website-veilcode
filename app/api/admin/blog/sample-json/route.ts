import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { readBlogSampleJson } from "@/lib/blog/sampleJson";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sample = await readBlogSampleJson();

    return new NextResponse(sample.content, {
      headers: {
        "Content-Type": sample.contentType,
        "Content-Disposition": `attachment; filename="${sample.filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/admin/blog/sample-json] GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load sample blog JSON" },
      { status: 500 },
    );
  }
}
