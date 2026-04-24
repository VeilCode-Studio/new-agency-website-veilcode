import Link from "next/link";
import {
  FolderKanban,
  Sparkles,
  FileText,
  ShieldCheck,
  ImageUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Full content control",
    desc: "Projects, services, blog posts, and careers — all editable in one place.",
  },
  {
    icon: ImageUp,
    title: "Cloudinary image pipeline",
    desc: "Drag-and-drop uploads. Images are optimised and delivered from a global CDN.",
  },
  {
    icon: Sparkles,
    title: "Drift-free frontend sync",
    desc: "Every row you edit matches the exact shape the marketing site already renders.",
  },
  {
    icon: ShieldCheck,
    title: "Admin-only access",
    desc: "Clerk-gated with a granular team access list. Revoke or grant anytime.",
  },
  {
    icon: FileText,
    title: "Structured, not freeform",
    desc: "Typed fields and block editors — no risk of a stray HTML tag breaking a page.",
  },
] as const;

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-x-hidden border-r border-line bg-surface/30 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:self-start lg:overflow-y-auto lg:p-8 xl:p-12">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-brand-dim blur-3xl" />
        <div className="absolute top-1/2 -right-24 size-96 rounded-full bg-svc-mobile-dim blur-3xl" />
      </div>
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F0F4F8 1px, transparent 1px), linear-gradient(to bottom, #F0F4F8 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg border border-brand-border bg-brand-dim font-display text-base font-bold text-brand shadow-[0_0_24px_var(--color-brand-dim)]">
            V
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-wide text-ink">
              VeilCode
            </span>
            <span className="text-[11px] uppercase tracking-widest text-ink-muted">
              Admin Console
            </span>
          </div>
        </Link>

        <h1 className="mt-10 font-display text-3xl font-semibold leading-tight tracking-tight text-ink xl:mt-14 xl:text-[2.5rem]">
          Control everything that ships
          <br />
          to <span className="text-brand">veilcode.studio</span>.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          Projects, services, careers, blog content, client inquiries, and the newsletter —
          all managed from a single admin dashboard.
        </p>
      </div>

      <div className="relative z-10 mt-8 space-y-3.5 xl:mt-12">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-3">
            <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border border-brand-border bg-brand-dim text-brand">
              <Icon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink">{title}</div>
              <div className="text-xs text-ink-muted">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between border-t border-line pt-4 text-[11px] uppercase tracking-widest text-ink-faint">
        <span>Internal · Restricted</span>
        <Link href="/" className="hover:text-ink-muted">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
