"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoMark, WordMark } from "@/components/extras/Primitives";
import Link from "next/link";
import { Button } from "../ui/button";
import { MobileDrawer } from "../extras/MobileDrawer";
import { NAV_LINKS } from "@/constants";
import { ThemeToggle } from "../ui/ThemeToggle";

function DesktopNavLink({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const hrefPath = href.split("#")[0];
  const active =
    hrefPath === "/"
      ? pathname === "/" && !href.includes("#")
      : pathname.startsWith(hrefPath);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="relative group font-sans text-sm font-normal tracking-wide
        text-ink-muted transition-colors duration-200 whitespace-nowrap
        hover:text-ink no-underline"
    >
      {label}
      <span
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand
          transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-250 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ transform: active ? "scaleX(1)" : undefined }}
      />
    </Link>
  );
}

function HamburgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-navigation"
      className="relative flex flex-col justify-center items-center
        size-11 rounded-md border border-line bg-transparent
        cursor-pointer transition-colors duration-200
        hover:border-line-hi hover:bg-surface-hi
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-brand focus-visible:ring-offset-2
        focus-visible:ring-offset-page"
    >
      <span
        className={`block h-[1.5px] w-5 bg-ink-muted rounded-full
          transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300 origin-center
          ${open ? "translate-y-0.75 rotate-45" : "-translate-y-0.75"}`}
      />
      <span
        className={`block h-[1.5px] w-5 bg-ink-muted rounded-full
          transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300
          ${open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`}
      />
      <span
        className={`block h-[1.5px] w-5 bg-ink-muted rounded-full
          transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300 origin-center
          ${open ? "-translate-y-0.75 -rotate-45" : "translate-y-0.75"}`}
      />
    </Button>
  );
}

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/start" || pathname.includes("/newsletter")) return null;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 ${isHome ? "home-navigation" : pathname.startsWith("/locations") ? "location-navigation" : "public-navigation"}
          h-16 sm:h-18 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-400
          ${
            scrolled
              ? "bg-page/90 backdrop-blur-xl border-b border-line"
              : "bg-transparent"
          }`}
        id="navbar"
      >
        <div className="mx-auto flex h-full w-full max-w-350 items-center justify-between px-4 sm:px-6 md:px-10">
          {/* Logo */}
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2.5 no-underline shrink-0"
          >
            <LogoMark size={32} />
            <WordMark />
          </Link>

          {/* Desktop links — hidden on mobile */}
          <nav
            className="hidden xl:flex items-center gap-7 2xl:gap-9"
            aria-label="Primary"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <DesktopNavLink key={label} label={label} href={href} />
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle
              size="sm"
              className="[&>button]:size-11 sm:[&>button]:size-8"
            />

            <Link
              href="/start"
              className="hidden xl:inline-flex items-center gap-1.5
              font-sans text-[13px] font-medium px-5 py-2.5 rounded-lg
              border border-brand text-brand no-underline
              hover:bg-brand hover:text-page
              hover:shadow-[0_0_20px_var(--color-brand-glow)]
              transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200"
            >
              Start a Project →
            </Link>

            {/* Hamburger — visible on mobile only */}
            <div className="xl:hidden">
              <HamburgerButton
                open={drawerOpen}
                onClick={() => setDrawerOpen((v) => !v)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
