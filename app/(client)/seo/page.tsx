import Link from "next/link";
import { getPublishedSeoPages } from "@/queries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PublicHero } from "@/components/public/PublicHero";
import { DataRecoveryNotice } from "@/components/shared/DataRecoveryNotice";
import type { SeoPage } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Explore Our Expertise",
  description:
    "Explore VeilCode services, industries and markets. Find guidance and relevant projects for your next website, mobile app or AI automation build.",
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
      <PublicHero
        eyebrow="Explore our expertise"
        title={
          <>
            Find the right approach
            <br />
            <em>for your business.</em>
          </>
        }
        description="Explore services, industries and markets we support. Find practical guidance and relevant projects for what you want to build."
      />

      {failed ? (
        <DataRecoveryNotice
          eyebrow="Guides unavailable"
          title="We could not load the guides right now."
          description="The hub is still available, but the live page list could not be fetched right now. Refresh in a moment if you need the latest entries."
          retryLabel="Retry guides"
        />
      ) : (
        <section className="border-t border-line px-6 py-20 md:px-10">
          <div className="mx-auto max-w-300">
            <div className="mb-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                Services, industries & markets
              </p>
              <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-tight text-ink">
                Explore a topic
              </h2>
            </div>

            {pages.length === 0 ? (
              <div className="rounded-xl border border-line bg-surface p-8 text-sm text-ink-muted">
                New service and industry guides are on the way. Explore our
                services or contact us about your project.
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
                      {page.countryName || "Services & industries"}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-bold text-ink">
                      {page.title}
                    </h3>
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
