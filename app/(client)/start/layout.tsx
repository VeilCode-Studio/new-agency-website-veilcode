import { AnimationBoundary } from "@/components/providers/AnimationBoundary";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Start a Project",
  description:
    "Share your website, mobile app, AI automation, or analytics brief with VeilCode and get a tailored project proposal.",
  path: "/start",
  image: DEFAULT_OG_IMAGE,
});

export default function StartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AnimationBoundary>{children}</AnimationBoundary>;
}
