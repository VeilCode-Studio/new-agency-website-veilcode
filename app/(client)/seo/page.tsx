import Link from "next/link";
import { getPublishedSeoPages } from "@/queries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { GridBg, GlowOrb, SectionTag, AccentLine } from "@/components/extras/Primitives";
import { DataRecoveryNotice } from "@/components/shared/DataRecoveryNotice";
import type { SeoPage } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "SEO Pages | VeilCode",
  description: "Search-focused landing pages for locations, industries, and service combinations.",
  path: "/seo",
});

export default async function SeoPagesIndexPage() {
  let pages: SeoPage[] = [];
  let failed = false;

  try {
    pages = await getPublishedSeoPages();
  } catch (error) {
    failed = true;
    console.error("[seo] failed to load published seo pages:", error);
  }

  return (
    <>
      <section className="relative min-h-[62vh] overflow-hidden flex items-center">
        <GridBg />
        <GlowOrb color="rgba(0,229,255,0.10)" size={560} top="5%" left="58%" />
        <GlowOrb color="rgba(16,217,160,0.07)" size={400} bottom="0%" left="0%" delay="2s" />
        <div className="relative z-10 w-full max-w-300 mx-auto px-6 md:px-10 pt-36 pb-24">
          <div className="max-w-205">
            <SectionTag>SEO Pages</SectionTag>
            <AccentLine width={56} />
            <h1 className="font-display text-[clamp(40px,6.5vw,80px)] font-extrabold leading-[1.02] tracking-tight text-ink mb-6">
              Search landing pages, managed from the admin
            </h1>
            <p className="font-sans font-light text-lg text-ink-muted leading-relaxed max-w-145">
              Published pages appear here and are linked from the sitemap. Location pages and other
              controlled landing pages can be created, published, and updated from the admin.
            </p>
          </div>
        </div>
      </section>

      {failed ? (
        <DataRecoveryNotice
          eyebrow="SEO pages unavailable"
          title="We could not load the SEO pages list."
          description="The hub is still available, but the live page list could not be fetched right now. Refresh in a moment if you need the latest entries."
          retryLabel="Retry SEO pages"
        />
      ) : (
        <section className="border-t border-line px-6 py-20 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                Published pages
              </p>
              <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-tight text-ink">
                Pick a landing page to review
              </h2>
            </div>

            {pages.length === 0 ? (
              <div className="rounded-xl border border-line bg-surface p-8 text-sm text-ink-muted">
                No SEO pages are published yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/seo/${page.slug}`}
                    className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-hi"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                      {page.pageType}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-bold text-ink">{page.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {page.metaDescription}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
