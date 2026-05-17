"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedArrow, AccentLine, GhostButton, SectionTag } from "@/components/extras/Primitives";
import { fadeUp, stagger, useReveal } from "@/lib/motion";
import { formatDate } from "@/constants/blog";
import type { BlogGridPost } from "@/lib/blog/grid";
import { cn } from "@/lib/utils";

type BlogFilterState = {
  category: string;
  tag: string;
};

type BlogGridProps = {
  posts: BlogGridPost[];
  categories?: string[];
  tags?: string[];
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  showFilters?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

const CATEGORY_ACCENTS: Record<string, { active: string; dot: string }> = {
  All: { active: "bg-brand-dim border-brand-border text-brand", dot: "bg-brand" },
  Engineering: {
    active: "bg-svc-web-dim border-svc-web-border text-svc-web",
    dot: "bg-svc-web",
  },
  "AI & Automation": {
    active: "bg-svc-data-dim border-svc-data-border text-svc-data",
    dot: "bg-svc-data",
  },
  Design: {
    active: "bg-svc-mobile-dim border-svc-mobile-border text-svc-mobile",
    dot: "bg-svc-mobile",
  },
};

function accentFor(category: string) {
  return CATEGORY_ACCENTS[category] ?? CATEGORY_ACCENTS.Engineering;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort();
}

function BlogGridFilterBar({
  categories,
  tags,
  state,
  onChange,
  totalCount,
  filtered,
}: {
  categories: string[];
  tags: string[];
  state: BlogFilterState;
  onChange: (next: BlogFilterState) => void;
  totalCount: number;
  filtered: number;
}) {
  const allCategories = ["All", ...categories];

  function setCategory(category: string) {
    onChange({ category, tag: "" });
  }

  function toggleTag(tag: string) {
    onChange({ ...state, tag: state.tag === tag ? "" : tag });
  }

  return (
    <div className="sticky top-18 z-20 w-full min-w-0 max-w-full border-y border-line bg-page/90 backdrop-blur-md">
      <div className="mx-auto w-full min-w-0 max-w-300 space-y-3 px-5 py-4 sm:px-6 md:px-10">
        <div className="flex min-w-0 flex-wrap items-center gap-2" aria-label="Filter by category">
          {allCategories.map((category) => {
            const isActive = state.category === category;
            const styles = accentFor(category);

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(category)}
                className={cn(
                  "relative inline-flex max-w-full cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 font-sans text-[13px] font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand",
                  isActive
                    ? styles.active
                    : "border-line bg-surface text-ink-faint hover:border-line-hi hover:text-ink-muted",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="blog-filter-dot"
                    className={cn("size-1.5 rounded-full", styles.dot)}
                    aria-hidden
                  />
                )}
                {category}
                {category === "All" && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[10px]",
                      isActive ? "bg-white/10" : "bg-surface-hi",
                    )}
                  >
                    {totalCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="ml-auto hidden font-mono text-[11px] uppercase tracking-widest text-ink-faint sm:block">
            {filtered} {filtered === 1 ? "post" : "posts"}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Tags
            </span>
            {tags.map((tag) => {
              const isActive = state.tag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "max-w-full cursor-pointer rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand",
                    isActive
                      ? "border-brand-border bg-brand-dim text-brand"
                      : "border-line bg-surface text-ink-faint hover:border-line-hi hover:text-ink-muted",
                  )}
                >
                  {isActive && "x "}
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="col-span-full flex flex-col items-center gap-5 py-24 text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl border border-line bg-surface">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink-faint">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="mb-1 font-display text-lg font-bold text-ink">{title}</p>
        <p className="font-sans text-sm text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="cursor-pointer rounded-lg border border-brand-border bg-brand-dim px-5 py-2.5 font-sans text-sm text-brand transition-all duration-200 hover:bg-brand hover:text-page"
      >
        Clear filters
      </button>
    </motion.div>
  );
}

function CardVisual({ post }: { post: BlogGridPost }) {
  const { classes } = post;

  return (
    <div className={cn("relative aspect-[11/6] overflow-hidden bg-linear-to-br to-surface", classes.dimBg)}>
      <div
        aria-hidden
        className="absolute inset-0 bg-size-[28px_28px] opacity-20 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)]"
      />

      {[140, 88].map((size) => (
        <div
          key={size}
          aria-hidden
          className={cn(
            "absolute right-[-20%] top-1/2 -translate-y-1/2 rounded-full border opacity-10",
            classes.border,
          )}
          style={{ width: size, height: size }}
        />
      ))}

      {post.heroSrc ? (
        <Image
          src={post.heroSrc}
          alt={post.heroAlt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          fill
          loading="lazy"
          sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("flex size-10 items-center justify-center rounded-lg border opacity-60", classes.dimBg, classes.border)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className={classes.accent}>
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute left-3 top-3 z-10">
        <span
          className={cn(
            "rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-widest backdrop-blur-sm",
            classes.dimBg,
            classes.border,
            classes.accent,
          )}
        >
          {post.category}
        </span>
      </div>
    </div>
  );
}

function BlogCard({ post, index = 0 }: { post: BlogGridPost; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const { classes } = post;

  return (
    <motion.article
      variants={fadeUp(index * 0.06)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:bg-surface-hi",
        classes.border.replace("border-", "hover:border-"),
      )}
    >
      <div className={cn("h-0.5 w-0 bg-linear-to-r from-current to-transparent transition-all duration-500 group-hover:w-full", classes.accent)} />

      <CardVisual post={post} />

      <div className="flex min-w-0 flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md border font-display text-[10px] font-bold tracking-tight",
              post.author.dimBg,
              post.author.border,
              post.author.accent,
            )}
          >
            {post.author.initials}
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate font-sans text-xs text-ink-muted">{post.author.name}</span>
            <span className="text-ink-faint" aria-hidden>
              |
            </span>
            <span className="whitespace-nowrap font-sans text-xs text-ink-faint">
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>

        <h3 className="mb-2.5 line-clamp-2 break-words font-display text-[17px] font-bold leading-snug tracking-tight text-ink">
          {post.title}
        </h3>

        <p className="mb-5 line-clamp-3 flex-1 break-words font-sans text-sm font-light leading-relaxed text-ink-muted">
          {post.excerpt}
        </p>

        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded border border-line bg-page px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-ink-faint"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="font-mono text-[9px] text-ink-faint">+{post.tags.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {post.readTime}
          </span>

          <Link
            href={`/blog/${post.slug}`}
            className={cn(
              "inline-flex items-center gap-1.5 font-sans text-[13px] font-medium no-underline transition-colors duration-200",
              classes.accent,
            )}
          >
            Read
            <AnimatedArrow hovered={hovered} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function BlogGrid({
  posts,
  categories,
  tags,
  eyebrow = "Insights",
  title,
  description,
  ctaHref,
  ctaLabel = "View All Posts ->",
  showFilters = false,
  emptyTitle = "No posts match that filter",
  emptyDescription = "Try a different category or clear the tag filter.",
  className,
}: BlogGridProps) {
  const [ref, inView] = useReveal();
  const [filter, setFilter] = useState<BlogFilterState>({ category: "All", tag: "" });
  const derivedCategories = useMemo(() => categories ?? uniqueValues(posts.map((post) => post.category)), [categories, posts]);
  const derivedTags = useMemo(() => tags ?? uniqueValues(posts.flatMap((post) => post.tags)), [tags, posts]);

  const filteredPosts = useMemo(() => {
    if (!showFilters) return posts;

    return posts.filter((post) => {
      const categoryOk = filter.category === "All" || post.category === filter.category;
      const tagOk = filter.tag === "" || post.tags.includes(filter.tag);
      return categoryOk && tagOk;
    });
  }, [filter, posts, showFilters]);

  function reset() {
    setFilter({ category: "All", tag: "" });
  }

  return (
    <section className={cn("w-full min-w-0 max-w-full overflow-x-clip px-6 py-32 md:px-10", className)}>
      <div className="mx-auto w-full max-w-300">
        {(title || description || ctaHref) && (
          <motion.div
            ref={ref}
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mb-16"
          >
            <motion.div variants={fadeUp()}>
              <SectionTag>{eyebrow}</SectionTag>
              <AccentLine />
            </motion.div>

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                {title && (
                  <motion.h2
                    variants={fadeUp(0.1)}
                    className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold leading-[1.1] tracking-tight text-ink"
                  >
                    {title}
                  </motion.h2>
                )}
                {description && (
                  <motion.p
                    variants={fadeUp(0.16)}
                    className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ink-muted"
                  >
                    {description}
                  </motion.p>
                )}
              </div>

              {ctaHref && (
                <motion.div variants={fadeUp(0.18)} className="shrink-0">
                  <GhostButton>
                    <Link href={ctaHref}>{ctaLabel}</Link>
                  </GhostButton>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {showFilters && (
        <BlogGridFilterBar
          categories={derivedCategories}
          tags={derivedTags}
          state={filter}
          onChange={setFilter}
          totalCount={posts.length}
          filtered={filteredPosts.length}
        />
      )}

      <div
        className={cn(
          "mx-auto w-full min-w-0 max-w-300",
          showFilters && "px-5 pt-14 sm:px-6 md:px-10",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter.category}-${filter.tag}-${showFilters ? "filtered" : "static"}`}
            variants={stagger}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))
            ) : (
              <EmptyState title={emptyTitle} description={emptyDescription} onReset={reset} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
