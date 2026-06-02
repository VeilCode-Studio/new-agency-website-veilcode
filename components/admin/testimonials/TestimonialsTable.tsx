"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MessageSquareQuote, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteTestimonialAction } from "@/app/(admin)/admin/testimonials/actions";

export type TestimonialListRow = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "VC";
}

export function TestimonialsTable({
  rows: initialRows,
}: {
  rows: TestimonialListRow[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(row: TestimonialListRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteTestimonialAction(row.id);
      if (res.error) {
        setRows((prev) =>
          [...prev, row].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        toast.error(res.error);
      } else {
        toast.success("Testimonial deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">
          No testimonials yet
        </div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Add client stories to populate the landing page carousel.
        </p>
        <Link
          href="/admin/testimonials/new"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          Add first testimonial
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-4 py-3">Client</th>
            <th className="hidden px-4 py-3 lg:table-cell">Quote</th>
            <th className="hidden px-4 py-3 md:table-cell">Added</th>
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
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-border bg-brand-dim font-mono text-[11px] font-semibold text-brand">
                        {getInitials(row.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{row.name}</div>
                        <div className="truncate text-xs text-ink-muted">
                          {row.role}, {row.company}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="hidden max-w-xl px-4 py-3 lg:table-cell">
                    <div className="flex items-start gap-2 text-xs text-ink-muted">
                      <MessageSquareQuote className="mt-0.5 size-3.5 shrink-0 text-brand" />
                      <p className="line-clamp-2">{row.quote}</p>
                    </div>
                  </td>

                  <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                    {formatDate(row.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/testimonials/${row.id}/edit`}
                        title="Edit testimonial"
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
                        title="Delete testimonial"
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
                          <span className="font-medium text-ink">{row.name}</span>
                          &apos;s testimonial?
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
                            Delete testimonial
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
