import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { jobOpenings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { JobForm } from "@/components/admin/careers/JobForm";
import type { JobFormData } from "@/components/admin/careers/JobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const [row] = await db
    .select()
    .from(jobOpenings)
    .where(eq(jobOpenings.id, numId))
    .limit(1);

  if (!row) notFound();

  const initialData: JobFormData = {
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    experience: row.experience,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    published: row.published,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <JobForm mode="edit" id={row.id} initialData={initialData} />
    </div>
  );
}
