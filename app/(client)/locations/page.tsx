import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LOCATION_MARKETS } from "@/constants/locations";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonLd";
import { StructuredData } from "@/lib/seo/StructuredData";

const title = "Locations | Kampala Studio & Remote Digital Product Delivery";
const description =
  "Meet VeilCode in Kampala or work with our digital product studio remotely from the United States, United Kingdom, Canada, and Australia. Explore delivery in your market.";
export const metadata = {
  ...buildPageMetadata({
    title,
    description,
    path: "/locations",
    image: "/assets/og/uganda.jpg",
  }),
  keywords: [],
};

export default function LocationsPage() {
  return (
    <>
      <StructuredData
        data={webPageJsonLd({ name: title, description, path: "/locations" })}
      />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
        ])}
      />
      <section className="location-hub">
        <div className="location-container">
          <p className="location-eyebrow">One studio. A wider perspective.</p>
          <h1>
            Built in Kampala.
            <br />
            Working across borders.
          </h1>
          <p>
            Web platforms, mobile apps, and AI automation, with a delivery model
            that fits your market. Meet us in Uganda or work with the same
            studio remotely.
          </p>
          <div className="location-hub-grid">
            {LOCATION_MARKETS.map((market) => (
              <Link
                className="location-hub-card"
                key={market.slug}
                href={`/locations/${market.slug}`}
              >
                <p className="location-eyebrow">
                  {market.slug === "uganda"
                    ? "Our home studio"
                    : "Remote delivery"}
                </p>
                <h2>
                  {market.countryName}
                  <ArrowUpRight size={24} aria-hidden="true" />
                </h2>
                <p>{market.heroCopy}</p>
                <span className="location-text-link">
                  Explore {market.shortName}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
