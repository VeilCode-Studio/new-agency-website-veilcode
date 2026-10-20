import { useEffect, useRef } from "react";
import Link from "next/link";
import { LogoMark, PrimaryButton, WordMark } from "./Primitives";
import { NAV_LINKS } from "@/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLElement>(null);
  /* Lock scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const controls = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
    const frame = requestAnimationFrame(() =>
      controls()[0]?.focus({ preventScroll: true }),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const elements = controls();
      const first = elements[0];
      const last = elements.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <>
      {open && (
        <>
          {/* Backdrop */}
          <div
            key="backdrop"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-page/80 backdrop-blur-sm"
            aria-hidden
          />

          {/* Drawer panel */}
          <aside
            ref={panel}
            key="drawer"
            className="drawer-enter fixed top-0 left-0 z-50 flex flex-col
              h-dvh w-80 max-w-[88vw] sm:w-90
              bg-surface border-r border-line
              shadow-[4px_0_40px_rgba(0,0,0,0.6)]"
            aria-label="Mobile navigation"
            aria-modal="true"
            role="dialog"
            id="mobile-navigation"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-18 border-b border-line shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2.5 no-underline"
                onClick={onClose}
              >
                <LogoMark size={28} />
                <WordMark />
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle size="sm" />
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="flex items-center justify-center size-11 rounded-md
                    border border-line text-ink-muted
                    hover:border-line-hi hover:text-ink
                    transition-colors duration-200 cursor-pointer
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M1 1l12 12M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-4 py-6 gap-1 flex-1 overflow-y-auto">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3.5 rounded-lg
                    font-sans text-base font-normal text-ink-muted
                    hover:text-ink hover:bg-surface-hi
                    transition-colors duration-150 no-underline group"
                >
                  <span>{label}</span>
                  <span className="text-ink-faint transition-colors duration-150 group-hover:text-brand text-sm">
                    →
                  </span>
                </Link>
              ))}
            </nav>

            {/* Drawer footer CTA */}
            <div className="px-6 py-6 border-t border-line shrink-0">
              <div>
                <PrimaryButton
                  asChild
                  className="w-full justify-center py-3!"
                  onClick={onClose}
                >
                  <Link href={"/start"}>Start a Project →</Link>
                </PrimaryButton>
              </div>
              <p className="text-center font-mono text-[10px] tracking-widest uppercase text-ink-faint mt-4">
                support@veilcode.studio
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
