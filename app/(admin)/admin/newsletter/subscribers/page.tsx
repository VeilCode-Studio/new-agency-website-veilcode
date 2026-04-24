import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { newsletterSubscriptionTable } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  SubscribersTable,
  type SubscriberRow,
} from "@/components/admin/newsletter/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  await requireAdmin();

  let rows: SubscriberRow[] = [];
  try {
    rows = await db
      .select()
      .from(newsletterSubscriptionTable)
      .orderBy(desc(newsletterSubscriptionTable.createdAt));
  } catch (err) {
    console.error("[admin/newsletter/subscribers]", err);
  }

  return (
    <>
      <PageHeader
        title="Subscribers"
        description="Everyone who has signed up for the VeilCode newsletter."
      />
      <SubscribersTable rows={rows} />
    </>
  );
}
