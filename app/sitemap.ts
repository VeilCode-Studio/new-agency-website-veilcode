import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap{
    const baseUrl = `https://veilcode.studio`;

    // add projects to sitemap
    const projects = [
        {slug: "prestige-properties", lastModified: new Date()},
        {slug: "inspire-me-salon", lastModified: new Date()},
        { slug: "nexus-commerce", lastModified: new Date() },
        { slug: "flowmetrics-dashboard", lastModified: new Date() },
        { slug: "vantage-ai-agents", lastModified: new Date() },
        { slug: "tradepost-mobile", lastModified: new Date() },
        { slug: "brewed-social", lastModified: new Date() },
    ]

    const projectUrls = projects.map(project => ({
        url: `${baseUrl}/work/${project.slug}`,
        lastModified: project.lastModified,
    }))

    return [
        { url: baseUrl, lastModified: new Date() },
        { url: `${baseUrl}/work`, lastModified: new Date() },
        { url: `${baseUrl}/services`, lastModified: new Date() },
        { url: `${baseUrl}/contact`, lastModified: new Date() },
        {url: `${baseUrl}/about`, lastModified: new Date()},
        {url: `${baseUrl}/start`, lastModified: new Date()},
        { url: `${baseUrl}/blog`, lastModified: new Date() },
        ...projectUrls
    ]
}