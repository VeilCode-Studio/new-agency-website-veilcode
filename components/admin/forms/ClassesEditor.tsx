"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Field } from "./Field";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

export function ClassesEditor<T extends Record<string, string>>({
  title,
  classes,
  onChange,
  onReset,
  fields,
}: {
  title: string;
  classes: T;
  onChange: (v: T) => void;
  onReset: () => void;
  fields: { key: keyof T; label: string; hint: string }[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium tracking-wider text-ink-muted uppercase">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(({ key, label, hint }) => (
          <Field key={String(key)} label={label}>
            <input
              type="text"
              value={classes[key] || ""}
              onChange={(e) => onChange({ ...classes, [key]: e.target.value })}
              placeholder={hint}
              className={cn(inputCls, "font-mono text-xs")}
            />
          </Field>
        ))}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-brand"
      >
        <RotateCcw className="size-3" /> Reset to preset
      </button>
    </div>
  );
}
