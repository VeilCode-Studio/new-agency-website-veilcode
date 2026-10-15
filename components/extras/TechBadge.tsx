

export function TechBadge({ label }: { label: string }) {

  return (
    <span
      className={`font-mono text-[11px] tracking-widest uppercase
        px-4.5 py-2.5 rounded-md border cursor-default
        transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200
        bg-surface border-line text-ink-muted hover:bg-brand-dim hover:border-brand-border hover:text-brand`}
    >
      {label}
    </span>
  );
}
