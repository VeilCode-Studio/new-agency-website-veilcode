// Public content is regenerated every five minutes and invalidated by CMS writes.
export const revalidate = 300;

import { buildPageMetadata } from "@/lib/seo/metadata";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION } from "@/lib/seo/site";
import { Homepage } from "@/components/home/Homepage";
import "@/components/home/homepage.css";
import { getBlogGridPosts, toBlogGridPost } from "@/lib/blog/grid";
import { mapDbPostToClientPost } from "@/lib/blog/mappers";
import { toDisplayTestimonial, type DisplayTestimonial } from "@/lib/testimonials/display";
import {
  getPublishedBlogs,
  getPublishedProjects,
  getPublishedSeoServices,
  getTestimonials,
} from "@/queries";
import { NewsletterCTA } from "./blog/[slug]/Newsletter";

export const metadata = buildPageMetadata({
  title: "Web Design & App Development in Kampala | VeilCode Studio",
  description: SITE_DESCRIPTION,
  path: "/",
  image: DEFAULT_OG_IMAGE,
});

// Query failures must throw so ISR retains the last good page instead of
// caching fallback content after an outage or republishing removed seed posts.
async function getHomeBlogPosts() {
  return (await getPublishedBlogs()).map(mapDbPostToClientPost);
}

async function getHomeTestimonials(): Promise<DisplayTestimonial[]> {
  return (await getTestimonials()).map(toDisplayTestimonial);
}

export default async function Home() {

  const [services, projects, blogs, testimonials] = await Promise.all([
    getPublishedSeoServices(),
    getPublishedProjects(),
    getHomeBlogPosts(),
    getHomeTestimonials(),
  ]);
  const homeBlogPosts = getBlogGridPosts(blogs, { limit: 3 }).map(toBlogGridPost);

  return (
    <>
      <Homepage services={services} projects={projects} posts={homeBlogPosts} testimonials={testimonials} />
      <NewsletterCTA />
    </>
  )
}
