// import "server-only";

import { blogPosts, projects, services } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq, asc, desc } from "drizzle-orm";

// service database queries
export const getPublishedServices = async () => {
  const servicesData = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder));
  return servicesData;
};

// project database queries
export const getPublishedProjects = async () => {
  const projectsData = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.year))
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
