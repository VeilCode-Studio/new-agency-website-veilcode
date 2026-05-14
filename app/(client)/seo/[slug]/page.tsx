import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllProjects,
  getPublishedBlogs,
  getPublishedServices,
  getSeoPageBySlug,
} from "@/queries";
import { StructuredData } from "@/lib/seo/StructuredData";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { GridBg, GlowOrb, SectionTag, AccentLine } from "@/components/extras/Primitives";
import { ArticleBody } from "../../blog/[slug]/ArticleBody";

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
      return "Location";
    case "service-location":
      return "Service + Location";
    case "industry":
      return "Industry";
    default:
      return "Custom";
  }
}

export default async function SeoPage({ params }: Params) {
  const { slug } = await params;
  const page = await getSeoPageBySlug(slug);

  if (!page) return notFound();

  const [servicesResult, projectsResult, blogsResult] = await Promise.allSettled([
    getPublishedServices(),
    getAllProjects(),
    getPublishedBlogs(),
  ]);

  const services = servicesResult.status === "fulfilled" ? servicesResult.value : [];
  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const blogs = blogsResult.status === "fulfilled" ? blogsResult.value : [];

  const relatedServices = page.relatedServiceIds
    .map((serviceId) => services.find((service) => service.id === serviceId))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const relatedProjects = page.relatedProjectSlugs
    .map((projectSlug) => projects.find((project) => project.slug === projectSlug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  const relatedBlogs = page.relatedBlogSlugs
    .map((blogSlug) => blogs.find((blog) => blog.slug === blogSlug))
    .filter((blog): blog is NonNullable<typeof blog> => Boolean(blog));

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
          { name: "SEO Pages", href: "/seo" },
          { name: page.title, href: `/seo/${page.slug}` },
        ])}
      />

      <section className="relative min-h-[72vh] overflow-hidden flex items-center">
        <GridBg />
        <GlowOrb color="rgba(0,229,255,0.10)" size={560} top="5%" left="58%" />
        <GlowOrb color="rgba(16,217,160,0.07)" size={400} bottom="0%" left="0%" delay="2s" />

        <div
          aria-hidden
          className="absolute inset-x-0 h-px pointer-events-none bg-linear-to-r from-transparent via-brand/20 to-transparent animate-scan"
        />

        <div className="relative z-10 w-full max-w-300 mx-auto px-6 md:px-10 pt-36 pb-24">
          <div className="max-w-205">
            <SectionTag>{pageTypeLabel(page.pageType)}</SectionTag>
            <AccentLine width={56} />

            <h1 className="font-display text-[clamp(40px,6.5vw,80px)] font-extrabold leading-[1.02] tracking-tight text-ink mb-6">
              {page.h1}
            </h1>

            <p className="font-sans font-light text-lg text-ink-muted leading-relaxed max-w-145 mb-10">
              {page.heroCopy}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {page.countryName ? (
                <span className="font-mono text-[11px] tracking-widest uppercase px-3.5 py-1.5 rounded border border-line bg-surface text-ink-faint">
                  {page.countryName}
                </span>
              ) : null}
              {page.serviceId ? (
                <span className="font-mono text-[11px] tracking-widest uppercase px-3.5 py-1.5 rounded border border-line bg-surface text-ink-faint">
                  {page.serviceId}
                </span>
              ) : null}
              {page.relatedServiceIds.slice(0, 3).map((serviceId) => (
                <span
                  key={serviceId}
                  className="font-mono text-[11px] tracking-widest uppercase px-3.5 py-1.5 rounded border border-line bg-surface text-ink-faint"
                >
                  {serviceId}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={page.cta?.href ?? "/start"}
                className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
              >
                {page.cta?.label ?? "Let's Discuss your Project"}
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-page to-transparent pointer-events-none"
        />
      </section>

      {page.body.length > 0 && (
        <section className="border-t border-line px-6 py-20 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-160">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                  Overview
                </p>
                <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-tight text-ink">
                  What this page covers
                </h2>
              </div>
              <p className="max-w-120 text-sm leading-relaxed text-ink-muted">
                This section is structured to support search intent, internal linking, and a clearer
                reading path for visitors.
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
                        {page.serviceId}
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
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                    Page focus
                  </p>
                  <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
                    <p>
                      Search target:{" "}
                      <span className="font-medium text-ink">{page.title}</span>
                    </p>
                    <p>
                      Primary angle: {page.serviceId || pageTypeLabel(page.pageType).toLowerCase()}{" "}
                      positioning for {page.countryName || "global"} search intent.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-page p-6">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                    What to expect
                  </p>
                  <ul className="space-y-3 text-sm leading-relaxed text-ink-muted">
                    <li>Clear positioning for the market and service combination.</li>
                    <li>Readable sections that support both visitors and search engines.</li>
                    <li>Internal links to services, projects, and related articles.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {(relatedServices.length > 0 || relatedProjects.length > 0 || relatedBlogs.length > 0) && (
        <section className="border-t border-line px-6 py-20 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                Related content
              </p>
              <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-tight text-ink">
                Internal links that support this page
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
                        key={service.id}
                        href={service.slug ? `/services/${service.slug}` : "/services"}
                        className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-hi"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                              {service.id}
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
