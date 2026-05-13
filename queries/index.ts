// import "server-only";

import { projects, services } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq, asc } from "drizzle-orm";

// service database queries
export const getPublishedServices = async () => {
    const servicesData = await db.select()
        .from(services)
        .where(eq(services.published, true))
        .orderBy(asc(services.sortOrder));
    return servicesData;
}

// project database queries
export const getPublishedProjects = async () => {
    const projectsData = await db.select()
        .from(projects)
        .where(eq(projects.published, true))
        .orderBy(asc(projects.year)).limit(3);
    return projectsData;
}

