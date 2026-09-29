import type { Metadata } from "next";
import Script from "next/script";
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
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1233482635537855');
          fbq('track', 'PageView');
        `}
        </Script>
      </head>
      <body
        className="antialiased"
      >
        <noscript>
          <img
            src="https://www.facebook.com/tr?id=1233482635537855&ev=PageView&noscript=1"
            alt="facebook pixel"
            height="1"
            width="1"
            style={{ display: "none" }}
          />
        </noscript>
        <ThemeProvider>
          <main className="max-w-400 mx-auto">
            {children}
            <Toaster />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
