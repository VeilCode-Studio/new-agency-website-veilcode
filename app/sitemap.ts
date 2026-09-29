import { MetadataRoute } from "next";
import {
  getAllProjects,
  getPublishedBlogs,
  getPublishedSeoServices,
  getPublishedSeoPages,
} from "@/queries";
import { LOCATION_MARKETS } from "@/constants/locations";
import { pageUrl } from "@/lib/seo/site";

// Regenerate hourly so URLs and DB-driven lastmod values track the database
// instead of freezing at build time.
export const revalidate = 3600;

/**
 * Last-modified dates for pages whose content lives in code. Update a date
 * only when that page's content actually changes, so lastmod stays truthful.
 */
const STATIC_PAGE_LASTMOD: Record<string, string> = {
  "/": "2026-09-29",
  "/work": "2026-09-29",
  "/services": "2026-09-29",
  "/contact": "2026-09-29",
  "/about": "2026-09-29",
  "/start": "2026-09-29",
  "/blog": "2026-09-29",
  "/seo": "2026-09-29",
};

/** Same idea for the location pages, keyed by market slug. */
const LOCATION_LASTMOD: Record<string, string> = {
  uganda: "2026-09-29",
  "united-states": "2026-09-29",
  "united-kingdom": "2026-09-29",
  canada: "2026-09-29",
  australia: "2026-09-29",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fail loudly rather than publish a partial sitemap: if any query throws,
  // revalidation keeps serving the last complete sitemap.
  const [serviceRows, projectRows, blogRows, seoPageRows] = await Promise.all([
    getPublishedSeoServices(),
    getAllProjects(),
    getPublishedBlogs(),
    getPublishedSeoPages(),
  ]);

  const staticUrls = Object.entries(STATIC_PAGE_LASTMOD).map(([path, date]) => ({
    url: pageUrl(path),
    lastModified: date,
  }));

  const serviceUrls = serviceRows
    .filter((service) => service.slug)
    .map((service) => ({
      url: pageUrl(`/services/${service.slug}`),
      lastModified: service.updatedAt,
    }));

  const locationUrls = LOCATION_MARKETS.map((market) => ({
    url: pageUrl(`/locations/${market.slug}`),
    // Omit lastmod rather than invent one for a market missing from the map.
    ...(LOCATION_LASTMOD[market.slug] ? { lastModified: LOCATION_LASTMOD[market.slug] } : {}),
  }));

  const seoPageUrls = seoPageRows.map((page) => ({
    url: pageUrl(`/seo/${page.slug}`),
    lastModified: page.updatedAt,
  }));

  const projectUrls = projectRows.map((project) => ({
    url: pageUrl(`/work/${project.slug}`),
    lastModified: project.updatedAt,
  }));

  const blogUrls = blogRows.map((post) => ({
    url: pageUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
  }));

  return [
    ...staticUrls,
    ...serviceUrls,
    ...locationUrls,
    ...seoPageUrls,
    ...projectUrls,
    ...blogUrls,
  ];
}
