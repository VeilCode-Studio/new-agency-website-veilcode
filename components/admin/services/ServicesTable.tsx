"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  deleteServiceAction,
  togglePublishServiceAction,
} from "@/app/(admin)/admin/services/actions";

export type ServiceListRow = {
  id: string;
  number: string;
  icon: string;
  title: string;
  tagline: string;
  sortOrder: number;
  published: boolean;
  updatedAt: Date;
};

const SERVICE_BADGE: Record<string, string> = {
  web:    "text-svc-web bg-svc-web-dim border-svc-web-border",
  mobile: "text-svc-mobile bg-svc-mobile-dim border-svc-mobile-border",
  data:   "text-svc-data bg-svc-data-dim border-svc-data-border",
  social: "text-svc-social bg-svc-social-dim border-svc-social-border",
  ai:     "text-svc-ai bg-svc-ai-dim border-svc-ai-border",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ServicesTable({ rows: initialRows }: { rows: ServiceListRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTogglePublish(row: ServiceListRow) {
    const next = !row.published;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: next } : r)));
    startTransition(async () => {
      const res = await togglePublishServiceAction(row.id, next);
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: row.published } : r)));
        toast.error(res.error);
      } else {
        toast.success(next ? "Service published" : "Service set to draft");
      }
    });
  }

  function handleDelete(row: ServiceListRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteServiceAction(row.id);
      if (res.error) {
        setRows((prev) => [...prev, row].sort((a, b) => a.sortOrder - b.sortOrder));
        toast.error(res.error);
      } else {
        toast.success("Service deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No services yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Add your first service to populate the public services page.
        </p>
        <Link
          href="/admin/services/new"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Add first service
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-4 py-3 w-10 text-center">#</th>
            <th className="px-4 py-3">Service</th>
            <th className="hidden px-4 py-3 md:table-cell">ID</th>
            <th className="hidden px-4 py-3 lg:table-cell">Tagline</th>
            <th className="hidden px-4 py-3 md:table-cell">Updated</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isConfirming = confirmDeleteId === row.id;

            return (
              <React.Fragment key={row.id}>
                <tr
                  className={cn(
                    "border-t border-line transition-colors hover:bg-surface/30",
                    isConfirming && "bg-destructive/5",
                  )}
                >
                  {/* Sort order */}
                  <td className="px-4 py-3 text-center font-mono text-xs text-ink-faint">
                    {row.sortOrder}
                  </td>

                  {/* Icon + title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg border text-base",
                          SERVICE_BADGE[row.id] ?? "bg-surface border-line text-ink",
                        )}
                      >
                        {row.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{row.title}</div>
                        <div className="truncate font-mono text-[10px] text-ink-faint">
                          {row.number}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ID badge */}
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium font-mono",
                        SERVICE_BADGE[row.id] ?? "bg-surface border-line text-ink-muted",
                      )}
                    >
                      {row.id}
                    </span>
                  </td>

                  {/* Tagline */}
                  <td className="hidden px-4 py-3 lg:table-cell max-w-xs">
                    <p className="truncate text-xs text-ink-muted">{row.tagline}</p>
                  </td>

                  {/* Updated at */}
                  <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                    {formatDate(row.updatedAt)}
                  </td>

                  {/* Published toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(row)}
                      disabled={isPending}
                      title={row.published ? "Set to draft" : "Publish"}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                        row.published
                          ? "border-svc-data-border bg-svc-data-dim text-svc-data"
                          : "border-line text-ink-muted hover:border-line-hi",
                      )}
                    >
                      {row.published ? (
                        <>
                          <Eye className="size-2.5" />
                          Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-2.5" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/services/${row.id}/preview`}
                        title="Preview service"
                        className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                      <Link
                        href={`/admin/services/${row.id}/edit`}
                        title="Edit service"
                        className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDeleteId((prev) => (prev === row.id ? null : row.id))
                        }
                        disabled={isPending}
                        title="Delete service"
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

                {/* Inline delete confirmation */}
                {isConfirming && (
                  <tr className="border-t border-destructive/20 bg-destructive/5">
                    <td colSpan={7} className="px-4 py-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-ink-muted">
                          Permanently delete{" "}
                          <span className="font-medium text-ink">{row.title}</span>?
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
                            Delete service
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
