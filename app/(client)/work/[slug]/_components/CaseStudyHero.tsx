import { publicImageSource } from "@/lib/public-image";
import Image from "next/image";
import type { Project } from "@/db/schema";
import { PublicHero } from "@/components/public/PublicHero";
import { getProjectKindLabel } from "@/lib/projects/kind";
export function ScreenshotPlaceholder({
  alt,
  caption,
}: {
  alt: string;
  caption: string;
  accent: string;
  dimBg: string;
  border: string;
}) {
  return (
    <figure>
      <div
        className="rounded-2xl border border-line bg-surface p-12 text-center text-sm text-ink-muted"
        role="img"
        aria-label={alt}
      >
        Project preview unavailable
      </div>
      <figcaption className="public-case-caption">{caption}</figcaption>
    </figure>
  );
}
export function CaseStudyHero({ project: p }: { project: Project }) {
  const shot = p.screenshots[0];
  return (
    <>
      <PublicHero
        eyebrow={p.title}
        parent={{ label: "Work", href: "/work" }}
        title={p.title}
        description={p.summary}
      >
        <p className="public-eyebrow">
          {getProjectKindLabel(p.client)} · {p.serviceLabel}
        </p>
        <ul className="public-tags" aria-label="Project details">
          {[p.client, p.industry, p.year, p.duration, p.team, ...p.tags]
            .filter(Boolean)
            .map((item, i) => (
              <li key={`${item}-${i}`}>{item}</li>
            ))}
        </ul>
      </PublicHero>
      <section className="px-6 md:px-10">
        <div className="max-w-300 mx-auto">
          {p.results.length > 0 && (
            <dl className="public-case-results grid grid-cols-2 gap-4 lg:grid-cols-4">
              {p.results.map((r) => (
                <div
                  key={r.label}
                  className="rounded-xl border border-line bg-surface p-5"
                >
                  <dt className="text-sm text-ink">{r.label}</dt>
                  <dd className="mt-3 text-3xl font-extrabold text-brand">
                    {r.metric}
                  </dd>
                  <dd className="mt-2 text-xs text-ink-muted">{r.sub}</dd>
                </div>
              ))}
            </dl>
          )}
          {shot?.src && (
            <figure>
              <div
                className={`public-case-image${p.service === "mobile" ? " public-case-phone" : ""}`}
              >
                <Image
                  src={publicImageSource(shot.src)}
                  alt={shot.alt || `${p.title} project preview`}
                  fill
                  loading="lazy"
                  sizes={
                    p.service === "mobile"
                      ? "(max-width:370px) calc(100vw - 40px), 330px"
                      : "(max-width:1264px) calc(100vw - 48px), 1200px"
                  }
                />
              </div>
              <figcaption className="public-case-caption">
                {shot.caption}
              </figcaption>
            </figure>
          )}
        </div>
      </section>
    </>
  );
}
