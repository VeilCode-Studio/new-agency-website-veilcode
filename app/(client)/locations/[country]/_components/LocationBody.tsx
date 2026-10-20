import "server-only";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import type { LocationMarket } from "@/constants/locations";
import type { Project, Service } from "@/db/schema";
import { DataRecoveryNotice } from "@/components/shared/DataRecoveryNotice";
import { getProjectKindLabel } from "@/lib/projects/kind";

function LocationWorkCard({
  project,
  relevanceNote,
}: {
  project: Project;
  relevanceNote?: string;
}) {
  const screenshot = project.screenshots.find((item) => item.src);
  return (
    <Link href={`/work/${project.slug}`} className="location-work-card">
      <div className="location-work-image">
        {screenshot?.src ? (
          <Image
            src={screenshot.src}
            alt={screenshot.alt || `${project.title} website`}
            title={
              screenshot.caption ||
              screenshot.alt ||
              `${project.title} website preview`
            }
            fill
            sizes="(max-width: 700px) 90vw, (max-width: 1000px) 44vw, 380px"
          />
        ) : (
          <span className="location-work-placeholder">{project.title}</span>
        )}
        <span className="location-work-kind">
          {getProjectKindLabel(project.client)}
        </span>
      </div>
      <div className="location-work-copy">
        <p className="location-eyebrow">
          {project.industry} / {project.year}
        </p>
        <h3>
          {project.title}
          <ArrowUpRight size={20} aria-hidden="true" />
        </h3>
        <p>{project.summary}</p>
        {relevanceNote && <p className="location-relevance">{relevanceNote}</p>}
        <span className="location-text-link">
          Explore the build <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function getSelectedProjects(market: LocationMarket, projects: Project[]) {
  if (!market.portfolioItems?.length)
    return projects
      .slice(0, 3)
      .map((project) => ({ project, relevanceNote: undefined }));
  const projectMap = new Map(
    projects.map((project) => [project.slug, project]),
  );
  return market.portfolioItems
    .map((item) => {
      const project = projectMap.get(item.slug);
      return project ? { project, relevanceNote: item.relevanceNote } : null;
    })
    .filter(
      (item): item is { project: Project; relevanceNote: string } =>
        item !== null,
    );
}

export function LocationBody({
  market,
  services,
  projects,
  seoPages = [],
  servicesUnavailable = false,
  projectsUnavailable = false,
}: {
  market: LocationMarket;
  services: Service[];
  projects: Project[];
  seoPages?: Array<{ slug: string; title: string }>;
  servicesUnavailable?: boolean;
  projectsUnavailable?: boolean;
}) {
  const selectedProjects = getSelectedProjects(market, projects);
  const serviceCards =
    market.serviceCards ??
    services.map((service) => ({
      title: service.title,
      desc: service.desc,
      href:
        service.seoEnabled && service.slug
          ? `/services/${service.slug}`
          : "/services",
    }));
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
      <section className="location-section" aria-labelledby="market-context">
        <div className="location-container">
          <div className="location-heading">
            <p className="location-eyebrow">Your market, understood</p>
            <h2 id="market-context">
              {market.whyTitle ?? `What we optimize for in ${market.shortName}`}
            </h2>
          </div>
          <div className="location-context-grid">
            {market.painPoints.map((point, index) => {
              const item =
                typeof point === "string"
                  ? { title: null, body: point }
                  : point;
              return (
                <article className="location-context-card" key={item.body}>
                  <span className="location-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {item.title && <h3>{item.title}</h3>}
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        className="location-section location-section-tinted"
        id="services"
        aria-labelledby="location-services"
      >
        <div className="location-container">
          <div className="location-heading location-heading-row">
            <div>
              <p className="location-eyebrow">From idea to a working product</p>
              <h2 id="location-services">
                {market.servicesTitle ??
                  `Digital services for ${market.shortName}`}
              </h2>
            </div>
            <Link className="location-text-link" href="/services">
              All services <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="location-services-grid">
            {serviceCards.map((service, index) => (
              <Link
                key={service.title}
                href={service.href}
                className="location-service-card"
              >
                <span className="location-service-symbol" aria-hidden="true">
                  {["</>", "[ ]", "✳", "↗"][index % 4]}
                </span>
                <span className="location-service-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <span className="location-text-link">
                  Explore service <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          {serviceCards.length === 0 && (
            <p className="location-empty">
              Tell us what you need to build.{" "}
              <Link className="location-text-link" href="/start">
                Discuss your project{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </p>
          )}
        </div>
      </section>
      <section className="location-section" aria-labelledby="location-delivery">
        <div className="location-container location-delivery-grid">
          <div className="location-delivery-intro">
            <p className="location-eyebrow">A clear way forward</p>
            <h2 id="location-delivery">
              {market.deliveryTitle ?? "How delivery works"}
            </h2>
            <p>{market.pricingContext}</p>
            <Link
              className="location-button location-button-outline"
              href="/start"
            >
              Let’s scope your project{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ol className="location-delivery-list">
            {market.deliveryNotes.map((note, index) => (
              <li key={note}>
                <span className="location-step" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {market.detailSections?.length ? (
        <section
          className="location-section location-section-tinted"
          aria-labelledby="location-remote"
        >
          <div className="location-container">
            <div className="location-heading">
              <p className="location-eyebrow">
                Working together, across borders
              </p>
              <h2 id="location-remote">
                {market.detailTitle ??
                  "Remote delivery, with clear expectations"}
              </h2>
            </div>
            <div className="location-details-grid">
              {market.detailSections.map((section) => (
                <article className="location-detail" key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                  {section.ctaLabel && section.ctaHref && (
                    <Link className="location-text-link" href={section.ctaHref}>
                      {section.ctaLabel}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {selectedProjects.length > 0 && (
        <section
          className="location-section"
          id="work"
          aria-labelledby="location-work"
        >
          <div className="location-container">
            <div className="location-heading location-heading-row">
              <div>
                <p className="location-eyebrow">Work you can inspect</p>
                <h2 id="location-work">
                  {market.portfolioTitle ?? "Selected studio work"}
                </h2>
              </div>
              <Link href="/work" className="location-text-link">
                View all work <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="location-work-grid">
              {selectedProjects.map(({ project, relevanceNote }) => (
                <LocationWorkCard
                  key={project.slug}
                  project={project}
                  relevanceNote={relevanceNote}
                />
              ))}
            </div>
            {market.portfolioCta && (
              <div className="location-portfolio-note">
                <p>{market.portfolioCta}</p>
                <Link className="location-text-link" href="/start">
                  Discuss a similar build{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
      {projectsUnavailable && projects.length === 0 && (
        <section className="location-section">
          <div className="location-container location-empty">
            <h2>Work examples are temporarily unavailable.</h2>
            <p>
              Refresh the page or come back shortly. You can still discuss your
              project with us.
            </p>
            <Link className="location-text-link" href="/start">
              Start a conversation <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
      <section
        className="location-section location-section-tinted"
        aria-labelledby="location-industries"
      >
        <div className="location-container location-industries-layout">
          <div className="location-heading">
            <p className="location-eyebrow">Built around your business</p>
            <h2 id="location-industries">
              {market.industriesTitle ??
                `Industries we support in ${market.shortName}`}
            </h2>
          </div>
          <div className="location-industries-grid">
            {market.industries.map((industry) => {
              const item =
                typeof industry === "string"
                  ? { title: industry, desc: null, href: null }
                  : industry;
              const content = (
                <>
                  <h3>
                    {item.title}
                    {item.href && <ArrowUpRight size={17} aria-hidden="true" />}
                  </h3>
                  {item.desc && <p>{item.desc}</p>}
                </>
              );
              return item.href ? (
                <Link
                  href={item.href}
                  className="location-industry"
                  key={item.title}
                >
                  {content}
                </Link>
              ) : (
                <article className="location-industry" key={item.title}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        className="location-section"
        aria-labelledby="location-questions"
      >
        <div className="location-container location-faq-layout">
          <div className="location-heading">
            <p className="location-eyebrow">Before we begin</p>
            <h2 id="location-questions">
              {market.faqTitle ?? "Questions, answered"}
            </h2>
            <p>Have a question about your particular project?</p>
            <Link href="/contact" className="location-text-link">
              Talk to the studio <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="location-faqs">
            {market.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  <h3>{faq.question}</h3>
                  <Plus size={18} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section
        className="location-section location-closing"
        aria-labelledby="location-cta"
      >
        <div className="location-container location-cta-panel">
          <div>
            <p className="location-eyebrow">Your next chapter</p>
            <h2 id="location-cta">{market.ctaCopy}</h2>
            {market.ctaBody && <p>{market.ctaBody}</p>}
          </div>
          <Link
            className="location-button location-button-primary"
            href="/start"
          >
            {market.ctaLabel}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
      {seoPages.length > 0 && (
        <section className="location-related">
          <div className="location-container">
            <h2>More services for {market.shortName}</h2>
            <div className="location-market-links">
              {seoPages.map((page) => (
                <Link key={page.slug} href={`/seo/${page.slug}`}>
                  {page.title}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {market.crossMarketLinks?.length ? (
        <nav className="location-related" aria-label="Other markets">
          <div className="location-container">
            <p>{market.crossMarketLabel ?? "Also serving clients in:"}</p>
            <div className="location-market-links">
              {market.crossMarketLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
}
