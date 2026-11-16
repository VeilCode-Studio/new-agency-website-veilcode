import type { Metadata } from "next";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  pageUrl,
  SITE_NAME,
  TITLE_SUFFIX,
} from "./site";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
};

function titleIncludesBrand(title: string) {
  return /\bVeilCode\b/i.test(title);
}

/**
 * The exact title a page renders with. Titles that already name the brand are
 * used as-is; everything else gets the site suffix, matching the root
 * template. The same string is used for <title>, og:title and twitter:title.
 */
export function fullPageTitle(title: string) {
  return titleIncludesBrand(title) ? title : `${title}${TITLE_SUFFIX}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = pageUrl(path);
  const fullTitle = fullPageTitle(title);
  const imageUrl = image ? absoluteUrl(image) : absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}
