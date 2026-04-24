import { PageHeader } from "./PageHeader";

export function ComingSoon({ section }: { section: string }) {
  return (
    <>
      <PageHeader
        title={section}
        description={`${section} admin controls ship in Phase 3. The schema and upload pipeline are already in place — we just need to build this CRUD surface.`}
      />
      <div className="rounded-xl border border-dashed border-line bg-surface/30 p-10 text-center">
        <div className="mx-auto mb-3 grid size-10 place-items-center rounded-lg border border-brand-border bg-brand-dim font-display text-brand">
          ◇
        </div>
        <p className="text-sm text-ink-muted">
          Coming in Phase 3 — Create, edit, publish, and manage {section.toLowerCase()}.
        </p>
      </div>
    </>
  );
}
