"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field } from "./Field";

const inputCls =
  "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

interface DeliverableItem {
  title: string;
  desc: string;
}

export function DeliverablesEditor({
  deliverables,
  onChange,
}: {
  deliverables: DeliverableItem[];
  onChange: (v: DeliverableItem[]) => void;
}) {
  function patch(i: number, p: Partial<DeliverableItem>) {
    onChange(deliverables.map((d, idx) => (idx === i ? { ...d, ...p } : d)));
  }

  return (
    <div className="space-y-3">
      {deliverables.map((d, i) => (
        <div key={i} className="relative rounded-lg border border-line bg-page p-3">
          <button
            type="button"
            onClick={() => onChange(deliverables.filter((_, idx) => idx !== i))}
            className="absolute right-2 top-2 text-ink-faint hover:text-destructive"
            title="delete"
          >
            <Trash2 className="size-3.5" />
          </button>
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
            <Field label="Title">
              <input
                type="text"
                value={d.title}
                onChange={(e) => patch(i, { title: e.target.value })}
                placeholder="Strategy & Planning"
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <input
                type="text"
                value={d.desc}
                onChange={(e) => patch(i, { desc: e.target.value })}
                placeholder="Define goals, audience, and success metrics…"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...deliverables, { title: "", desc: "" }])}
        className="flex items-center gap-1.5 rounded-md border border-dashed border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="size-3.5" /> Add deliverable
      </button>
    </div>
  );
}
