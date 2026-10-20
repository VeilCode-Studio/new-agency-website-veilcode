"use client";

import { publicImageSource } from "@/lib/public-image";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FILTER_TABS, type FilterKey } from "@/constants/projects";
import { getProjectKindLabel } from "@/lib/projects/kind";
import type { Project } from "@/db/schema";
export type PortfolioProject = Pick<
  Project,
  | "slug"
  | "service"
  | "serviceLabel"
  | "title"
  | "client"
  | "summary"
  | "screenshots"
  | "industry"
  | "featured"
>;
export function PortfolioGrid({ projects }: { projects: PortfolioProject[] }) {
  const [active, setActive] = useState<FilterKey>("all");
  const filtered = projects.filter(
    (p) => active === "all" || p.service === active,
  );
  return (
    <div className="public-portfolio" id="portfolio">
      <div className="public-filter">
        <div
          className="public-container"
          role="group"
          aria-label="Filter projects by service"
        >
          {FILTER_TABS.map((tab) => (
            <button
              type="button"
              key={tab.key}
              aria-pressed={active === tab.key}
              onClick={() => setActive(tab.key)}
            >
              {tab.label}{" "}
              <span>
                (
                {
                  projects.filter(
                    (p) => tab.key === "all" || p.service === tab.key,
                  ).length
                }
                )
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="public-container">
        <p className="mt-7 text-xs text-ink-muted" role="status">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>
        <div className="public-work-grid">
          {filtered.map((p) => (
            <article key={p.slug} className="public-project-card">
              <div className="public-project-image">
                {p.screenshots[0]?.src ? (
                  <Image
                    src={publicImageSource(p.screenshots[0].src)}
                    alt={p.screenshots[0].alt || `${p.title} project preview`}
                    title={
                      p.screenshots[0].caption ||
                      p.screenshots[0].alt ||
                      `${p.title} project preview`
                    }
                    fill
                    loading="lazy"
                    sizes="(max-width:700px) calc(100vw - 40px), (max-width:1264px) calc(50vw - 47px), 585px"
                  />
                ) : (
                  <div className="p-8 text-sm text-ink-muted">
                    {p.serviceLabel}
                  </div>
                )}
              </div>
              <div className="public-project-copy">
                <p>
                  {getProjectKindLabel(p.client)} · {p.industry}
                </p>
                <h2>
                  <Link href={`/work/${p.slug}`}>{p.title}</Link>
                </h2>
                <p>{p.summary}</p>
                <Link href={`/work/${p.slug}`}>
                  Explore the build <span aria-hidden="true">&#8599;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && (
          <div className="py-16">
            <h2>No published projects in this category yet.</h2>
            <p className="mt-4 text-ink-muted">
              Try another service, or ask us about your project.
            </p>
            <button
              className="public-button mt-6"
              onClick={() => setActive("all")}
            >
              View all projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
