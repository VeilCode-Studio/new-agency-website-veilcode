import type { Metadata } from "next";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Admin Access",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className="grid min-h-dvh items-start bg-page text-ink lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
        <AuthBrandPanel />
        <main className="flex min-h-dvh flex-col">
          {/* mobile brand bar */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-md border border-brand-border bg-brand-dim font-display text-sm font-bold text-brand">
                V
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-sm font-semibold tracking-wide text-ink">
                  VeilCode
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ink-muted">
                  Admin Console
                </span>
              </div>
            </div>
            <a
              href="/"
              className="text-[11px] uppercase tracking-widest text-ink-muted hover:text-ink"
            >
              ← Site
            </a>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
            <div className="w-full max-w-110">{children}</div>
          </div>

          <div className="hidden border-t border-line px-10 py-4 text-[11px] uppercase tracking-widest text-ink-faint lg:block">
            © {new Date().getFullYear()} VeilCode · Admin console
          </div>
        </main>
      </div>
    </ClerkProvider>
  );
}
