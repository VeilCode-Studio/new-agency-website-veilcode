import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterCampaigns } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { CampaignForm, type CampaignFormData } from "@/components/admin/newsletter/CampaignForm";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({
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
    .from(newsletterCampaigns)
    .where(eq(newsletterCampaigns.id, numId));

  if (!row) notFound();

  const initialData: CampaignFormData = {
    subject:     row.subject,
    previewText: row.previewText,
    type:        row.type as CampaignFormData["type"],
    body:        row.body ?? [],
  };

  return (
    <>
      <PageHeader
        title={row.status === "sent" ? "View campaign" : "Edit campaign"}
        description={
          row.status === "sent"
            ? `Sent to ${row.sentCount.toLocaleString()} subscriber${row.sentCount === 1 ? "" : "s"}.`
            : "Compose your campaign, then send it to all confirmed subscribers."
        }
      />
      <CampaignForm
        mode="edit"
        id={row.id}
        initialData={initialData}
        status={row.status}
        sentAt={row.sentAt}
        sentCount={row.sentCount}
        failedCount={row.failedCount}
      />
    </>
  );
}
