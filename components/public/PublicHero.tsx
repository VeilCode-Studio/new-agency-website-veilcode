import Link from "next/link";
import type { ReactNode } from "react";

export function PublicHero({
  eyebrow,
  title,
  description,
  parent,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  parent?: { label: string; href: string };
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="public-hero">
      <div className="public-container">
        <nav className="public-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          {parent && (
            <>
              <Link href={parent.href}>{parent.label}</Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page">{eyebrow}</span>
        </nav>
        <div className={`public-hero-grid${aside ? "" : " public-hero-wide"}`}>
          <div>
            <p className="public-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="public-intro">{description}</p>
            {children}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}

export function ProjectActions({
  secondaryHref = "/work",
  secondaryLabel = "Explore our work",
}: {
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="public-actions">
      <Link className="public-button" href="/start">
        Discuss your project <span aria-hidden="true">↗</span>
      </Link>
      <Link
        className="public-button public-button-secondary"
        href={secondaryHref}
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}

/** A lightweight HTML illustration, rather than another animation runtime. */
export function BuildPreview() {
  return (
    <div className="public-build-preview" aria-hidden="true">
      <div className="public-browser-bar">
        <span />
        <span />
        <span />
        <b>From idea to launch</b>
      </div>
      <div className="public-build-body">
        <span className="public-eyebrow">One connected product</span>
        <strong>
          Built around
          <br />
          your next step.
        </strong>
        <div className="public-preview-panels">
          <div>
            <span>01</span>Web platforms
          </div>
          <div>
            <span>02</span>Mobile apps
          </div>
          <div>
            <span>03</span>AI automation
          </div>
        </div>
        <div className="public-preview-track">
          <span /> Discover <span /> Design <span /> Build <span /> Launch
        </div>
      </div>
    </div>
  );
}
