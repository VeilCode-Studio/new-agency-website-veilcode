import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { blogPosts } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

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
    const body = await req.json();
    // Ensure publishedAt is a Date object for the timestamp column
    const values = {
      ...body,
      publishedAt: new Date(body.publishedAt),
    };
    const [created] = await db.insert(blogPosts).values(values).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[api/admin/blog] POST error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
