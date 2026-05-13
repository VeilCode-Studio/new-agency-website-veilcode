"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  deletePostAction,
  toggleFeaturedPostAction,
  togglePublishPostAction,
} from "@/app/(admin)/admin/blog/actions";

export type BlogPostListRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  heroSrc: string | null;
  featured: boolean;
  publishedAt: Date;
  readTime: string;
  published: boolean;
  updatedAt: Date;
};

const CATEGORY_BADGE: Record<string, string> = {
  Engineering:     "text-svc-web bg-svc-web-dim border-svc-web-border",
  "AI & Automation": "text-svc-data bg-svc-data-dim border-svc-data-border",
  Design:          "text-svc-mobile bg-svc-mobile-dim border-svc-mobile-border",
  Marketing:       "text-svc-social bg-svc-social-dim border-svc-social-border",
  Product:         "text-svc-ai bg-svc-ai-dim border-svc-ai-border",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogPostsTable({ rows: initialRows }: { rows: BlogPostListRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTogglePublish(row: BlogPostListRow) {
    const next = !row.published;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: next } : r)));
    startTransition(async () => {
      const res = await togglePublishPostAction(row.id, next);
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: row.published } : r)));
        toast.error(res.error);
      } else {
        toast.success(next ? "Post published" : "Post set to draft");
      }
    });
  }

  function handleToggleFeatured(row: BlogPostListRow) {
    const next = !row.featured;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, featured: next } : r)));
    startTransition(async () => {
      const res = await toggleFeaturedPostAction(row.id, next);
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, featured: row.featured } : r)));
        toast.error(res.error);
      } else {
        toast.success(next ? "Marked as featured" : "Removed from featured");
      }
    });
  }

  function handleDelete(row: BlogPostListRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deletePostAction(row.id);
      if (res.error) {
        setRows((prev) =>
          [...prev, row].sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
          ),
        );
        toast.error(res.error);
      } else {
        toast.success("Post deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No posts yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Write your first article to populate the public blog.
        </p>
        <Link
          href="/admin/blog/new"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Write first post
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-4 py-3">Post</th>
            <th className="hidden px-4 py-3 lg:table-cell">Category</th>
            <th className="hidden px-4 py-3 md:table-cell">Published</th>
            <th className="hidden px-4 py-3 md:table-cell">Read time</th>
            <th className="px-4 py-3 text-center">Featured</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isConfirming = confirmDeleteId === row.id;
            const badgeCls = CATEGORY_BADGE[row.category] ?? "text-ink-muted bg-surface border-line";

            return (
              <React.Fragment key={row.id}>
                <tr
                  className={cn(
                    "border-t border-line transition-colors hover:bg-surface/30",
                    isConfirming && "bg-destructive/5",
                  )}
                >
                  {/* Title + excerpt */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
                        {row.heroSrc ? (
                          <Image
                            src={row.heroSrc}
                            alt={row.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-ink-faint">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{row.title}</div>
                        <div className="truncate font-mono text-[11px] text-ink-faint">/{row.slug}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        badgeCls,
                      )}
                    >
                      {row.category}
                    </span>
                  </td>

                  {/* Published date */}
                  <td className="hidden px-4 py-3 text-xs text-ink-muted md:table-cell">
                    {formatDate(row.publishedAt)}
                  </td>

                  {/* Read time */}
                  <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                    {row.readTime}
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
                        href={`/admin/blog/${row.id}/preview`}
                        title="Preview post"
                        className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                      <Link
                        href={`/admin/blog/${row.id}/edit`}
                        title="Edit post"
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
                        title="Delete post"
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
                            Delete post
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
