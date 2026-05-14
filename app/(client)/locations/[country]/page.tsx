import { notFound } from "next/navigation";
import { getAllProjects, getPublishedServices } from "@/queries";
import { getLocationMarket } from "@/constants/locations";
import { StructuredData } from "@/lib/seo/StructuredData";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LocationBody } from "./_components/LocationBody";
import { LocationHero } from "./_components/LocationHero";

interface Params {
  params: Promise<{ country: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params) {
  const { country } = await params;
  const market = getLocationMarket(country);

  if (!market) return {};

  return buildPageMetadata({
    title: market.metaTitle,
    description: market.metaDescription,
    path: `/locations/${market.slug}`,
  });
}

export default async function LocationPage({ params }: Params) {
  const { country } = await params;
  const market = getLocationMarket(country);

  if (!market) return notFound();

  const [services, projects] = await Promise.all([
    getPublishedServices(),
    getAllProjects(),
  ]);
  const relevantServices = services.filter((service) =>
    market.serviceFocus.includes(service.id),
  );

  return (
    <>
      <StructuredData
        data={webPageJsonLd({
          name: market.metaTitle,
          description: market.metaDescription,
          path: `/locations/${market.slug}`,
        })}
      />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: market.countryName, href: `/locations/${market.slug}` },
        ])}
      />
      <LocationHero market={market} />
      <LocationBody market={market} services={relevantServices} projects={projects} />
    </>
  );
}
