import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://veilcode.studio"),
  title: {
    default: "VeilCode Digital Solutions Agency - AI, Web development, Data Analytics, Mobile Applications Development & Automation",
    template: "%s | VeilCode"
  },
  description: "VeilCode builds high-performance web applications,and Mobile Applications,  AI automation systems, Data Analytics and Digital Marketing",

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
    title: "VeilCode - Digital Solutions agency - builds high performance digital products - Websites and Web applications, Mobile Apps, Data Analytics tools, AI Automated systems, and Digital Marketing.",
    description: "VeilCode - Digital Solutions agency - builds high performance digital products - Websites and Web applications, Mobile Apps, Data Analytics tools, AI Automated systems, and Digital Marketing.",
    url: "https://veilcode.studio",
    siteName: "VeilCode",
    images: [
      {
        url: "/assets/logo.png",
        width: 100,
        height: 100
      },
      {
        url: "/assets/nexus-project/image-client-1.jpg",
        width: 1200,
        height: 630
      },
      {
        url: "/assets/agridata-project/image-1.jpg",
        width: 1200,
        height: 630
      },
      {
        url: "/assets/brewed-coffee-project/image-1.png",
        width: 1200,
        height: 630
      }
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "VeilCode Agency",
    description: "VeilCode builds high-performance web applications,and Mobile Applications,  AI automation systems, Data Analytics and Digital Marketing",
    images: ["/assets/logo.png", "/assets/health-pulse-app/image-1.jpg", "/assets/nexus-project/image-1.jpg"]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Veilcode",
    "url": "https://veilcode.studio",
    "logo": "https://veilcode.studio/assets/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Frank Tamale"
    },
    "sameAs": [
      "https://facebook.com/veilcode",
      "https://instagram.com/veilcodestudio"
    ],
  };


  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <Image
            src="https://www.facebook.com/tr?id=1233482635537855&ev=PageView&noscript=1"
            alt="facebook pixel"
            height="1"
            width="1"
            style={{ display: "none" }}
          />
        </noscript>
        <main className="max-w-400 mx-auto">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
