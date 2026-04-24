import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.id));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/admin/projects] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const [created] = await db.insert(projects).values(body).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[api/admin/projects] POST error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
