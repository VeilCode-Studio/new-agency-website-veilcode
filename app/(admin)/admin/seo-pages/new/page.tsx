import { requireAdmin } from "@/lib/auth/admin";
import { SeoPageForm } from "@/components/admin/seo-pages/SeoPageForm";

export const dynamic = "force-dynamic";

export default async function NewSeoPagePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <SeoPageForm mode="create" />
    </div>
  );
}
