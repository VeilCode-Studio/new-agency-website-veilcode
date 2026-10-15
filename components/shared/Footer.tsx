"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark, WordMark } from "@/components/extras/Primitives";
import { FOOTER_COLS } from "@/constants";
import FooterSocials from "../extras/FooterSocials";
import { ArrowUp } from "lucide-react";


export function Footer() {
  const pathname = usePathname();

  if (pathname === "/start" || pathname.includes("/newsletter")) return null;
  return (
    <footer className="border-t border-line bg-surface pt-16 pb-10 px-6 md:px-10">
      <div className="max-w-30Link mx-auto relative z-5">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 mb-16">

          {/* Brand column */}
          <div>
            <Link href="/" prefetch={false} className="flex items-center gap-2.5 no-underline mb-5">
              <LogoMark size={28} />
              <WordMark />
            </Link>

            <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-70 mb-6">
              Founder-led studio in Kampala building web platforms, mobile apps
              and AI automation.
            </p>

            <FooterSocials />
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint mb-5">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="font-sans text-sm text-ink-muted no-underline
                        hover:text-ink transition-colors duration-150"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-line pt-7 flex flex-col sm:flex-row
          justify-between items-center gap-4 text-center">
          <p className="font-sans text-[13px] text-ink-faint">
            &copy; {new Date().getFullYear()} VeilCode. All rights reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint">
            Built with precision &middot; Deployed with purpose
          </p>
        </div>
      </div>
      {/* can you better position and make it better in general */}
      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 left-6 z-50
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-brand text-black
        shadow-lg shadow-black/20
        hover:scale-110 hover:bg-brand/90
        transition-[transform,background-color] duration-300 ease-out"
      >
        <ArrowUp size={20} aria-hidden="true" />
      </a>
    </footer>
  );
}
