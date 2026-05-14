import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LocationMarket } from "@/constants/locations";
import type { Project, Service } from "@/db/schema";

function LocationWorkCard({
  project,
}: {
  project: Project;
}) {
  const screenshot = project.screenshots.find((item) => item.src);
  const classes = project.classes;

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-page transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hi ${classes.hoverBorder} ${classes.hoverShadow}`}
    >
      <div className={`h-1 w-full bg-linear-to-r from-current to-transparent ${classes.accent}`} />
      <div className="flex flex-1 flex-col">
        <div className="relative h-36 overflow-hidden bg-surface sm:h-40">
          {screenshot?.src ? (
            <div
              role="img"
              aria-label={screenshot.alt || `${project.title} screenshot`}
              className="absolute inset-2 rounded-lg bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-[1.035]"
              style={{ backgroundImage: `url("${screenshot.src}")` }}
            />
          ) : (
            <div className={`flex h-full min-h-60 items-center justify-center ${classes.dimBg}`}>
              <div className={`font-display text-5xl font-extrabold ${classes.accent}`}>
                {project.metric}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-page/45 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className={`rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md ${classes.dimBg} ${classes.border} ${classes.accent}`}
            >
              {project.serviceLabel}
            </span>
            <span className="rounded border border-line bg-page/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted backdrop-blur-md">
              {project.year}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs text-ink-faint">
                {project.client} / {project.industry}
              </p>
              <h3
                className="font-display text-xl font-extrabold leading-tight tracking-tight text-ink"
              >
                {project.title}
              </h3>
            </div>
            <span className={`grid size-10 shrink-0 place-items-center rounded-full border ${classes.border} ${classes.dimBg} ${classes.accent}`}>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">
            {project.summary}
          </p>

          <div className="mt-5 grid grid-cols-[auto_1fr] gap-3 rounded-lg border border-line bg-surface/60 p-3.5">
            <div className={`font-display text-2xl font-extrabold leading-none ${classes.accent}`}>
              {project.metric}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{project.metricLabel}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                {project.results[0]?.sub || project.outcome}
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border border-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function LocationBody({
  market,
  services,
  projects,
}: {
  market: LocationMarket;
  services: Service[];
  projects: Project[];
}) {
  return (
    <>
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-300 gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Market context
            </p>
            <h2 className="mb-8 font-display text-[clamp(30px,4vw,52px)] font-extrabold leading-tight tracking-tight text-ink">
              What we optimize for in {market.shortName}
            </h2>
            <div className="grid gap-4">
              {market.painPoints.map((point) => (
                <article key={point} className="rounded-xl border border-line bg-surface/40 p-5">
                  <p className="leading-relaxed text-ink-muted">{point}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-xl border border-line bg-surface p-6">
            <p className="mb-3 font-display text-xl font-bold text-ink">Delivery model</p>
            <ul className="space-y-3">
              {market.deliveryNotes.map((note) => (
                <li key={note} className="text-sm leading-relaxed text-ink-muted">
                  {note}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-line pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Pricing context
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{market.pricingContext}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-surface px-6 py-24 md:px-10">
        <div className="mx-auto max-w-300">
          <div className="mb-10 max-w-170">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
              Services
            </p>
            <h2 className="font-display text-[clamp(30px,4vw,52px)] font-extrabold leading-tight tracking-tight text-ink">
              Services relevant to {market.shortName}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.seoEnabled && service.slug ? `/services/${service.slug}` : "/services"}
                className="rounded-xl border border-line bg-page p-5 transition-colors hover:border-line-hi"
              >
                <p className={`mb-3 font-mono text-[11px] uppercase tracking-[0.14em] ${service.deepDiveClasses.accent}`}>
                  {service.tagline}
                </p>
                <h3 className="font-display text-xl font-bold text-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-300 gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Industries
            </p>
            <h2 className="mb-6 font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-ink">
              Common fit
            </h2>
            <div className="flex flex-wrap gap-2">
              {market.industries.map((industry) => (
                <span
                  key={industry}
                  className="rounded border border-line bg-surface px-3 py-1.5 text-sm text-ink-muted"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              FAQ
            </p>
            <div className="divide-y divide-line rounded-xl border border-line bg-surface/40">
              {market.faqs.map((faq) => (
                <article key={faq.question} className="p-5">
                  <h3 className="font-display text-lg font-bold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="border-t border-line bg-surface px-6 py-24 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                  Proof
                </p>
                <h2 className="font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-ink">
                  Relevant work
                </h2>
              </div>
              <Link href="/work" className="text-sm font-semibold text-brand hover:underline">
                View all work
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <LocationWorkCard
                  key={project.slug}
                  project={project}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line px-6 py-24 md:px-10">
        <div className="mx-auto max-w-220 rounded-xl border border-line bg-surface p-8 text-center">
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-ink">
            {market.ctaCopy}
          </h2>
          <Link
            href="/start"
            className="mt-7 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            {market.ctaLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
