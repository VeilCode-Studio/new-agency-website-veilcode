import Link from "next/link";
import { getProjectKindLabel } from "@/lib/projects/kind";
import type { Service, Project } from "@/db/schema";

export function ServiceDetailBody({
  service,
  projects,
}: {
  service: Service;
  projects: Project[];
}) {
  return (
    <>
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-300 gap-10 lg:grid-cols-2">
          <article className="rounded-xl border border-line bg-surface/40 p-7">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              The problem
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-ink">
              What this service helps fix
            </h2>
            <p className="leading-relaxed text-ink-muted">
              {service.challenge}
            </p>
          </article>
          <article className="rounded-xl border border-line bg-surface/40 p-7">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Our approach
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-ink">
              How VeilCode delivers it
            </h2>
            <p className="leading-relaxed text-ink-muted">{service.approach}</p>
          </article>
        </div>
      </section>

      <section className="border-t border-line bg-surface px-6 py-24 md:px-10">
        <div className="mx-auto max-w-300">
          <div className="mb-12 max-w-170">
            <p
              className={`mb-3 font-mono text-xs uppercase tracking-[0.16em] ${service.deepDiveClasses.accent}`}
            >
              Deliverables
            </p>
            <h2 className="font-display text-[clamp(30px,4vw,52px)] font-extrabold leading-tight tracking-tight text-ink">
              What you get
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-line bg-page p-5"
              >
                <h3 className="mb-2 font-display text-lg font-bold text-ink">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-300 gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p
              className={`mb-3 font-mono text-xs uppercase tracking-[0.16em] ${service.deepDiveClasses.accent}`}
            >
              Capabilities
            </p>
            <h2 className="mb-6 font-display text-[clamp(30px,4vw,48px)] font-extrabold leading-tight tracking-tight text-ink">
              Built as one connected service
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[...service.bullets, ...service.supportingCapabilities].map(
                (item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-line bg-surface/40 px-4 py-3 text-sm text-ink-muted"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <aside className="rounded-xl border border-line bg-surface/50 p-6">
            <p className="mb-4 font-display text-lg font-bold text-ink">
              Common stack
            </p>
            <div className="flex flex-wrap gap-2">
              {service.stack.map((item) => (
                <span
                  key={item}
                  className={`rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${service.deepDiveClasses.stackBg} ${service.deepDiveClasses.stackBorder} ${service.deepDiveClasses.accent}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="border-t border-line bg-surface px-6 py-24 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p
                  className={`mb-3 font-mono text-xs uppercase tracking-[0.16em] ${service.deepDiveClasses.accent}`}
                >
                  Related work
                </p>
                <h2 className="font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-ink">
                  Relevant case studies
                </h2>
              </div>
              <Link
                href="/work"
                className="text-sm font-semibold text-brand hover:underline"
              >
                View all work
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="rounded-xl border border-line bg-page p-5 transition-colors hover:border-line-hi"
                >
                  <p className="mb-2 text-xs text-ink-faint">
                    {getProjectKindLabel(project.client)} · {project.industry}
                  </p>
                  <h3 className="font-display text-xl font-bold text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                    {project.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
