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
import { POSTS } from "@/constants/blog";
import { getBlogGridPosts, toBlogGridPost } from "@/lib/blog/grid";
import { mapDbPostToClientPost } from "@/lib/blog/mappers";
import { getPublishedBlogs, getPublishedProjects, getPublishedServices } from "@/queries";

async function getHomeBlogPosts() {
  try {
    const blogs = await getPublishedBlogs();
    if (blogs.length > 0) return blogs.map(mapDbPostToClientPost);
  } catch (error) {
    console.warn("[home] Falling back to static blog posts:", error);
  }

  return POSTS;
}

export default async function Home() {

  const [services, projects, blogs] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
    getHomeBlogPosts(),
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
      <Testimonials />
      <CTA />
    </>
  )
}
