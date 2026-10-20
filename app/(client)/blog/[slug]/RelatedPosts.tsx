import Link from "next/link";
import { AnimatedArrow } from "@/components/extras/Primitives";
import { formatDate, type BlogPost } from "@/constants/blog";

// related card

function RelatedCard({ post: p }: { post: BlogPost; index: number }) {
  const { classes: c } = p;

  return (
    <article
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-xl
        border border-line bg-surface transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300
        hover:bg-surface-hi ${c.border.replace("border-", "hover:border-")}`}
    >
      {/* Top accent bar */}
      <div
        className={`h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-500
        bg-linear-to-r from-current to-transparent ${c.accent}`}
      />

      {/* Hero placeholder */}
      <div
        className={`relative h-40 overflow-hidden
        bg-linear-to-br ${c.dimBg} to-surface`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20
          linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)
          bg-size-[28px_28px]"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`font-mono text-[9px] tracking-widest uppercase
            px-2 py-1 rounded border ${c.dimBg} ${c.border} ${c.accent}`}
          >
            {p.category}
          </span>
        </div>
        {/* Author avatar */}
        <div className="absolute bottom-3 right-3">
          <div
            className={`size-8 rounded-lg border flex items-center justify-center
            font-display font-bold text-[11px] tracking-tight
            ${p.author.dimBg} ${p.author.border} ${p.author.accent}`}
          >
            {p.author.initials}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-6">
        <h3
          className="font-display text-[17px] font-bold tracking-tight
          text-ink mb-2 leading-snug wrap-break-word"
        >
          {p.title}
        </h3>
        <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5 flex-1 line-clamp-2 wrap-break-word">
          {p.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-sans text-xs text-ink-faint">
            {formatDate(p.publishedAt)}
          </span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-ink-faint">
            {p.readTime}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/blog/${p.slug}`}
          className={`inline-flex items-center gap-1.5 font-sans text-[13px]
            font-medium no-underline transition-colors duration-200 ${c.accent}`}
        >
          Read Article
          <AnimatedArrow hovered={false} />
        </Link>
      </div>
    </article>
  );
}

// related posts

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="w-full min-w-0 max-w-full overflow-x-clip border-t border-line px-5 py-24 sm:px-6 md:px-10 xl:px-20">
      <div className="mx-auto w-full min-w-0 max-w-300">
        <div>
          <div className="mb-10">
            <p
              className="font-mono text-[11px] tracking-widest uppercase
              text-ink-faint mb-2"
            >
              Continue Reading
            </p>
            <h2
              className="font-display text-[clamp(22px,3vw,36px)] font-extrabold
              tracking-tight text-ink"
            >
              Related{" "}
              <span className="text-brand drop-shadow-[0_0_20px_var(--color-brand-glow)]">
                Articles
              </span>
            </h2>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
            {posts.map((p, i) => (
              <RelatedCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
