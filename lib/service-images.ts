export type ServiceHeroImage = {
  heroSrc: string | null;
  heroAlt: string | null;
  heroTitle: string | null;
};

const defaults: Record<string, ServiceHeroImage> = {
  web: {
    heroSrc: "/images/services/web-development.webp",
    heroAlt: "Laptop and browser preview showing a responsive website in lavender, mint and peach",
    heroTitle: "Custom website design and development",
  },
  mobile: {
    heroSrc: "/images/services/mobile-app-development.webp",
    heroAlt: "Two smartphones displaying a booking app and a mobile dashboard",
    heroTitle: "Mobile application design and development",
  },
  ai: {
    heroSrc: "/images/services/ai-automation.webp",
    heroAlt: "Connected chat, microphone, assistant, calendar and workflow tiles illustrating business automation",
    heroTitle: "AI assistants and workflow automation",
  },
};

export function isServiceImageSource(src: string): boolean {
  if (/^\/images\/services\/[a-zA-Z0-9_-]+\.(webp|avif|png|jpe?g)$/.test(src)) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com"
      && !url.port && !url.username && !url.password && !url.search && !url.hash
      && /^\/[^/]+\/image\/upload\/.+\.(webp|avif|png|jpe?g)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

/** CMS overrides are optional; clearing one restores the generated service default. */
export function getServiceHeroImage(service: Partial<ServiceHeroImage> & { id: string; title: string }): ServiceHeroImage | null {
  if (service.heroSrc && isServiceImageSource(service.heroSrc)) {
    return {
      heroSrc: service.heroSrc,
      heroAlt: service.heroAlt?.trim() || `${service.title} service illustration`,
      heroTitle: service.heroTitle?.trim() || service.title,
    };
  }
  return Object.hasOwn(defaults, service.id) ? defaults[service.id] : null;
}
