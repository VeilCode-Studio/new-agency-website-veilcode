"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

type PixelWindow = Window & { fbq?: (...args: unknown[]) => void };

// A future consent UI can store this preference and dispatch this event.
const CONSENT_KEY = "veilcode-marketing-consent";

export function MetaPixelClient({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => {
      let granted = false;
      try { granted = localStorage.getItem(CONSENT_KEY) === "granted"; } catch { /* Storage may be blocked. */ }
      setConsented(granted);
      (window as PixelWindow).fbq?.("consent", granted ? "grant" : "revoke");
    };
    sync();
    window.addEventListener("veilcode:marketing-consent", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("veilcode:marketing-consent", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!consented || !ready) return;
    const page = window.location.href;
    if (lastPage.current === page) return;
    (window as PixelWindow).fbq?.("track", "PageView");
    lastPage.current = page;
  }, [consented, ready, pathname]);

  if (!consented) return null;

  return (
    <Script id="facebook-pixel" strategy="lazyOnload" onReady={() => setReady(true)}>
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');`}
    </Script>
  );
}
