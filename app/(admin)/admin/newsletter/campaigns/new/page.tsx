import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { CampaignForm } from "@/components/admin/newsletter/CampaignForm";

export default async function NewCampaignPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="New campaign"
        description="Compose and send a new newsletter campaign."
      />
      <CampaignForm mode="create" />
    </>
  );
}
