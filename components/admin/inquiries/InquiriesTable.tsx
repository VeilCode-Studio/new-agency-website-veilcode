"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, ChevronDown, Copy, Mail, Building2, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteInquiryAction } from "@/app/(admin)/admin/inquiries/actions";

export type InquiryRow = {
  id: number;
  name: string;
  email: string;
  service: string;
  company: string | null;
  budget: string | null;
  timeline: string | null;
  message: string;
  goals: string[] | null;
  createAt: Date | null;
};

// Service → colour mapping (matches badge text values from the contact form)
const SERVICE_COLOR: Record<string, string> = {
  "Web Solutions (Design & Development)": "text-svc-web bg-svc-web-dim border-svc-web-border",
  "Mobile Application Development":       "text-svc-mobile bg-svc-mobile-dim border-svc-mobile-border",
  "Data Analytics":                        "text-svc-data bg-svc-data-dim border-svc-data-border",
  "Social Media Marketing":               "text-svc-social bg-svc-social-dim border-svc-social-border",
  "AI Automation":                         "text-svc-ai bg-svc-ai-dim border-svc-ai-border",
  "Multiple Services":                     "text-brand bg-brand-dim border-brand-border",
  "Not Sure Yet":                          "text-ink-muted bg-surface border-line",
};

// Short label for table column (prevents wrapping)
const SERVICE_SHORT: Record<string, string> = {
  "Web Solutions (Design & Development)": "Web",
  "Mobile Application Development":       "Mobile",
  "Data Analytics":                        "Data",
  "Social Media Marketing":               "Social",
  "AI Automation":                         "AI",
  "Multiple Services":                     "Multiple",
  "Not Sure Yet":                          "TBD",
};

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Stats bar shown above the table
export function InquiryStats({ rows }: { rows: InquiryRow[] }) {
  const now = new Date();
  const thisMonth = rows.filter((r) => {
    if (!r.createAt) return false;
    const d = new Date(r.createAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const byService = rows.reduce<Record<string, number>>((acc, r) => {
    const key = SERVICE_SHORT[r.service] ?? r.service;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const topService = Object.entries(byService).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Total inquiries", value: rows.length },
        { label: "This month",      value: thisMonth },
        { label: "Top service",     value: topService ? `${topService[0]} (${topService[1]})` : "—" },
        { label: "With company",    value: rows.filter((r) => r.company).length },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-line bg-surface/40 p-4">
          <div className="font-display text-xl font-bold text-ink">{value}</div>
          <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
        </div>
      ))}
    </div>
  );
}

// Expanded detail panel shown below a row
function DetailPanel({ row }: { row: InquiryRow }) {
  return (
    <tr className="border-t border-brand/10 bg-brand-dim/20">
      <td colSpan={7} className="px-5 py-4">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          {/* Message */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
              Message
            </p>
            <p className="text-sm leading-relaxed text-ink whitespace-pre-wrap">
              {row.message}
            </p>
          </div>

          {/* Meta */}
          <div className="shrink-0 space-y-3 min-w-48">
            {row.timeline && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-1">
                  Timeline
                </p>
                <p className="text-xs text-ink-muted">{row.timeline}</p>
              </div>
            )}

            {row.goals && row.goals.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-1.5">
                  Goals
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {row.goals.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1 rounded-full border border-brand-border bg-brand-dim px-2 py-0.5 text-[10px] font-medium text-brand"
                    >
                      <Target className="size-2.5" />
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {row.company && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-1">
                  Company
                </p>
                <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <Building2 className="size-3 text-ink-faint" />
                  {row.company}
                </p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-1">
                Submitted
              </p>
              <p className="text-xs text-ink-faint">
                {formatDate(row.createAt)} at {formatTime(row.createAt)}
              </p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// Main table

export function InquiriesTable({ rows: initialRows }: { rows: InquiryRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
    // Close delete confirm if open
    if (confirmDeleteId === id) setConfirmDeleteId(null);
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email).then(() => toast.success("Email copied"));
  }

  function handleDelete(row: InquiryRow) {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setConfirmDeleteId(null);
    if (expandedId === row.id) setExpandedId(null);
    startTransition(async () => {
      const res = await deleteInquiryAction(row.id);
      if (res.error) {
        // Restore on failure (append; exact position lost but acceptable)
        setRows((prev) => [row, ...prev]);
        toast.error(res.error);
      } else {
        toast.success("Inquiry deleted");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/40 py-24 text-center">
        <div className="font-display text-lg font-semibold text-ink">No inquiries yet</div>
        <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
          Submissions from the contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <InquiryStats rows={rows} />

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-left text-[11px] uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 md:table-cell">Email</th>
              <th className="px-4 py-3">Service</th>
              <th className="hidden px-4 py-3 lg:table-cell">Budget</th>
              <th className="hidden px-4 py-3 md:table-cell">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedId === row.id;
              const isConfirming = confirmDeleteId === row.id;
              const svcCls = SERVICE_COLOR[row.service] ?? "text-ink-muted bg-surface border-line";

              return (
                <React.Fragment key={row.id}>
                  {/* Main row */}
                  <tr
                    onClick={() => toggleExpand(row.id)}
                    className={cn(
                      "cursor-pointer border-t border-line transition-colors",
                      isExpanded
                        ? "bg-brand-dim/30 hover:bg-brand-dim/40"
                        : "hover:bg-surface/30",
                      isConfirming && "bg-destructive/5",
                    )}
                  >
                    {/* Name + expand chevron */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={cn(
                            "size-3.5 shrink-0 text-ink-faint transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-ink truncate">{row.name}</div>
                          {row.company && (
                            <div className="text-[11px] text-ink-faint truncate">{row.company}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-ink-muted truncate max-w-[180px]">
                          {row.email}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); copyEmail(row.email); }}
                          title="Copy email address"
                          className="shrink-0 rounded p-0.5 text-ink-faint transition-colors hover:text-brand"
                        >
                          <Copy className="size-3" />
                        </button>
                      </div>
                    </td>

                    {/* Service badge */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
                          svcCls,
                        )}
                      >
                        {SERVICE_SHORT[row.service] ?? row.service}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="text-xs text-ink-muted">
                        {row.budget ?? <span className="text-ink-faint">—</span>}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="hidden px-4 py-3 text-xs text-ink-faint md:table-cell">
                      {formatDate(row.createAt)}
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`mailto:${row.email}?subject=Re: Your Enquiry — VeilCode`}
                          title="Reply by email"
                          className="inline-grid size-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-brand-border hover:text-brand"
                        >
                          <Mail className="size-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmDeleteId((prev) => (prev === row.id ? null : row.id))
                          }
                          disabled={isPending}
                          title="Delete inquiry"
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

                  {/* Expanded detail panel */}
                  {isExpanded && <DetailPanel row={row} />}

                  {/* Inline delete confirmation */}
                  {isConfirming && (
                    <tr className="border-t border-destructive/20 bg-destructive/5">
                      <td colSpan={6} className="px-4 py-2.5">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs text-ink-muted">
                            Permanently delete inquiry from{" "}
                            <span className="font-medium text-ink">{row.name}</span>?
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
    </>
  );
}
