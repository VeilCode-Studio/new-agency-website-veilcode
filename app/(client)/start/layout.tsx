import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Start a Project",
  description:
    "Share your website, mobile app, AI automation, or analytics brief with VeilCode and get a tailored project proposal.",
  path: "/start",
  image: "/assets/nexus-project/image-client-1.jpg",
});

export default function StartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
