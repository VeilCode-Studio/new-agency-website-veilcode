export const dynamic = "force-dynamic";
export const revalidate = 0;

import { CTA } from "@/components/shared/CTA";
import { BlogGrid } from "@/components/shared/BlogGrid";
import { Hero } from "@/components/shared/Hero";
import { Marquee } from "@/components/shared/Marquee";
import { Process } from "@/components/shared/Process";
import { Services } from "@/components/shared/Services";
import { TechStack } from "@/components/shared/TechStack";
import { Testimonials } from "@/components/shared/Testimonials";
import { Work } from "@/components/shared/Work";
import { TESTIMONIALS } from "@/constants";
import { POSTS } from "@/constants/blog";
import { getBlogGridPosts, toBlogGridPost } from "@/lib/blog/grid";
import { mapDbPostToClientPost } from "@/lib/blog/mappers";
import { toDisplayTestimonial, type DisplayTestimonial } from "@/lib/testimonials/display";
import {
  getPublishedBlogs,
  getPublishedProjects,
  getPublishedServices,
  getTestimonials,
} from "@/queries";
import { NewsletterCTA } from "./blog/[slug]/Newsletter";

async function getHomeBlogPosts() {
  try {
    const blogs = await getPublishedBlogs();
    if (blogs.length > 0) return blogs.map(mapDbPostToClientPost);
  } catch (error) {
    console.warn("[home] Falling back to static blog posts:", error);
  }

  return POSTS;
}

async function getHomeTestimonials(): Promise<DisplayTestimonial[]> {
  try {
    const rows = await getTestimonials();
    if (rows.length > 0) return rows.map(toDisplayTestimonial);
  } catch (error) {
    console.warn("[home] Falling back to static testimonials:", error);
  }

  return TESTIMONIALS.map((item) => ({
    ...item,
    avatar: null,
  }));
}

export default async function Home() {

  const [services, projects, blogs, testimonials] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
    getHomeBlogPosts(),
    getHomeTestimonials(),
  ]);
  const homeBlogPosts = getBlogGridPosts(blogs, { limit: 3 }).map(toBlogGridPost);

  return (
    <>
      <Hero />
      <Marquee />
      <Services services={services} />
      <Process />
      <Work projects={projects} />
      <BlogGrid
        posts={homeBlogPosts}
        eyebrow="Latest Thinking"
        title={
          <>
            Practical Notes From{" "}
            <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
              The Studio
            </span>
          </>
        }
        description="Engineering, design, automation, and growth lessons from real client work."
        ctaHref="/blog"
        ctaLabel="View All Posts ->"
      />
      <TechStack />
      <Testimonials items={testimonials} />
      <CTA />
      <NewsletterCTA />
    </>
  )
}
