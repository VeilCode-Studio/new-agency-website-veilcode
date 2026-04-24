import { desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { admins } from "@/db/schema";
import { getBootstrapAdminEmails, requireAdmin } from "@/lib/auth/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { AddAdminForm } from "./AddAdminForm";
import { RemoveAdminButton } from "./RemoveAdminButton";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccessPage() {
  const me = await requireAdmin();
  let rows: typeof admins.$inferSelect[] = [];
  let schemaMissing = false;
  try {
    rows = await db.select().from(admins).orderBy(desc(admins.createdAt));
  } catch (err) {
    console.warn("[admin/access] admins table missing:", err);
    schemaMissing = true;
  }
  const bootstrapEmails = getBootstrapAdminEmails();

  return (
    <>
      <PageHeader
        title="Team Access"
        description="Grant admin access to teammates by email. The next time they sign in, they'll land directly in the admin panel."
      />

      {schemaMissing && (
        <div className="mb-6 rounded-xl border border-svc-social-border bg-svc-social-dim p-4 text-sm text-svc-social">
          <div className="font-semibold">The admins table is missing.</div>
          <p className="mt-1 text-xs text-ink-muted">
            Run <code className="rounded bg-surface px-1.5 py-0.5 text-ink">npx drizzle-kit push</code>{" "}
            to create it. Until then you can still view the panel as a bootstrap admin but cannot
            add teammates.
          </p>
        </div>
      )}

      <AddAdminForm />

      <div className="mt-6 overflow-hidden rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Added by</th>
              <th className="px-4 py-3">Added on</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-muted">
                  No admins recorded yet. Sign in as a bootstrap admin to populate this list.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isBootstrap = bootstrapEmails.includes(row.email.toLowerCase());
                const isSelf = row.email.toLowerCase() === me.email.toLowerCase();
                return (
                  <tr key={row.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink">{row.email}</td>
                    <td className="px-4 py-3 text-ink-muted">{row.name ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-muted">{row.addedBy ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-muted">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {isSelf && (
                          <span className="rounded-full border border-brand-border bg-brand-dim px-2 py-0.5 text-[10px] font-medium text-brand">
                            You
                          </span>
                        )}
                        {isBootstrap && (
                          <span className="rounded-full border border-svc-data-border bg-svc-data-dim px-2 py-0.5 text-[10px] font-medium text-svc-data">
                            Bootstrap
                          </span>
                        )}
                        {row.clerkUserId ? (
                          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                            Linked
                          </span>
                        ) : (
                          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                            Pending sign-in
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RemoveAdminButton id={row.id} email={row.email} disabled={isSelf} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        Bootstrap admins (listed in the <code className="text-ink-muted">ADMIN_EMAILS</code>{" "}
        environment variable) are re-added automatically on next sign-in even if revoked here.
      </p>
    </>
  );
}
