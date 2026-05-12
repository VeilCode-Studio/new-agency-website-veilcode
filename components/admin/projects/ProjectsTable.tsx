"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  deleteProjectAction,
  togglePublishAction,
  toggleFeaturedAction,
} from "@/app/(admin)/admin/projects/actions";

export type ProjectListRow = {
  id: number;
  slug: string;
  title: string;
  client: string;
  service: "web" | "mobile" | "data" | "social" | "ai";
  serviceLabel: string;
  year: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  screenshots: ProjectScreenshot[];
  updatedAt: Date;
};

const SERVICE_BADGE: Record<string, string> = {
  web:    "text-svc-web bg-svc-web-dim border-svc-web-border",
  mobile: "text-svc-mobile bg-svc-mobile-dim border-svc-mobile-border",
  data:   "text-svc-data bg-svc-data-dim border-svc-data-border",
  social: "text-svc-social bg-svc-social-dim border-svc-social-border",
  ai:     "text-svc-ai bg-svc-ai-dim border-svc-ai-border",
};

const SERVICE_DIM: Record<string, string> = {
  web:    "bg-svc-web-dim",
  mobile: "bg-svc-mobile-dim",
  data:   "bg-svc-data-dim",
  social: "bg-svc-social-dim",
  ai:     "bg-svc-ai-dim",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProjectsTable({ rows: initialRows }: { rows: ProjectListRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTogglePublish(row: ProjectListRow) {
    const next = !row.published;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: next } : r)));
    startTransition(async () => {
      const res = await togglePublishAction(row.id, next);
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: row.published } : r)));
        toast.error(res.error);
      } else {
        toast.success(next ? "Project published" : "Project set to draft");
      }
    });
  }

  function handleToggleFeatured(row: ProjectListRow) {
    const next = !row.featured;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, featured: next } : r)));
    startTransition(async () => {
      const res = await toggleFeaturedAction(row.id, next);
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, featured: row.featured } : r)));
        toast.error(res.error);
      } else {
        toast.success(next ? "Marked as featured" : "Removed from featured");
      }
    });
  }

  function handleDelete(row: ProjectListRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteProjectAction(row.id);
      if (res.error) {
        setRows((prev) => [...prev, row].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id));
        toast.error(res.error);
      } else {
        toast.success("Project deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No projects yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Create your first case study to populate the public portfolio.
        </p>
        <Link
          href="/admin/projects/new"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Create first project
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
            <th className="px-4 py-3">Project</th>
            <th className="hidden px-4 py-3 md:table-cell">Client</th>
            <th className="hidden px-4 py-3 lg:table-cell">Service</th>
            <th className="hidden px-4 py-3 md:table-cell">Year</th>
            <th className="hidden px-4 py-3 md:table-cell">Updated</th>
            <th className="px-4 py-3 text-center">Featured</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const thumb = row.screenshots.find((s) => s.src)?.src ?? null;
            const isConfirming = confirmDeleteId === row.id;

            return (
              <React.Fragment key={row.id}>
                {/* ── Main row ── */}
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

                  {/* Project thumbnail + title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "relative size-10 shrink-0 overflow-hidden rounded-md border border-line",
                          !thumb && SERVICE_DIM[row.service],
                        )}
                      >
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={row.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-mono text-[9px] font-bold uppercase tracking-wider text-ink-faint">
                            {row.service.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{row.title}</div>
                        <div className="truncate font-mono text-[11px] text-ink-faint">
                          {row.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="hidden px-4 py-3 text-ink-muted md:table-cell">{row.client}</td>

                  {/* Service badge */}
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        SERVICE_BADGE[row.service],
                      )}
                    >
                      {row.serviceLabel}
                    </span>
                  </td>

                  {/* Year */}
                  <td className="hidden px-4 py-3 text-xs text-ink-muted md:table-cell">
                    {row.year}
                  </td>

                  {/* Updated at */}
                  <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                    {formatDate(row.updatedAt)}
                  </td>

                  {/* Featured toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(row)}
                      disabled={isPending}
                      title={row.featured ? "Remove from featured" : "Mark as featured"}
                      className={cn(
                        "inline-grid size-7 place-items-center rounded-md border transition-colors",
                        row.featured
                          ? "border-brand-border bg-brand-dim text-brand"
                          : "border-line text-ink-faint hover:text-ink-muted",
                      )}
                    >
                      <Star
                        className="size-3.5"
                        fill={row.featured ? "currentColor" : "none"}
                      />
                    </button>
                  </td>

                  {/* Published status toggle */}
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

                  {/* Action buttons */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/projects/${row.id}/preview`}
                        target="_blank"
                        title="Preview case study"
                        className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                      <Link
                        href={`/projects/${row.slug}`}
                        title="View live case study"
                        className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                      <Link
                        href={`/admin/projects/${row.id}/edit`}
                        title="Edit project"
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
                        title="Delete project"
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

                {/* ── Inline delete confirmation row ── */}
                {isConfirming && (
                  <tr className="border-t border-destructive/20 bg-destructive/5">
                    <td colSpan={9} className="px-4 py-2.5">
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
                            Delete project
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
