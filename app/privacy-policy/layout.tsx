import { AnimationBoundary } from "@/components/providers/AnimationBoundary";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/site";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How VeilCode Studio collects, uses and protects personal information shared through veilcode.studio.",
  path: "/privacy-policy",
  image: DEFAULT_OG_IMAGE,
});

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AnimationBoundary><main>{children}</main></AnimationBoundary>;
}
