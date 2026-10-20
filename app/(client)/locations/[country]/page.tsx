import { notFound } from "next/navigation";
import {
  getAllProjects,
  getPublishedSeoPages,
  getPublishedServices,
} from "@/queries";
import { getLocationMarket, getMarketCountryCode } from "@/constants/locations";
import { StructuredData } from "@/lib/seo/StructuredData";
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";
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

  return {
    ...buildPageMetadata({
      title: market.metaTitle,
      description: market.metaDescription,
      path: `/locations/${market.slug}`,
      image: market.ogImage,
    }),
    keywords: [],
  };
}

export default async function LocationPage({ params }: Params) {
  const { country } = await params;
  const market = getLocationMarket(country);

  if (!market) return notFound();

  const [servicesResult, projectsResult, seoPagesResult] =
    await Promise.allSettled([
      getPublishedServices(),
      getAllProjects(),
      getPublishedSeoPages(),
    ]);

  const servicesUnavailable = servicesResult.status === "rejected";
  const projectsUnavailable = projectsResult.status === "rejected";
  const services =
    servicesResult.status === "fulfilled" ? servicesResult.value : [];
  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value : [];

  if (servicesUnavailable) {
    console.error(
      "[locations] failed to load services:",
      servicesResult.reason,
    );
  }

  if (projectsUnavailable) {
    console.error(
      "[locations] failed to load projects:",
      projectsResult.reason,
    );
  }

  const relevantServices = services.filter((service) =>
    market.serviceFocus.includes(service.id),
  );

  // Link back to every published SEO page targeting this market's country.
  const marketCountryCode = getMarketCountryCode(market);
  const marketSeoPages =
    seoPagesResult.status === "fulfilled" && marketCountryCode
      ? seoPagesResult.value.filter(
          (page) => page.countryCode?.toUpperCase() === marketCountryCode,
        )
      : [];

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
      <StructuredData
        data={localBusinessJsonLd({
          name: SITE_NAME,
          description: market.metaDescription,
          path: `/locations/${market.slug}`,
          schemaType: market.schemaType,
          areaServed: market.areaServed,
          addressLocality: market.addressLocality,
          addressCountry: market.addressCountry,
        })}
      />
      <LocationHero market={market} />
      <LocationBody
        market={market}
        services={relevantServices}
        projects={projects}
        seoPages={marketSeoPages}
        servicesUnavailable={servicesUnavailable}
        projectsUnavailable={projectsUnavailable}
      />
    </>
  );
}
