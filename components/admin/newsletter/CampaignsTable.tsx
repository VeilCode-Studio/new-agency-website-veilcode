"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, Pencil, Send, CheckCircle2, Clock, AlertCircle, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteCampaignAction } from "@/app/(admin)/admin/newsletter/actions";

export type CampaignRow = {
  id: number;
  subject: string;
  previewText: string;
  type: string;
  status: string;
  sentAt: Date | null;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;
};

const TYPE_LABEL: Record<string, string> = {
  "announcement":  "Announcement",
  "product-update":"Product Update",
  "tips-tricks":   "Tips & Tricks",
  "blog-digest":   "Blog Digest",
  "custom":        "Custom",
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
    draft:   { label: "Draft",   cls: "text-ink-muted bg-surface border-line",                                               icon: FileText },
    sending: { label: "Sending", cls: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-900", icon: Loader2 },
    sent:    { label: "Sent",    cls: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-900", icon: CheckCircle2 },
    failed:  { label: "Failed",  cls: "text-destructive bg-destructive/5 border-destructive/20",                             icon: AlertCircle },
  };
  const s = map[status] ?? map.draft;
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", s.cls)}>
      <Icon className={cn("size-2.5", status === "sending" && "animate-spin")} />
      {s.label}
    </span>
  );
}

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function CampaignsTable({ rows: initialRows }: { rows: CampaignRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(row: CampaignRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteCampaignAction(row.id);
      if (res.error) {
        setRows((prev) => [row, ...prev]);
        toast.error(res.error);
      } else {
        toast.success("Campaign deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No campaigns yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Compose your first campaign to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-4 py-3">Subject</th>
            <th className="hidden px-4 py-3 sm:table-cell">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="hidden px-4 py-3 md:table-cell">Sent</th>
            <th className="hidden px-4 py-3 lg:table-cell">Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isConfirming = confirmDeleteId === row.id;
            return (
              <React.Fragment key={row.id}>
                <tr className={cn("border-t border-line transition-colors hover:bg-surface/30", isConfirming && "bg-destructive/5")}>
                  {/* Subject */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink truncate max-w-[240px]">{row.subject}</div>
                    {row.previewText && (
                      <div className="text-[11px] text-ink-faint truncate max-w-[240px]">{row.previewText}</div>
                    )}
                  </td>

                  {/* Type */}
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs text-ink-muted">{TYPE_LABEL[row.type] ?? row.type}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Sent count */}
                  <td className="hidden px-4 py-3 md:table-cell">
                    {row.status === "sent" ? (
                      <span className="text-xs text-ink-muted">
                        {row.sentCount.toLocaleString()}
                        {row.failedCount > 0 && (
                          <span className="ml-1 text-destructive">({row.failedCount} failed)</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-xs text-ink-faint">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="hidden px-4 py-3 text-xs text-ink-faint lg:table-cell">
                    {row.status === "sent" ? formatDate(row.sentAt) : formatDate(row.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {row.status !== "sent" && (
                        <Link
                          href={`/admin/newsletter/campaigns/${row.id}/edit`}
                          title="Edit campaign"
                          className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-brand-border hover:text-brand"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                      )}

                      {row.status === "sent" && (
                        <span
                          title="Campaign already sent"
                          className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-faint"
                        >
                          <Send className="size-3.5" />
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId((prev) => (prev === row.id ? null : row.id))}
                        disabled={isPending || row.status === "sending"}
                        title="Delete campaign"
                        className={cn(
                          "inline-grid size-7 place-items-center rounded-md border transition-colors",
                          isConfirming
                            ? "border-destructive/40 bg-destructive/10 text-destructive"
                            : "border-line text-ink-muted hover:border-destructive/40 hover:text-destructive",
                        )}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>

                {isConfirming && (
                  <tr className="border-t border-destructive/20 bg-destructive/5">
                    <td colSpan={6} className="px-4 py-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-ink-muted">
                          Permanently delete{" "}
                          <span className="font-medium text-ink">&ldquo;{row.subject}&rdquo;</span>?
                          This cannot be undone.
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-md border border-line px-3 py-1 text-xs text-ink-muted transition-colors hover:text-ink"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row)}
                            disabled={isPending}
                            className="rounded-md bg-destructive px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CampaignStats({ rows }: { rows: CampaignRow[] }) {
  const sent    = rows.filter((r) => r.status === "sent").length;
  const drafts  = rows.filter((r) => r.status === "draft").length;
  const total   = rows.reduce((s, r) => s + r.sentCount, 0);
  const failed  = rows.reduce((s, r) => s + r.failedCount, 0);

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Total campaigns", value: rows.length },
        { label: "Sent",            value: sent },
        { label: "Drafts",          value: drafts },
        { label: "Emails delivered",value: total - failed },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-line bg-surface/40 p-4">
          <div className="font-display text-xl font-bold text-ink">{value.toLocaleString()}</div>
          <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
        </div>
      ))}
    </div>
  );
}
