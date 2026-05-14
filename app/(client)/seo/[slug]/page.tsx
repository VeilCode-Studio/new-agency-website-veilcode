import { notFound } from "next/navigation";
import Link from "next/link";
import { getSeoPageBySlug } from "@/queries";
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
            <div className="max-w-180">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                Overview
              </p>
              <ArticleBody blocks={page.body} />
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
