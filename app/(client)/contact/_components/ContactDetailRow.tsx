import type { CONTACT_DETAILS } from "./OfficeInfo";
export function ContactDetailRow({
  detail,
}: {
  detail: (typeof CONTACT_DETAILS)[number];
}) {
  const content = (
    <div className="flex items-start gap-4 rounded-xl border border-line bg-surface-hi p-5 transition-colors group-hover:border-brand-border">
      <div className="size-9 shrink-0 flex items-center justify-center rounded-lg border border-line bg-surface text-brand">
        {detail.icon}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          {detail.label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-ink">
          {detail.value}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          {detail.sub}
        </p>
      </div>
    </div>
  );
  return detail.href ? (
    <a href={detail.href} className="group block no-underline">
      {content}
    </a>
  ) : (
    content
  );
}
