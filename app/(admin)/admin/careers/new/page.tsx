import { requireAdmin } from "@/lib/auth/admin";
import { JobForm } from "@/components/admin/careers/JobForm";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <JobForm mode="create" />
    </div>
  );
}
