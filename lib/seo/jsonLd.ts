import { absoluteUrl, SITE_NAME, SITE_URL } from "./site";

type BreadcrumbItem = {
  name: string;
  href: string;
};

type ArticleJsonLdInput = {
  title: string;
  description: string;
  path: string;
  publishedAt: Date;
  updatedAt?: Date | null;
  authorName: string;
  image?: string | null;
};

type WebPageJsonLdInput = {
  name: string;
  description: string;
  path: string;
};

type ServiceJsonLdInput = {
  name: string;
  description: string;
  path: string;
  areaServed?: string | string[];
};

type LocalBusinessJsonLdInput = {
  name: string;
  description: string;
  path: string;
  schemaType?: "LocalBusiness" | "ProfessionalService";
  areaServed?: string | string[];
  addressLocality?: string;
  addressCountry?: string;
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VeilCode",
    url: SITE_URL,
    logo: absoluteUrl("/assets/logo.png"),
    founder: {
      "@type": "Person",
      name: "Frank Tamale",
    },
    sameAs: [
      "https://facebook.com/veilcode",
      "https://instagram.com/veilcodestudio",
    ],
  };
}

export function webPageJsonLd({ name, description, path }: WebPageJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  publishedAt,
  updatedAt,
  authorName,
  image,
}: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished: publishedAt.toISOString(),
    dateModified: (updatedAt ?? publishedAt).toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/assets/logo.png"),
      },
    },
    image: image ? [absoluteUrl(image)] : [absoluteUrl("/assets/logo.png")],
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
  areaServed = "Global",
}: ServiceJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed,
  };
}

export function localBusinessJsonLd({
  name,
  description,
  path,
  schemaType = "ProfessionalService",
  areaServed,
  addressLocality,
  addressCountry,
}: LocalBusinessJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name,
    description,
    url: absoluteUrl(path),
    address:
      addressLocality || addressCountry
        ? {
            "@type": "PostalAddress",
            addressLocality,
            addressCountry,
          }
        : undefined,
    areaServed: areaServed || addressCountry || "Global",
  };
}
