import Image from "next/image";
import { getServiceHeroImage } from "@/lib/service-images";
import { publicImageSource } from "@/lib/public-image";
import {
  PublicHero,
  ProjectActions,
  BuildPreview,
} from "@/components/public/PublicHero";
import type { Service } from "@/db/schema";
export function ServiceDetailHero({ service }: { service: Service }) {
  const image = getServiceHeroImage(service);
  return (
    <PublicHero
      eyebrow={service.title}
      parent={{ label: "Services", href: "/services" }}
      title={service.h1 || service.title}
      description={service.intro}
      aside={image?.heroSrc ? (
        <div className="public-service-image">
          <Image
            src={publicImageSource(image.heroSrc)}
            alt={image.heroAlt || service.title}
            title={image.heroTitle || service.title}
            width={1536}
            height={1024}
            sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1264px) 44vw, 530px"
            preload
          />
        </div>
      ) : <BuildPreview />}
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
