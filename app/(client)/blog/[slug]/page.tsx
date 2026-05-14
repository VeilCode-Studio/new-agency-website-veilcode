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

interface Params {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  const blogs = await getPublishedBlogs();

  return blogs.map((blog) => ({
    slug: blog.slug,
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
      authors: [blog.author.name],
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
          authorName: blog.author.name,
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

      <section className="py-16 px-6 md:px-10 xl:px-20 border-t border-line">
        <div className="max-w-300 mx-auto">
          <div className="flex flex-col lg:flex-row gap-14 xl:gap-20 items-start">
            <div className="min-w-0 flex-1 relative">
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
