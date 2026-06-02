import { requireAdmin } from "@/lib/auth/admin";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  await requireAdmin();

  return <TestimonialForm mode="create" />;
}
