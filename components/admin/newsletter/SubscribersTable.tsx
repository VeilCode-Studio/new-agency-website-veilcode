"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, ShieldOff, ShieldCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  toggleSubscriberAction,
  deleteSubscriberAction,
} from "@/app/(admin)/admin/newsletter/actions";

export type SubscriberRow = {
  id: number;
  email: string;
  subscribed: boolean;
  confirmToken: string | null;
  confirmTokenExpiresAt: Date | null;
  createdAt: Date | null;
};

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SubscriberStats({ rows }: { rows: SubscriberRow[] }) {
  const confirmed = rows.filter((r) => r.subscribed).length;
  const pending = rows.filter((r) => !r.subscribed && r.confirmToken).length;
  const revoked = rows.filter((r) => !r.subscribed && !r.confirmToken).length;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Total",     value: rows.length },
        { label: "Confirmed", value: confirmed },
        { label: "Pending",   value: pending },
        { label: "Revoked",   value: revoked },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-line bg-surface/40 p-4">
          <div className="font-display text-xl font-bold text-ink">{value}</div>
          <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function SubscribersTable({ rows: initialRows }: { rows: SubscriberRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function status(row: SubscriberRow): { label: string; cls: string } {
    if (row.subscribed) return { label: "Confirmed", cls: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-900" };
    if (row.confirmToken) return { label: "Pending",   cls: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-900" };
    return { label: "Revoked", cls: "text-ink-muted bg-surface border-line" };
  }

  function handleToggle(row: SubscriberRow) {
    const next = !row.subscribed;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, subscribed: next } : r)));
    startTransition(async () => {
      const res = await toggleSubscriberAction(row.id, next);
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, subscribed: row.subscribed } : r)));
        toast.error(res.error);
      } else {
        toast.success(next ? "Subscription restored" : "Subscription revoked");
      }
    });
  }

  function handleDelete(row: SubscriberRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteSubscriberAction(row.id);
      if (res.error) {
        setRows((prev) => [row, ...prev]);
        toast.error(res.error);
      } else {
        toast.success("Subscriber deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No subscribers yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Signups from the newsletter form will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <SubscriberStats rows={rows} />

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 md:table-cell">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { label, cls } = status(row);
              const isConfirming = confirmDeleteId === row.id;

              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={cn(
                      "border-t border-line transition-colors",
                      isConfirming && "bg-destructive/5",
                    )}
                  >
                    {/* Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="size-3.5 shrink-0 text-ink-faint" />
                        <span className="text-sm text-ink">{row.email}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium", cls)}>
                        {label}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                      {formatDate(row.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggle(row)}
                          disabled={isPending}
                          title={row.subscribed ? "Revoke subscription" : "Restore subscription"}
                          className={cn(
                            "inline-grid size-7 place-items-center rounded-md border transition-colors",
                            row.subscribed
                              ? "border-line text-ink-muted hover:border-amber-300 hover:text-amber-600"
                              : "border-line text-ink-muted hover:border-emerald-300 hover:text-emerald-600",
                          )}
                        >
                          {row.subscribed
                            ? <ShieldOff className="size-3.5" />
                            : <ShieldCheck className="size-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId((prev) => (prev === row.id ? null : row.id))}
                          disabled={isPending}
                          title="Delete subscriber"
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
                      <td colSpan={4} className="px-4 py-2.5">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs text-ink-muted">
                            Permanently delete{" "}
                            <span className="font-medium text-ink">{row.email}</span>?
                            They won&apos;t be able to re-subscribe without signing up again.
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
    </>
  );
}
