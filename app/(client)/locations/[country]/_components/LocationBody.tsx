import Link from "next/link";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import type { LocationMarket } from "@/constants/locations";
import type { Project, Service } from "@/db/schema";
import { DataRecoveryNotice } from "@/components/shared/DataRecoveryNotice";

function LocationWorkCard({
  project,
  relevanceNote,
}: {
  project: Project;
  relevanceNote?: string;
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
              <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight text-ink">
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

          {relevanceNote && (
            <p className="mt-4 rounded-lg border border-brand-border bg-brand-dim p-3 text-xs leading-relaxed text-ink-muted">
              {relevanceNote}
            </p>
          )}

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

function getPainPoint(point: LocationMarket["painPoints"][number]) {
  return typeof point === "string" ? { title: null, body: point } : point;
}

function getIndustry(industry: LocationMarket["industries"][number]) {
  return typeof industry === "string"
    ? { title: industry, desc: null, href: null }
    : industry;
}

function getSelectedProjects(market: LocationMarket, projects: Project[]) {
  if (!market.portfolioItems?.length) {
    return projects.slice(0, 3).map((project) => ({
      project,
      relevanceNote: undefined,
    }));
  }

  const projectMap = new Map(projects.map((project) => [project.slug, project]));

  return market.portfolioItems
    .map((item) => {
      const project = projectMap.get(item.slug);
      return project ? { project, relevanceNote: item.relevanceNote } : null;
    })
    .filter((item): item is { project: Project; relevanceNote: string } => item !== null);
}

export function LocationBody({
  market,
  services,
  projects,
  servicesUnavailable = false,
  projectsUnavailable = false,
}: {
  market: LocationMarket;
  services: Service[];
  projects: Project[];
  servicesUnavailable?: boolean;
  projectsUnavailable?: boolean;
}) {
  const selectedProjects = getSelectedProjects(market, projects);

  return (
    <>
      {(servicesUnavailable || projectsUnavailable) && (
        <DataRecoveryNotice
          eyebrow="Location data issue"
          title="Some location content could not load."
          description="The page is still usable, but one or more content sections are temporarily unavailable. Refresh the page in a moment or contact us if the problem continues."
          retryLabel="Retry page"
        />
      )}

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-300 gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Market context
            </p>
            <h2 className="mb-8 font-display text-[clamp(30px,4vw,52px)] font-extrabold leading-tight tracking-tight text-ink">
              {market.whyTitle ?? `What we optimize for in ${market.shortName}`}
            </h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {market.painPoints.map((point) => {
                const painPoint = getPainPoint(point);

                return (
                  <article key={painPoint.body} className="rounded-xl border border-line bg-surface/40 p-5">
                    {painPoint.title && (
                      <h3 className="mb-3 font-display text-xl font-bold text-ink">
                        {painPoint.title}
                      </h3>
                    )}
                    <p className="leading-relaxed text-ink-muted">{painPoint.body}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-xl border border-line bg-surface p-6">
            <p className="mb-3 font-display text-xl font-bold text-ink">
              {market.deliveryTitle ?? "Delivery model"}
            </p>
            <ul className="space-y-3">
              {market.deliveryNotes.map((note) => (
                <li key={note} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <CheckCircle className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {market.detailSections?.length ? (
        <section className="border-t border-line px-6 py-24 md:px-10">
          <div className="mx-auto grid max-w-300 gap-5 lg:grid-cols-3">
            {market.detailSections.map((section) => (
              <article key={section.title} className="rounded-xl border border-line bg-surface/50 p-6">
                <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-ink">
                  {section.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {section.body}
                </p>
                {section.ctaLabel && section.ctaHref && (
                  <Link
                    href={section.ctaHref}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                  >
                    {section.ctaLabel}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

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
            {market.serviceCards
              ? market.serviceCards.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="rounded-xl border border-line bg-page p-5 transition-colors hover:border-line-hi"
                  >
                    <p className={`mb-3 font-mono text-[11px] uppercase tracking-[0.14em] ${service.accentClass ?? "text-brand"}`}>
                      {service.title}
                    </p>
                    <h3 className="font-display text-xl font-bold text-ink">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{service.desc}</p>
                  </Link>
                ))
              : services.map((service) => (
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
        <div className="mx-auto grid max-w-300 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Industries
            </p>
            <h2 className="mb-6 font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-ink">
              {market.industriesTitle ?? "Common fit"}
            </h2>
            <div className="grid gap-3">
              {market.industries.map((industry) => {
                const item = getIndustry(industry);
                const content = (
                  <>
                    <span className="font-display text-base font-bold text-ink">{item.title}</span>
                    {item.desc && (
                      <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                        {item.desc}
                      </span>
                    )}
                  </>
                );

                return item.href ? (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-hi"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={item.title} className="rounded-xl border border-line bg-surface p-4">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              FAQ
            </p>
            <h2 className="mb-6 font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-ink">
              {market.faqTitle ?? "Common questions"}
            </h2>
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

      {selectedProjects.length > 0 && (
        <section className="border-t border-line bg-surface px-6 py-24 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                  Proof
                </p>
                <h2 className="font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-ink">
                  {market.portfolioTitle ?? "Relevant work"}
                </h2>
              </div>
              <Link href="/work" className="text-sm font-semibold text-brand hover:underline">
                View all work
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {selectedProjects.map(({ project, relevanceNote }) => (
                <LocationWorkCard
                  key={project.slug}
                  project={project}
                  relevanceNote={relevanceNote}
                />
              ))}
            </div>
            {market.portfolioCta && (
              <div className="mt-8 rounded-xl border border-brand-border bg-page p-6">
                <p className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  {market.portfolioCta}
                </p>
                <Link href="/start" className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">
                  Start a Project
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {projectsUnavailable && projects.length === 0 && (
        <section className="border-t border-line bg-surface px-6 py-24 md:px-10">
          <div className="mx-auto max-w-220 rounded-xl border border-line bg-page p-8">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">
              Work examples unavailable
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">
              We could not load the relevant work examples just now.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Refresh the page or come back shortly. The rest of the location page is still
              available.
            </p>
          </div>
        </section>
      )}

      <section className="border-t border-line px-6 py-24 md:px-10">
        <div className="mx-auto max-w-220 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_56px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative px-8 py-8 md:px-10 md:py-10">
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-brand-dim/70 via-transparent to-svc-data-dim/40"
              />
              <div
                aria-hidden
                className="absolute -right-10 top-6 size-32 rounded-full bg-brand-dim/40 blur-3xl"
              />
              <div className="relative z-10">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
                  Next step
                </p>
                <h2 className="max-w-120 font-display text-[clamp(24px,3vw,36px)] font-extrabold leading-tight tracking-tight text-ink">
                  {market.ctaCopy}
                </h2>
                <p className="mt-4 max-w-115 text-sm leading-relaxed text-ink-muted">
                  {market.ctaBody ??
                    "We will scope the opportunity, recommend the right service mix, and map a practical launch path."}
                </p>
              </div>
            </div>

            <div className="border-t border-line bg-page px-8 py-8 md:px-10 lg:border-l lg:border-t-0">
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                        Scope
                      </p>
                      <p className="mt-1 font-medium text-ink">Clarify the build</p>
                    </div>
                    <div className="rounded-lg border border-line bg-surface p-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                        Response
                      </p>
                      <p className="mt-1 font-medium text-ink">Practical next step</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {market.serviceFocus.map((service) => (
                      <span
                        key={service}
                        className="rounded border border-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/start"
                  className="inline-flex w-full items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                >
                  {market.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {market.crossMarketLinks?.length ? (
        <section className="border-t border-line bg-surface px-6 py-12 md:px-10">
          <div className="mx-auto flex max-w-300 flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              {market.crossMarketLabel ?? "Also serving clients in:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {market.crossMarketLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded border border-line bg-page px-3 py-2 text-sm text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
