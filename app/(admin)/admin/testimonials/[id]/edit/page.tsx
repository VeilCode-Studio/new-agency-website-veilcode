import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const testimonialId = Number(id);
  if (!Number.isInteger(testimonialId)) notFound();

  const [row] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, testimonialId))
    .limit(1);

  if (!row) notFound();

  return (
    <TestimonialForm
      mode="edit"
      id={testimonialId}
      initialData={{
        name: row.name,
        role: row.role,
        company: row.company,
        quote: row.quote,
        avatar: row.avatar,
      }}
    />
  );
}
