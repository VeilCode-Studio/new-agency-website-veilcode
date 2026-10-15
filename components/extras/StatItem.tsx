import React from "react";

export function StatItem({ val, label }: { val: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display font-extrabold text-4xl tracking-tight text-brand
        drop-shadow-[0_0_16px_var(--color-brand-glow)]">
        {val}
      </span>
      <span className="font-sans text-[13px] text-ink-muted tracking-wide">
        {label}
      </span>
    </div>
  );
}