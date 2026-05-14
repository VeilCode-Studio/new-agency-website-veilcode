import { MetadataRoute } from "next";
import {
  getAllProjects,
  getPublishedBlogs,
  getPublishedSeoServices,
  getPublishedSeoPages,
} from "@/queries";
import { LOCATION_MARKETS } from "@/constants/locations";
import { SITE_URL } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [serviceResult, projectResult, blogResult, seoPageResult] = await Promise.allSettled([
    getPublishedSeoServices(),
    getAllProjects(),
    getPublishedBlogs(),
    getPublishedSeoPages(),
  ]);

  const serviceRows =
    serviceResult.status === "fulfilled" ? serviceResult.value : [];
  const projectRows =
    projectResult.status === "fulfilled" ? projectResult.value : [];
  const blogRows = blogResult.status === "fulfilled" ? blogResult.value : [];
  const seoPageRows = seoPageResult.status === "fulfilled" ? seoPageResult.value : [];

  const serviceUrls = serviceRows
    .filter((service) => service.slug)
    .map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: service.updatedAt ?? now,
    }));

  const projectUrls = projectRows.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: project.updatedAt ?? now,
  }));

  const blogUrls = blogRows.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? now,
  }));

  const seoPageUrls = seoPageRows.map((page) => ({
    url: `${SITE_URL}/seo/${page.slug}`,
    lastModified: page.updatedAt ?? now,
  }));

  const locationUrls = LOCATION_MARKETS.map((market) => ({
    url: `${SITE_URL}/locations/${market.slug}`,
    lastModified: now,
  }));

  return [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/work`, lastModified: now },
    { url: `${SITE_URL}/services`, lastModified: now },
    { url: `${SITE_URL}/contact`, lastModified: now },
    { url: `${SITE_URL}/about`, lastModified: now },
    { url: `${SITE_URL}/start`, lastModified: now },
    { url: `${SITE_URL}/blog`, lastModified: now },
    { url: `${SITE_URL}/seo`, lastModified: now },
    ...serviceUrls,
    ...locationUrls,
    ...seoPageUrls,
    ...projectUrls,
    ...blogUrls,
  ];
}
