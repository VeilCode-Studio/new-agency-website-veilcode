import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Users, Send, FileText, Plus, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { db } from "@/db/drizzle";
import { newsletterSubscriptionTable, newsletterCampaigns } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function NewsletterOverviewPage() {
  await requireAdmin();

  let totalSubs = 0;
  let confirmedSubs = 0;
  let pendingSubs = 0;
  let recentCampaigns: Array<{
    id: number;
    subject: string;
    type: string;
    status: string;
    sentAt: Date | null;
    sentCount: number;
    createdAt: Date;
  }> = [];
  let totalSent = 0;

  try {
    const subs = await db.select().from(newsletterSubscriptionTable);
    totalSubs = subs.length;
    confirmedSubs = subs.filter((s) => s.subscribed).length;
    pendingSubs = subs.filter((s) => !s.subscribed && s.confirmToken).length;

    const campaigns = await db
      .select()
      .from(newsletterCampaigns)
      .orderBy(desc(newsletterCampaigns.createdAt))
      .limit(5);

    recentCampaigns = campaigns;
    totalSent = campaigns.filter((c) => c.status === "sent").length;
  } catch (err) {
    console.error("[admin/newsletter] overview error:", err);
  }

  const TYPE_LABEL: Record<string, string> = {
    "announcement":   "Announcement",
    "product-update": "Product Update",
    "tips-tricks":    "Tips & Tricks",
    "blog-digest":    "Blog Digest",
    "custom":         "Custom",
  };

  return (
    <>
      <PageHeader
        title="Newsletter"
        description="Manage subscribers and send campaigns to your audience."
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total subscribers",  value: totalSubs,       icon: Users },
          { label: "Confirmed",          value: confirmedSubs,   icon: CheckCircle2 },
          { label: "Pending confirmation",value: pendingSubs,    icon: Clock },
          { label: "Campaigns sent",     value: totalSent,       icon: Send },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-line bg-surface/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-display text-2xl font-bold text-ink">{value}</div>
              <Icon className="size-4 text-ink-faint" />
            </div>
            <div className="text-xs text-ink-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/newsletter/campaigns/new"
          className="flex items-center gap-3 rounded-xl border border-brand/20 bg-brand-dim/20 p-4 transition-colors hover:bg-brand-dim/30"
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
            <Plus className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">New campaign</div>
            <div className="text-xs text-ink-muted">Compose and send a newsletter</div>
          </div>
        </Link>

        <Link
          href="/admin/newsletter/subscribers"
          className="flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:bg-surface/60"
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-ink-muted">
            <Users className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Subscribers</div>
            <div className="text-xs text-ink-muted">Manage your list</div>
          </div>
        </Link>

        <Link
          href="/admin/newsletter/campaigns"
          className="flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:bg-surface/60"
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-ink-muted">
            <FileText className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">All campaigns</div>
            <div className="text-xs text-ink-muted">Drafts and sent</div>
          </div>
        </Link>
      </div>

      {/* Recent campaigns */}
      <div className="rounded-xl border border-line overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-surface/40">
          <h2 className="text-sm font-semibold text-ink">Recent campaigns</h2>
          <Link
            href="/admin/newsletter/campaigns"
            className="flex items-center gap-1 text-xs text-ink-muted transition-colors hover:text-brand"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </div>

        {recentCampaigns.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-ink-muted">No campaigns yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentCampaigns.map((c) => (
                <tr key={c.id} className="border-t border-line first:border-t-0 hover:bg-surface/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-ink">{c.subject}</div>
                    <div className="text-[11px] text-ink-faint">{TYPE_LABEL[c.type] ?? c.type}</div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      c.status === "sent"    && "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-900",
                      c.status === "draft"   && "text-ink-muted bg-surface border-line",
                      c.status === "failed"  && "text-destructive bg-destructive/5 border-destructive/20",
                      c.status === "sending" && "text-amber-600 bg-amber-50 border-amber-200",
                    )}>
                      {c.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                    {c.status === "sent" ? formatDate(c.sentAt) : formatDate(c.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {c.status !== "sent" && (
                      <Link
                        href={`/admin/newsletter/campaigns/${c.id}/edit`}
                        className="text-xs text-ink-muted hover:text-brand"
                      >
                        Edit →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
