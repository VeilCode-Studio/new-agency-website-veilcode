import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { seoPages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { SeoPageForm, type SeoPageFormData } from "@/components/admin/seo-pages/SeoPageForm";
import { serializeSeoBody } from "@/lib/seo/seoPages";

export const dynamic = "force-dynamic";

export default async function EditSeoPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) notFound();

  const [row] = await db
    .select()
    .from(seoPages)
    .where(eq(seoPages.id, numId))
    .limit(1);

  if (!row) notFound();

  const initialData: SeoPageFormData = {
    slug: row.slug,
    pageType: row.pageType as SeoPageFormData["pageType"],
    countryCode: row.countryCode ?? "",
    countryName: row.countryName ?? "",
    serviceId: row.serviceId ?? "",
    title: row.title,
    metaDescription: row.metaDescription,
    h1: row.h1,
    heroCopy: row.heroCopy,
    bodyText: serializeSeoBody(row.body ?? []),
    faqs: row.faqs ?? [],
    ctaLabel: row.cta?.label ?? "Let's Discuss your Project",
    ctaHref: row.cta?.href ?? "/start",
    relatedServiceIds: row.relatedServiceIds ?? [],
    relatedProjectSlugs: row.relatedProjectSlugs ?? [],
    relatedBlogSlugs: row.relatedBlogSlugs ?? [],
    published: row.published,
    indexable: row.indexable,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <SeoPageForm mode="edit" id={row.id} initialData={initialData} />
    </div>
  );
}
