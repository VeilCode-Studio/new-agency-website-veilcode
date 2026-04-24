import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import type { AdminContext } from "@/lib/auth/admin";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemedUserButton } from "@/components/auth/ThemedUserButton";

export function AdminHeader({ admin }: { admin: AdminContext }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-base/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink">
          ← Back to site
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle size="sm" />
        <div className="hidden text-right sm:block">
          <div className="text-xs font-medium text-ink">{admin.name ?? admin.email}</div>
          <div className="text-[11px] text-ink-muted">{admin.email}</div>
        </div>
        <ThemedUserButton />
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="rounded-md border border-line px-2.5 py-1 text-xs text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>
    </header>
  );
}
