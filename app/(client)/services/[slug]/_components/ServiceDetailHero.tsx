import {
  PublicHero,
  ProjectActions,
  BuildPreview,
} from "@/components/public/PublicHero";
import type { Service } from "@/db/schema";
export function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <PublicHero
      eyebrow={service.title}
      parent={{ label: "Services", href: "/services" }}
      title={service.h1 || service.title}
      description={service.intro}
      aside={<BuildPreview />}
    >
      <ul className="public-tags" aria-label="Capabilities">
        {service.supportingCapabilities.slice(0, 4).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ProjectActions secondaryHref="/services" secondaryLabel="All services" />
    </PublicHero>
  );
}
