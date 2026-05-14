"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  FileText,
  BookOpenText,
  UserRoundSearch,
  Inbox,
  Mail,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",            label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/projects",   label: "Projects",    icon: Briefcase },
  { href: "/admin/services",   label: "Services",    icon: Sparkles },
  { href: "/admin/seo-pages",  label: "SEO Pages",   icon: BookOpenText },
  { href: "/admin/blog",       label: "Blog",        icon: FileText },
  { href: "/admin/careers",    label: "Careers",     icon: UserRoundSearch },
  { href: "/admin/inquiries",  label: "Inquiries",   icon: Inbox },
  { href: "/admin/newsletter", label: "Newsletter",  icon: Mail },
  { href: "/admin/access",     label: "Team Access", icon: ShieldCheck },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "hidden shrink-0 transition-all duration-300 md:block",
        isCollapsed ? "w-16" : "w-60",
      )}
    >
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex h-dvh flex-col border-r border-line bg-surface/40 py-5 transition-all duration-300",
          isCollapsed ? "w-16 px-2" : "w-60 px-3",
        )}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-10 flex size-6 items-center justify-center rounded-full border border-line bg-surface text-ink-muted hover:text-ink shadow-sm transition-transform hover:scale-105 cursor-pointer"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </button>

        <Link href="/admin" className={cn("mb-6 flex items-center gap-2", isCollapsed ? "justify-center px-0" : "px-2")}>
          <span className="grid size-7 shrink-0 place-items-center rounded-md border border-brand-border bg-brand-dim font-display text-sm font-bold text-brand">
            V
          </span>
          {!isCollapsed && (
            <span className="font-display text-sm font-semibold tracking-wide text-ink truncate transition-opacity duration-300">
              VeilCode Admin
            </span>
          )}
        </Link>

        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={isCollapsed ? label : undefined}
                className={cn(
                  "group flex items-center rounded-md text-sm transition-colors",
                  isCollapsed ? "justify-center p-2" : "gap-2.5 px-2.5 py-2",
                  active
                    ? "bg-brand-dim text-brand"
                    : "text-ink-muted hover:bg-surface-hi hover:text-ink",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="mt-auto rounded-md border border-line bg-surface px-3 py-2.5 text-[11px] leading-relaxed text-ink-faint truncate transition-opacity duration-300">
            VeilCode internal. Do not share credentials.
          </div>
        )}
      </aside>
    </div>
  );
}
