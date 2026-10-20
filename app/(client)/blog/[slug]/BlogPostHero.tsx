import { publicImageSource } from "@/lib/public-image";
import Image from "next/image";
import { PublicHero } from "@/components/public/PublicHero";
import { formatDate, type BlogPost } from "@/constants/blog";
export function BlogPostHero({ post: p }: { post: BlogPost }) {
  return (
    <>
      <PublicHero
        eyebrow={p.category}
        parent={{ label: "Blog", href: "/blog" }}
        title={p.title}
        description={p.excerpt}
      >
        <p className="text-sm leading-relaxed text-ink-muted">
          By {p.author.name} ·{" "}
          <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time> ·{" "}
          {p.readTime}
        </p>
        <ul className="public-tags" aria-label="Article tags">
          {p.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </PublicHero>
      {p.heroSrc && (
        <div className="public-container py-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface">
            <Image
              src={publicImageSource(p.heroSrc)}
              alt={p.heroAlt}
              title={p.heroAlt || p.title}
              fill
              loading="lazy"
              sizes="(max-width:1264px) calc(100vw - 48px),1200px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
