"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  deleteJobAction,
  togglePublishJobAction,
} from "@/app/(admin)/admin/careers/actions";

export type JobListRow = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  published: boolean;
  createdAt: Date;
};

const TYPE_BADGE: Record<string, string> = {
  "Full-time":  "text-svc-data bg-svc-data-dim border-svc-data-border",
  "Part-time":  "text-svc-mobile bg-svc-mobile-dim border-svc-mobile-border",
  "Contract":   "text-svc-ai bg-svc-ai-dim border-svc-ai-border",
  "Internship": "text-svc-web bg-svc-web-dim border-svc-web-border",
  "Freelance":  "text-svc-social bg-svc-social-dim border-svc-social-border",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function JobsTable({ rows: initialRows }: { rows: JobListRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTogglePublish(row: JobListRow) {
    const next = !row.published;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: next } : r)));
    startTransition(async () => {
      const res = await togglePublishJobAction(row.id, next);
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: row.published } : r)));
        toast.error(res.error);
      } else {
        toast.success(next ? "Opening published" : "Opening set to draft");
      }
    });
  }

  function handleDelete(row: JobListRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteJobAction(row.id);
      if (res.error) {
        setRows((prev) =>
          [...prev, row].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        );
        toast.error(res.error);
      } else {
        toast.success("Job opening deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No openings yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Post your first job opening to start receiving applications.
        </p>
        <Link
          href="/admin/careers/new"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Post first opening
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-4 py-3">Role</th>
            <th className="hidden px-4 py-3 md:table-cell">Location</th>
            <th className="hidden px-4 py-3 lg:table-cell">Type</th>
            <th className="hidden px-4 py-3 lg:table-cell">Experience</th>
            <th className="hidden px-4 py-3 md:table-cell">Posted</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isConfirming = confirmDeleteId === row.id;
            const typeCls = TYPE_BADGE[row.type] ?? "text-ink-muted bg-surface border-line";

            return (
              <React.Fragment key={row.id}>
                <tr
                  className={cn(
                    "border-t border-line transition-colors hover:bg-surface/30",
                    isConfirming && "bg-destructive/5",
                  )}
                >
                  {/* Title + department */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{row.title}</div>
                    <div className="mt-0.5 text-xs text-ink-muted">{row.department}</div>
                  </td>

                  {/* Location */}
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <MapPin className="size-3 shrink-0 text-ink-faint" />
                      {row.location}
                    </div>
                  </td>

                  {/* Type badge */}
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        typeCls,
                      )}
                    >
                      {row.type}
                    </span>
                  </td>

                  {/* Experience */}
                  <td className="hidden px-4 py-3 text-xs text-ink-muted lg:table-cell">
                    {row.experience}
                  </td>

                  {/* Posted date */}
                  <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                    {formatDate(row.createdAt)}
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
                        href={`/admin/careers/${row.id}/edit`}
                        title="Edit opening"
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
                        title="Delete opening"
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
                            Delete opening
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
