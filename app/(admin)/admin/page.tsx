import Link from "next/link";
import { sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db/drizzle";
import {
  admins,
  blogPosts,
  clientInquiries,
  jobOpenings,
  newsletterSubscriptionTable,
  projects,
  services,
} from "@/db/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth/admin";

async function safeCount(table: PgTable, label: string): Promise<number | null> {
  try {
    const [row] = await db.select({ c: sql<number>`count(*)::int` }).from(table);
    return row?.c ?? 0;
  } catch (err) {
    console.warn(`[admin/dashboard] count failed for ${label}:`, err);
    return null;
  }
}

async function getCounts() {
  const [p, s, b, c, i, n, a] = await Promise.all([
    safeCount(projects, "projects"),
    safeCount(services, "services"),
    safeCount(blogPosts, "blog_posts"),
    safeCount(jobOpenings, "job_openings"),
    safeCount(clientInquiries, "client_inquiries"),
    safeCount(newsletterSubscriptionTable, "newsletter_subscription"),
    safeCount(admins, "admins"),
  ]);

  return {
    projects: p,
    services: s,
    blog: b,
    careers: c,
    inquiries: i,
    newsletter: n,
    admins: a,
  };
}

function countDisplay(value: number | null): string {
  return value === null ? "—" : String(value);
}

function hasMissingTables(counts: Record<string, number | null>): boolean {
  return Object.values(counts).some((v) => v === null);
}

const STAT_CARDS = [
  { key: "projects",   label: "Projects",    href: "/admin/projects",   accent: "text-svc-web" },
  { key: "services",   label: "Services",    href: "/admin/services",   accent: "text-svc-data" },
  { key: "blog",       label: "Blog posts",  href: "/admin/blog",       accent: "text-svc-mobile" },
  { key: "careers",    label: "Openings",    href: "/admin/careers",    accent: "text-svc-ai" },
  { key: "inquiries",  label: "Inquiries",   href: "/admin/inquiries",  accent: "text-svc-social" },
  { key: "newsletter", label: "Subscribers", href: "/admin/newsletter", accent: "text-brand" },
  { key: "admins",     label: "Team access", href: "/admin/access",     accent: "text-ink" },
] as const;

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const counts = await getCounts();
  const schemaIncomplete = hasMissingTables(counts);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${admin.name ?? admin.email.split("@")[0]}`}
        description="Manage the content that powers veilcode.studio from a single dashboard."
      />

      {schemaIncomplete && (
        <div className="mb-6 rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">One or more tables are missing from the database.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run <code className="rounded bg-surface px-1.5 py-0.5 text-ink">npx drizzle-kit push</code>{" "}
            from the project root to apply the Phase 1 schema to Neon. Cards below will show “—”
            until each table exists.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:border-line-hi hover:bg-surface-hi"
          >
            <div className="text-[11px] uppercase tracking-wider text-ink-muted">
              {card.label}
            </div>
            <div className={`mt-2 font-display text-3xl font-semibold ${card.accent}`}>
              {countDisplay(counts[card.key])}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface/40 p-5">
          <h2 className="font-display text-sm font-semibold tracking-wide text-ink">
            Content pipeline
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Every change you publish here flows directly into the live site once the
            Phase 4 cutover is complete.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-ink-muted">
            <li>• Projects, services, blog, and careers are backed by Postgres via Drizzle.</li>
            <li>• Images upload through /api/admin/upload and live in Cloudinary.</li>
            <li>• Admin actions are gated to members on the Team Access list.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface/40 p-5">
          <h2 className="font-display text-sm font-semibold tracking-wide text-ink">
            Access you control
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Invite teammates from Team Access. Anyone in <code className="text-ink">ADMIN_EMAILS</code>{" "}
            is bootstrapped automatically on first sign-in.
          </p>
          <Link
            href="/admin/access"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            Manage team access →
          </Link>
        </div>
      </div>
    </>
  );
}
