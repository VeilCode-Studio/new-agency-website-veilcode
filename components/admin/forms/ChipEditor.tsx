"use client";

import React, { useState } from "react";
import { Field } from "./Field";

export function ChipEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function add() {
    const t = input.trim();
    if (!t || values.includes(t)) return;
    onChange([...values, t]);
    setInput("");
  }

  function handleBlur() {
    if (input.trim()) {
      add();
    }
  }

  return (
    <Field label={label}>
      <div className="flex min-h-10.5 flex-wrap gap-1.5 rounded-md border border-line bg-page p-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-ink"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="text-ink-faint hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
            if (e.key === "Backspace" && !input && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          placeholder={
            values.length === 0 ? placeholder ?? "Type and press Enter…" : "Add another…"
          }
          className="min-w-28 flex-1 bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
        />
      </div>
    </Field>
  );
}
