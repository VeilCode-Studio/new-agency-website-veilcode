import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import {
  formatTestimonialValidationError,
  testimonialInputSchema,
} from "@/lib/testimonials/validation";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/admin/testimonials] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = testimonialInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatTestimonialValidationError(parsed.error) },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(testimonials)
      .values(parsed.data)
      .returning();

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[api/admin/testimonials] POST error:", err);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
