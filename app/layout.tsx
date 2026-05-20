import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StructuredData } from "@/lib/seo/StructuredData";
import { organizationJsonLd } from "@/lib/seo/jsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Digital Solutions Agency`,
    template: "%s | VeilCode"
  },
  description: "VeilCode builds websites, web apps, mobile apps, AI automation systems, and analytics tools for growing businesses",

  keywords: [
    "Next.js development",
    "AI automation",
    "web development",
    "software engineering",
    "LangGraph AI agents",
    "Website development",
    "Data Analysis Services",
    "Social Media Marketing",
    "Mobile Applications development"
  ],

  openGraph: {
    title: "VeilCode Digital Solutions Agency",
    description:
      "VeilCode builds websites, web apps, mobile apps, AI automation systems, analytics tools, and digital marketing systems.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/assets/nexus-project/image-client-1.jpg",
        width: 1200,
        height: 630,
        alt: "VeilCode digital product showcase",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "VeilCode Digital Solutions Agency",
    description:
      "VeilCode builds websites, web apps, mobile apps, AI automation systems, analytics tools, and digital marketing systems.",
    images: ["/assets/nexus-project/image-client-1.jpg"],
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
