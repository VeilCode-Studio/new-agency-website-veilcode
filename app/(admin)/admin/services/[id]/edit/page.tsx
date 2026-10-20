import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import type { ServiceFormData } from "@/components/admin/services/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const [row] = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);

  if (!row) notFound();

  const initialData: ServiceFormData = {
    id: row.id,
    number: row.number,
    icon: row.icon,
    title: row.title,
    slug: row.slug,
    seoTitle: row.seoTitle,
    metaDescription: row.metaDescription,
    h1: row.h1,
    heroSrc: row.heroSrc,
    heroAlt: row.heroAlt,
    heroTitle: row.heroTitle,
    tagline: row.tagline,
    desc: row.desc,
    intro: row.intro,
    challenge: row.challenge,
    approach: row.approach,
    bullets: row.bullets ?? [],
    deliverables: row.deliverables ?? [],
    stack: row.stack ?? [],
    tags: row.tags ?? [],
    metric: row.metric,
    metricLabel: row.metricLabel,
    metricSub: row.metricSub,
    supportingCapabilities: row.supportingCapabilities ?? [],
    faqs: row.faqs ?? [],
    seoEnabled: row.seoEnabled,
    cardClasses: row.cardClasses,
    overviewClasses: row.overviewClasses,
    deepDiveClasses: row.deepDiveClasses,
    sortOrder: row.sortOrder,
    published: row.published,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <ServiceForm mode="edit" id={row.id} initialData={initialData} />
    </div>
  );
}
