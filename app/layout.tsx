import type { Metadata } from "next";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StructuredData } from "@/lib/seo/StructuredData";
import { organizationJsonLd } from "@/lib/seo/jsonLd";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TITLE_SUFFIX,
} from "@/lib/seo/site";

const ROOT_TITLE = "VeilCode Studio | Web, Mobile & AI Automation from Kampala";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: ROOT_TITLE,
    template: `%s${TITLE_SUFFIX}`,
  },
  description: SITE_DESCRIPTION,

  keywords: [
    "Next.js development",
    "AI automation",
    "web development",
    "software engineering",
    "Website development",
    "Mobile Applications development"
  ],

  openGraph: {
    title: ROOT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "VeilCode digital product showcase",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={organizationJsonLd()} />
        <noscript><style>{`[style*="opacity:0;"], [style$="opacity:0"], [style*="opacity: 0;"] { opacity: 1 !important; transform: none !important; }`}</style></noscript>

      </head>
      <body
        className="antialiased"
      >
        <MetaPixel />
        <ThemeProvider>
          <div id="top" className="max-w-400 mx-auto">
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
