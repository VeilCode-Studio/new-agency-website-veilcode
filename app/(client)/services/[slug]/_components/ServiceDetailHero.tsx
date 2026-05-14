import Link from "next/link";
import type { Service } from "@/db/schema";

export function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section className="relative overflow-hidden border-b border-line px-6 pb-20 pt-36 md:px-10">
      <div
        aria-hidden
        className={`absolute right-[-10%] top-20 h-80 w-80 rounded-full blur-3xl ${service.deepDiveClasses.glow}`}
      />
      <div className="relative z-10 mx-auto grid max-w-300 gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className={`mb-5 font-mono text-xs uppercase tracking-[0.18em] ${service.deepDiveClasses.accent}`}>
            {service.tagline}
          </p>
          <h1 className="max-w-190 font-display text-[clamp(42px,6vw,78px)] font-extrabold leading-[1.02] tracking-tight text-ink">
            {service.h1 || service.title}
          </h1>
          <p className="mt-7 max-w-170 text-lg leading-relaxed text-ink-muted">
            {service.intro}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/start"
              className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
            >
              Start a project
            </Link>
            <Link
              href="/work"
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
            >
              View related work
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface/60 p-6">
          <div className={`mb-3 font-display text-5xl font-extrabold ${service.deepDiveClasses.metricText}`}>
            {service.metric}
          </div>
          <p className="font-medium text-ink">{service.metricLabel}</p>
          <p className="mt-1 text-sm text-ink-muted">{service.metricSub}</p>
        </div>
      </div>
    </section>
  );
}
