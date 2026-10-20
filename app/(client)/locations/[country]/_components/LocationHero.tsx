import "server-only";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { LocationMarket } from "@/constants/locations";

export function LocationHero({ market }: { market: LocationMarket }) {
  const stats = (market.stats ?? [market.statLine]).filter(Boolean);
  return (
    <section className="location-hero">
      <div className="location-container">
        <nav className="location-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/locations">Locations</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{market.countryName}</span>
        </nav>
        <div className="location-hero-grid">
          <div className="location-hero-copy">
            <p className="location-eyebrow">{market.eyebrow}</p>
            <h1>{market.h1}</h1>
            <p className="location-intro">{market.heroCopy}</p>
            <div className="location-actions">
              <Link
                className="location-button location-button-primary"
                href={market.primaryCtaHref ?? "/start"}
              >
                {market.primaryCtaLabel ?? "Start a Project"}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link
                className="location-button location-button-outline"
                href={market.secondaryCtaHref ?? "/services"}
              >
                {market.secondaryCtaLabel ?? "Explore services"}
              </Link>
            </div>
          </div>
          <div className="location-studio">
            <div className="location-studio-bar">
              <span className="location-window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>VeilCode / {market.shortName}</span>
            </div>
            <div className="location-studio-image">
              <Image
                src="/images/home/studio-workspace.webp"
                alt="A laptop and engineering workspace, illustrating our digital product studio"
                title="Laptop and engineering workspace"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 700px) calc(100vw - 50px), (max-width: 1000px) 40vw, (max-width: 1264px) 36vw, 462px"
              />
              <span className="location-studio-note">
                Built in Kampala.
                <br />
                Made for your market.
              </span>
            </div>
            <div className="location-studio-caption">
              <MapPin size={17} aria-hidden="true" />
              <span>
                {market.locationBadge ??
                  `Remote delivery · ${market.countryName}`}
              </span>
            </div>
            <div className="location-studio-tags">
              <span>Web platforms</span>
              <span>Mobile apps</span>
              <span>AI systems</span>
            </div>
          </div>
        </div>
        {stats.length > 0 && (
          <ul className="location-trust">
            {stats.map((stat) => (
              <li key={stat}>
                <span aria-hidden="true">✓</span>
                {stat}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
