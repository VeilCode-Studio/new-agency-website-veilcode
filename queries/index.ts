import "server-only";

import { blogPosts, projects, services, seoPages, testimonials } from "@/db/schema";
import { db } from "@/db/drizzle";
import { and, eq, asc, desc } from "drizzle-orm";

// service database queries
export const getPublishedServices = async () => {
  const servicesData = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder));
  return servicesData;
};

export const getPublishedSeoServices = async () => {
  const servicesData = await db
    .select()
    .from(services)
    .where(and(eq(services.published, true), eq(services.seoEnabled, true)))
    .orderBy(asc(services.sortOrder));
  return servicesData;
};

export const getPublishedServiceBySlug = async (slug: string) => {
  const [service] = await db
    .select()
    .from(services)
    .where(
      and(
        eq(services.slug, slug),
        eq(services.published, true),
        eq(services.seoEnabled, true),
      ),
    )
    .limit(1);

  return service ?? null;
};

export const getPublishedSeoPages = async () => {
  const pages = await db
    .select()
    .from(seoPages)
    .where(and(eq(seoPages.published, true), eq(seoPages.indexable, true)))
    .orderBy(asc(seoPages.updatedAt));

  return pages;
};

export const getSeoPageBySlug = async (slug: string) => {
  const [page] = await db
    .select()
    .from(seoPages)
    .where(and(eq(seoPages.slug, slug), eq(seoPages.published, true)))
    .limit(1);

  return page ?? null;
};

// project database queries
export const getPublishedProjects = async () => {
  const projectsData = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder))
    .limit(3);
  return projectsData;
};

export const getAllProjects = async () => {
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder));
  return allProjects;
};

export const getProjectBySlug = async (slug: string) => {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);

  return project ?? null;
};

// testimonial database queries
export const getTestimonials = async () => {
  const rows = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.createdAt));

  return rows;
};


// blog database queries
export const getPublishedBlogs = async () => {
  const blogsData = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));
  return blogsData;
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  return blog[0];
};
