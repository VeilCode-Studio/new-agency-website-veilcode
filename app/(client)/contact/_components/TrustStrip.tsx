const TRUST_ITEMS = [{ value: "< 24h", label: "Avg. response time" }] as const;

export function TrustStrip() {
  return (
    <div className="border-y border-line bg-surface py-8 px-6 md:px-10 overflow-hidden">
      <div
        className="max-w-300 mx-auto
          flex flex-wrap justify-center items-center gap-8"
      >
        {TRUST_ITEMS.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span
              className="font-display font-extrabold text-2xl tracking-tight
              text-brand drop-shadow-[0_0_14px_var(--color-brand-glow)]"
            >
              {value}
            </span>
            <span className="font-sans text-xs text-ink-muted tracking-wide capitalize">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
