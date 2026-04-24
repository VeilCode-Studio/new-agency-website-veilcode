import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db/drizzle";
import { newsletterCampaigns } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  CampaignsTable,
  CampaignStats,
  type CampaignRow,
} from "@/components/admin/newsletter/CampaignsTable";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  await requireAdmin();

  let rows: CampaignRow[] = [];
  try {
    rows = await db
      .select()
      .from(newsletterCampaigns)
      .orderBy(desc(newsletterCampaigns.createdAt)) as CampaignRow[];
  } catch (err) {
    console.error("[admin/newsletter/campaigns]", err);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Campaigns"
          description="All newsletter campaigns — drafts and sent."
        />
        <Link
          href="/admin/newsletter/campaigns/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> New campaign
        </Link>
      </div>
      <CampaignStats rows={rows} />
      <CampaignsTable rows={rows} />
    </>
  );
}
