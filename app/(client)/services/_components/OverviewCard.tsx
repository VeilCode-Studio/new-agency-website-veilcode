import Link from "next/link";
import type { Service } from "@/db/schema";
export function OverviewCard({ card }: { card: Service; index: number }) {
  const href =
    card.seoEnabled && card.slug ? `/services/${card.slug}` : `#${card.id}`;
  return (
    <Link href={href} className="public-service-card">
      <span aria-hidden="true">{card.icon}</span>
      <span className="public-eyebrow">{card.tagline}</span>
      <h3>{card.title}</h3>
      <p className="text-sm leading-relaxed">{card.desc}</p>
      <ul>
        {card.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <b>
        Explore {card.title.toLowerCase()}{" "}
        <span aria-hidden="true">&#8599;</span>
      </b>
    </Link>
  );
}
