// export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

import { notFound } from "next/navigation";
import { BlogPostHero } from "./BlogPostHero";
import { SocialShare } from "./SocialShare";
import { ArticleBody } from "./ArticleBody";
import { ArticleSidebar } from "./ArticleSidebar";
import { NewsletterCTA } from "./Newsletter";
import { RelatedPosts } from "./RelatedPosts";
import { getBlogBySlug, getPublishedBlogs } from "@/queries";
import { mapDbPostToClientPost } from "@/lib/blog/mappers";
import { StructuredData } from "@/lib/seo/StructuredData";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { FOUNDER_NAME } from "@/lib/seo/site";
import { POSTS } from "@/constants/blog";

interface Params {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  try {
    const blogs = await getPublishedBlogs();

    if (blogs.length > 0) {
      return blogs.map((blog) => ({
        slug: blog.slug,
      }));
    }
  } catch (error) {
    console.warn("[blog/[slug]] falling back to static post slugs:", error);
  }

  return POSTS.map((post) => ({
    slug: post.slug,
  }));
};

export const generateMetadata = async ({ params }: Params) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return {};

  const metadata = buildPageMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blog/${blog.slug}`,
    image: blog.heroSrc,
    type: "article",
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: blog.publishedAt.toISOString(),
      authors: [FOUNDER_NAME],
      tags: blog.tags,
    },
  };
};

const SingleBlogPage = async ({ params }: Params) => {
  const { slug } = await params;

  const blog = await getBlogBySlug(slug);

  if (!blog) return notFound();

  const post = mapDbPostToClientPost(blog);

  const allBlogs = await getPublishedBlogs();

  const related = allBlogs
    .filter((item) => item.slug !== blog.slug)
    .filter(
      (item) =>
        item.category === blog.category ||
        item.tags.some((tag) => blog.tags.includes(tag))
    )
    .slice(0, 3)
    .map(mapDbPostToClientPost);

  return (
    <>
      <StructuredData
        data={articleJsonLd({
          title: blog.title,
          description: blog.excerpt,
          path: `/blog/${blog.slug}`,
          publishedAt: blog.publishedAt,
          updatedAt: blog.updatedAt,
          authorName: FOUNDER_NAME,
          image: blog.heroSrc,
        })}
      />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: blog.title, href: `/blog/${blog.slug}` },
        ])}
      />
      <BlogPostHero post={post} />

      <section className="w-full min-w-0 max-w-full overflow-x-clip border-t border-line px-5 py-16 sm:px-6 md:px-10 xl:px-20">
        <div className="mx-auto w-full min-w-0 max-w-300">
          <div className="flex w-full min-w-0 flex-col items-start gap-14 lg:flex-row xl:gap-20">
            <div className="relative w-full min-w-0 flex-1">
              <SocialShare post={post} />
              <ArticleBody blocks={post.body} />
            </div>

            <ArticleSidebar post={post} />
          </div>
        </div>
      </section>

      <NewsletterCTA />

      <RelatedPosts posts={related} />
    </>
  );
};

export default SingleBlogPage;
