import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllProjects,
  getPublishedBlogs,
  getPublishedSeoPages,
  getPublishedServices,
  getSeoPageBySlug,
} from "@/queries";
import { StructuredData } from "@/lib/seo/StructuredData";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PublicHero } from "@/components/public/PublicHero";
import { getProjectKindLabel } from "@/lib/projects/kind";
import { ArticleBody } from "../../blog/[slug]/ArticleBody";
import { getLocationMarketByCountryCode } from "@/constants/locations";

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const page = await getSeoPageBySlug(slug);

  if (!page) return {};

  const metadata = buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/seo/${page.slug}`,
  });

  return {
    ...metadata,
    robots: page.indexable ? undefined : { index: false, follow: false },
  };
}

function pageTypeLabel(value: string) {
  switch (value) {
    case "location":
      return "Location guide";
    case "service-location":
      return "Services & markets";
    case "industry":
      return "Industry guide";
    default:
      return "Expertise";
  }
}

export default async function SeoPage({ params }: Params) {
  const { slug } = await params;
  const page = await getSeoPageBySlug(slug);

  if (!page) return notFound();

  const [servicesResult, projectsResult, blogsResult, seoPagesResult] =
    await Promise.allSettled([
      getPublishedServices(),
      getAllProjects(),
      getPublishedBlogs(),
      getPublishedSeoPages(),
    ]);

  const services =
    servicesResult.status === "fulfilled" ? servicesResult.value : [];
  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const blogs = blogsResult.status === "fulfilled" ? blogsResult.value : [];

  const relatedServices = page.relatedServiceIds
    .map((serviceId) => services.find((service) => service.id === serviceId))
    .filter((service): service is NonNullable<typeof service> =>
      Boolean(service),
    );

  const relatedProjects = page.relatedProjectSlugs
    .map((projectSlug) =>
      projects.find((project) => project.slug === projectSlug),
    )
    .filter((project): project is NonNullable<typeof project> =>
      Boolean(project),
    );

  const relatedBlogs = page.relatedBlogSlugs
    .map((blogSlug) => blogs.find((blog) => blog.slug === blogSlug))
    .filter((blog): blog is NonNullable<typeof blog> => Boolean(blog));

  const seoPages =
    seoPagesResult.status === "fulfilled" ? seoPagesResult.value : [];

  // Every service-location page links to its location page and its service page.
  const locationMarket = getLocationMarketByCountryCode(page.countryCode);
  const primaryService = page.serviceId
    ? services.find((service) => service.id === page.serviceId)
    : undefined;
  const primaryServiceHref =
    primaryService?.seoEnabled && primaryService.slug
      ? `/services/${primaryService.slug}`
      : null;

  const relatedSeoPages = seoPages
    .filter((item) => item.slug !== page.slug)
    .filter((item) => {
      if (page.countryName && item.countryName === page.countryName)
        return true;
      if (page.serviceId && item.serviceId === page.serviceId) return true;
      return false;
    })
    .slice(0, 6);

  return (
    <>
      <StructuredData
        data={webPageJsonLd({
          name: page.title,
          description: page.metaDescription,
          path: `/seo/${page.slug}`,
        })}
      />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Expertise", href: "/seo" },
          { name: page.title, href: `/seo/${page.slug}` },
        ])}
      />

      <PublicHero
        eyebrow={pageTypeLabel(page.pageType)}
        parent={{ label: "Expertise", href: "/seo" }}
        title={page.h1}
        description={page.heroCopy}
      >
        <div className="public-tags">
          {locationMarket && (
            <Link
              className="public-button public-button-secondary"
              href={`/locations/${locationMarket.slug}`}
            >
              {page.countryName}
            </Link>
          )}
          {primaryService && primaryServiceHref && (
            <Link
              className="public-button public-button-secondary"
              href={primaryServiceHref}
            >
              {primaryService.title}
            </Link>
          )}
        </div>
        <div className="public-actions">
          <Link href={page.cta?.href ?? "/start"} className="public-button">
            {page.cta?.label ?? "Discuss your project"}
          </Link>
          <Link
            href="/contact"
            className="public-button public-button-secondary"
          >
            Contact the studio
          </Link>
        </div>
      </PublicHero>

      {page.body.length > 0 && (
        <section className="border-t border-line px-6 py-20 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-160">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                  Overview
                </p>
                <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-tight text-ink">
                  A closer look
                </h2>
              </div>
              <p className="max-w-120 text-sm leading-relaxed text-ink-muted">
                Explore the approach, capabilities and practical details for
                your project.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_56px_rgba(15,23,42,0.08)]">
                <div className="h-1 bg-linear-to-r from-brand via-brand/60 to-svc-data" />
                <div className="px-6 py-7 md:px-8 md:py-8">
                  <div className="mb-6 flex flex-wrap gap-2.5">
                    {page.countryName ? (
                      <span className="rounded-full border border-line bg-page px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                        {page.countryName}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-line bg-page px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                      {pageTypeLabel(page.pageType)}
                    </span>
                    {page.serviceId ? (
                      <span className="rounded-full border border-line bg-page px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                        {primaryService?.title || "Services"}
                      </span>
                    ) : null}
                  </div>

                  <div className="max-w-190">
                    <ArticleBody blocks={page.body} />
                  </div>
                </div>
              </article>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <p className="public-eyebrow">Your next step</p>
                  <h2>Let’s talk through the details.</h2>
                  <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                    Share what you need to build, who it is for and what needs
                    to work better. We will help you define a practical scope.
                  </p>
                  <Link className="public-button mt-6" href="/start">
                    Discuss your project ↓
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {(relatedServices.length > 0 ||
        relatedProjects.length > 0 ||
        relatedBlogs.length > 0) && (
        <section className="border-t border-line px-6 py-20 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                Related content
              </p>
              <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-tight text-ink">
                Services, builds and further reading
              </h2>
            </div>

            <div className="grid gap-8 xl:grid-cols-3">
              {relatedServices.length > 0 ? (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    Services
                  </p>
                  <div className="space-y-3">
                    {relatedServices.map((service) => (
                      <Link
                        key={service.tagline || service.title}
                        href={
                          service.seoEnabled && service.slug
                            ? `/services/${service.slug}`
                            : "/services"
                        }
                        className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-hi"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                              {service.tagline || service.title}
                            </p>
                            <h3 className="mt-2 font-display text-lg font-bold text-ink">
                              {service.title}
                            </h3>
                          </div>
                          <span className="mt-0.5 rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-faint">
                            Service
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {relatedProjects.length > 0 ? (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    Projects
                  </p>
                  <div className="space-y-3">
                    {relatedProjects.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/work/${project.slug}`}
                        className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-hi"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                          {getProjectKindLabel(project.client)} ·{" "}
                          {project.serviceLabel}
                        </p>
                        <h3 className="mt-2 font-display text-lg font-bold text-ink">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                          {project.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {relatedBlogs.length > 0 ? (
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    Articles
                  </p>
                  <div className="space-y-3">
                    {relatedBlogs.map((blog) => (
                      <Link
                        key={blog.slug}
                        href={`/blog/${blog.slug}`}
                        className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-hi"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                          {blog.category}
                        </p>
                        <h3 className="mt-2 font-display text-lg font-bold text-ink">
                          {blog.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                          {blog.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {relatedSeoPages.length > 0 && (
        <section className="border-t border-line bg-surface px-6 py-20 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                Explore further
              </p>
              <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-tight text-ink">
                More for your business
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedSeoPages.map((item) => (
                <Link
                  key={item.slug}
                  href={`/seo/${item.slug}`}
                  className="rounded-xl border border-line bg-page p-5 transition-colors hover:border-line-hi"
                >
                  <div className="flex flex-wrap gap-2">
                    {item.countryName ? (
                      <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                        {item.countryName}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      {pageTypeLabel(item.pageType)}
                    </span>
                    {item.serviceId ? (
                      <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                        {services.find(
                          (service) => service.id === item.serviceId,
                        )?.title || "Services"}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {item.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.faqs.length > 0 && (
        <section className="border-t border-line bg-surface px-6 py-20 md:px-10">
          <div className="mx-auto max-w-220">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              FAQ
            </p>
            <div className="divide-y divide-line rounded-xl border border-line bg-page">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group p-5">
                  <summary className="cursor-pointer list-none font-display text-lg font-bold text-ink">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
