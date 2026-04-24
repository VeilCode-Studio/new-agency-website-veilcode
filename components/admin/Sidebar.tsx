"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  FileText,
  UserRoundSearch,
  Inbox,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",            label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/projects",   label: "Projects",    icon: Briefcase },
  { href: "/admin/services",   label: "Services",    icon: Sparkles },
  { href: "/admin/blog",       label: "Blog",        icon: FileText },
  { href: "/admin/careers",    label: "Careers",     icon: UserRoundSearch },
  { href: "/admin/inquiries",  label: "Inquiries",   icon: Inbox },
  { href: "/admin/newsletter", label: "Newsletter",  icon: Mail },
  { href: "/admin/access",     label: "Team Access", icon: ShieldCheck },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-line bg-surface/40 px-3 py-5 md:flex md:flex-col">
      <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
        <span className="grid size-7 place-items-center rounded-md border border-brand-border bg-brand-dim font-display text-sm font-bold text-brand">
          V
        </span>
        <span className="font-display text-sm font-semibold tracking-wide text-ink">
          VeilCode Admin
        </span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-brand-dim text-brand"
                  : "text-ink-muted hover:bg-surface-hi hover:text-ink",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-md border border-line bg-surface px-3 py-2.5 text-[11px] leading-relaxed text-ink-faint">
        VeilCode internal. Do not share credentials.
      </div>
    </aside>
  );
}
