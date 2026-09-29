import type { Metadata } from "next";

// One-off transactional pages (confirmed / expired / invalid): keep them out
// of the index. The pages are client components, so this lives in the layout.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function NewsletterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
