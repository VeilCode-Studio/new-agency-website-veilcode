import type { Metadata } from "next";
import { absoluteUrl, canonicalPath } from "./site";

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

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: BuildMetadataInput): Metadata {
  const canonical = canonicalPath(path);
  const imageUrl = image ? absoluteUrl(image) : absoluteUrl("/assets/logo.png");

  return {
    title: titleIncludesBrand(title) ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      siteName: "VeilCode",
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
      title,
      description,
      images: [imageUrl],
    },
  };
}
