import { requireAdmin } from "@/lib/auth/admin";
import { ServiceForm } from "@/components/admin/services/ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <ServiceForm mode="create" />
    </div>
  );
}
