"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

export function BulletsEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (v: string[]) => void;
}) {
  function patch(i: number, val: string) {
    onChange(bullets.map((b, idx) => (idx === i ? val : b)));
  }

  return (
    <div className="space-y-2">
      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="shrink-0 w-5 text-right font-mono text-[11px] text-ink-faint">
            {i + 1}.
          </span>
          <input
            type="text"
            value={b}
            onChange={(e) => patch(i, e.target.value)}
            placeholder="Key capability or highlight…"
            className={cn(inputCls, "flex-1")}
          />
          <button
            title="delete"
            type="button"
            onClick={() => onChange(bullets.filter((_, idx) => idx !== i))}
            className="shrink-0 text-ink-faint hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...bullets, ""])}
        className="flex items-center gap-1.5 rounded-md border border-dashed border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="size-3.5" /> Add bullet
      </button>
    </div>
  );
}
