import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { blogPostInputSchema, formatBlogValidationError } from "@/lib/blog/validation";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/admin/blog] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await req.json();
    const parsed = blogPostInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatBlogValidationError(parsed.error) },
        { status: 400 },
      );
    }

    const [created] = await db.insert(blogPosts).values(parsed.data).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[api/admin/blog] POST error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
