"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SeoPageListRow = {
  id: number;
  slug: string;
  pageType: string;
  countryName: string | null;
  title: string;
  published: boolean;
  indexable: boolean;
  updatedAt: Date;
};

const PAGE_BADGES: Record<string, string> = {
  location: "text-brand bg-brand-dim border-brand-border",
  "service-location": "text-svc-web bg-svc-web-dim border-svc-web-border",
  industry: "text-svc-mobile bg-svc-mobile-dim border-svc-mobile-border",
  custom: "text-svc-data bg-svc-data-dim border-svc-data-border",
};

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function updateSeoPage(id: number, payload: Record<string, unknown>) {
  const res = await fetch(`/api/admin/seo-pages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Update failed");
  return json;
}

async function deleteSeoPage(id: number) {
  const res = await fetch(`/api/admin/seo-pages/${id}`, {
    method: "DELETE",
  });

  if (res.status === 204) return;
  const json = await res.json();
  throw new Error(json.error ?? "Delete failed");
}

export function SeoPagesTable({ rows: initialRows }: { rows: SeoPageListRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle(row: SeoPageListRow, field: "published" | "indexable") {
    const nextValue = !row[field];
    setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, [field]: nextValue } : item)));

    startTransition(async () => {
      try {
        await updateSeoPage(row.id, { [field]: nextValue });
        toast.success(`${field === "published" ? "Publish" : "Indexing"} updated`);
      } catch (error) {
        setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, [field]: row[field] } : item)));
        toast.error(error instanceof Error ? error.message : "Update failed");
      }
    });
  }

  function handleDelete(row: SeoPageListRow) {
    setRows((prev) => prev.filter((item) => item.id !== row.id));
    setConfirmDeleteId(null);

    startTransition(async () => {
      try {
        await deleteSeoPage(row.id);
        toast.success("SEO page deleted");
      } catch (error) {
        setRows((prev) => [...prev, row].sort((a, b) => a.title.localeCompare(b.title)));
        toast.error(error instanceof Error ? error.message : "Delete failed");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No SEO pages yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Add your first SEO page to manage location and landing-page content from the admin.
        </p>
        <Link
          href="/admin/seo-pages/new"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Create page
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-4 py-3">Page</th>
            <th className="px-4 py-3 hidden md:table-cell">Type</th>
            <th className="px-4 py-3 hidden lg:table-cell">Updated</th>
            <th className="px-4 py-3 text-center">Publish</th>
            <th className="px-4 py-3 text-center">Index</th>
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
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-ink">{row.title}</div>
                      <div className="truncate font-mono text-[10px] text-ink-faint">
                        /seo/{row.slug}
                      </div>
                      <div className="mt-2 md:hidden">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium font-mono",
                            PAGE_BADGES[row.pageType] ?? "bg-surface border-line text-ink-muted",
                          )}
                        >
                          {row.pageType}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-4 py-3 md:table-cell">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium font-mono",
                        PAGE_BADGES[row.pageType] ?? "bg-surface border-line text-ink-muted",
                      )}
                    >
                      {row.pageType}
                    </span>
                    {row.countryName ? (
                      <p className="mt-1 text-xs text-ink-faint">{row.countryName}</p>
                    ) : null}
                  </td>

                  <td className="hidden px-4 py-3 text-xs text-ink-faint lg:table-cell">
                    {formatDate(row.updatedAt)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(row, "published")}
                      disabled={isPending}
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

                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(row, "indexable")}
                      disabled={isPending}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                        row.indexable
                          ? "border-brand-border bg-brand-dim text-brand"
                          : "border-line text-ink-muted hover:border-line-hi",
                      )}
                    >
                      {row.indexable ? "Index" : "Noindex"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/seo/${row.slug}`}
                        target="_blank"
                        title="Preview page"
                        className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                      <Link
                        href={`/admin/seo-pages/${row.id}/edit`}
                        title="Edit page"
                        className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId((prev) => (prev === row.id ? null : row.id))}
                        disabled={isPending}
                        title="Delete page"
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
                          Permanently delete <span className="font-medium text-ink">{row.title}</span>?
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
                            Delete page
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
