import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/admin";
import {
  formatTestimonialValidationError,
  testimonialInputSchema,
} from "@/lib/testimonials/validation";

export const runtime = "nodejs";

function parseId(id: string) {
  const value = Number(id);
  return Number.isInteger(value) ? value : null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const testimonialId = parseId(id);
  if (testimonialId === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const [row] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, testimonialId))
      .limit(1);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/admin/testimonials/[id]] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const testimonialId = parseId(id);
  if (testimonialId === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = testimonialInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatTestimonialValidationError(parsed.error) },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(testimonials)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(testimonials.id, testimonialId))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[api/admin/testimonials/[id]] PUT error:", err);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const testimonialId = parseId(id);
  if (testimonialId === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await db.delete(testimonials).where(eq(testimonials.id, testimonialId));
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/admin/testimonials/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
