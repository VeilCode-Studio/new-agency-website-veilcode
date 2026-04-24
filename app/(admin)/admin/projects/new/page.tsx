import { requireAdmin } from "@/lib/auth/admin";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <ProjectForm mode="create" />
    </div>
  );
}
