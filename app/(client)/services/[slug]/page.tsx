import { notFound } from "next/navigation";
import { CTA } from "@/components/shared/CTA";
import { getAllProjects, getPublishedServiceBySlug } from "@/queries";
import { StructuredData } from "@/lib/seo/StructuredData";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ServiceDetailBody } from "./_components/ServiceDetailBody";
import { ServiceDetailFaq } from "./_components/ServiceDetailFaq";
import { ServiceDetailHero } from "./_components/ServiceDetailHero";

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service) return {};

  return buildPageMetadata({
    title: service.seoTitle || service.title,
    description: service.metaDescription || service.desc,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service) return notFound();

  const projects = (await getAllProjects()).filter(
    (project) => project.service === service.id,
  );

  const path = `/services/${service.slug}`;

  return (
    <>
      <StructuredData
        data={serviceJsonLd({
          name: service.title,
          description: service.metaDescription || service.desc,
          path,
        })}
      />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title, href: path },
        ])}
      />
      <ServiceDetailHero service={service} />
      <ServiceDetailBody service={service} projects={projects} />
      <ServiceDetailFaq faqs={service.faqs} />
      <CTA />
    </>
  );
}
