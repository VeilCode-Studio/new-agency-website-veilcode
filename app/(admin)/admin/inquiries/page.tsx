import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { clientInquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  InquiriesTable,
  type InquiryRow,
} from "@/components/admin/inquiries/InquiriesTable";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  await requireAdmin();

  const rows: InquiryRow[] = await db
    .select({
      id: clientInquiries.id,
      name: clientInquiries.name,
      email: clientInquiries.email,
      service: clientInquiries.service,
      company: clientInquiries.company,
      budget: clientInquiries.budget,
      timeline: clientInquiries.timeline,
      message: clientInquiries.message,
      goals: clientInquiries.goals,
      createAt: clientInquiries.createAt,
    })
    .from(clientInquiries)
    .orderBy(desc(clientInquiries.createAt));

  return (
    <>
      <PageHeader
        title="Inquiries"
        description="All project enquiries submitted through the contact form."
      />
      <InquiriesTable rows={rows} />
    </>
  );
}
