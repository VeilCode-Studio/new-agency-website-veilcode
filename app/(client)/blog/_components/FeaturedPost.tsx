import { publicImageSource } from "@/lib/public-image";
import Link from "next/link";
import { AnimatedArrow } from "@/components/extras/Primitives";
import { formatDate, type BlogPost } from "@/constants/blog";
import Image from "next/image";

// hero image placeholder

function FeaturedVisual({ post: p }: { post: BlogPost }) {
  const { classes: c } = p;
  return (
    <div
      className={`relative w-full h-full min-h-60 overflow-hidden
      bg-linear-to-br ${c.dimBg} to-surface`}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25
        [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),
        linear-gradient(90deg,var(--color-line)_1px,transparent_1px)]
        bg-size-[36px_36px]"
      />

      {/* Concentric rings */}
      {[220, 160, 100, 52].map((size, i) => (
        <div
          key={size}
          aria-hidden
          className={`absolute rounded-full border
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            ${c.border} opacity-[${0.06 + i * 0.04}]`}
          style={{ width: size, height: size }}
        />
      ))}

      {/* Corner brackets */}
      {[
        "top-4 left-4 border-t-2 border-l-2",
        "top-4 right-4 border-t-2 border-r-2",
        "bottom-4 left-4 border-b-2 border-l-2",
        "bottom-4 right-4 border-b-2 border-r-2",
      ].map((pos) => (
        <div
          key={pos}
          aria-hidden
          className={`absolute size-6 rounded-sm opacity-30 ${pos} ${c.border}`}
        />
      ))}

      {p.heroSrc ? (
        <Image
          src={publicImageSource(p.heroSrc)}
          alt={p.heroAlt}
          title={p.heroAlt || p.title}
          className="absolute inset-0 w-full h-full object-cover"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div
            className={`size-14 rounded-xl border flex items-center justify-center
            ${c.dimBg} ${c.border}`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className={c.accent}
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M21 15l-5-5L5 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-ink-faint">
            {p.category}
          </span>
        </div>
      )}

      {/* Category badge overlaid */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`font-mono text-[10px] tracking-widest uppercase
          px-2.5 py-1.5 rounded border backdrop-blur-sm
          ${c.dimBg} ${c.border} ${c.accent}`}
        >
          {p.category}
        </span>
      </div>
    </div>
  );
}

// featured post

export function FeaturedPost({ post: p }: { post: BlogPost }) {
  const { classes: c } = p;

  return (
    <section className="w-full min-w-0 max-w-full overflow-x-clip border-b border-line px-5 pb-8 sm:px-6 md:px-10">
      <div className="mx-auto w-full min-w-0 max-w-300">
        <div>
          {/* Section label */}
          <p
            className="font-mono text-[11px] tracking-widest uppercase
            text-ink-faint mb-6"
          >
            Featured
          </p>

          {/* Card */}
          <article
            className={`group relative grid min-w-0 grid-cols-1 lg:grid-cols-2
              rounded-2xl overflow-hidden border transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300
              border-line hover:${c.border.replace("border-", "border-")}`}
          >
            {/* Top accent bar — slides in on hover */}
            <div
              className={`absolute top-0 inset-x-0 h-0.5 z-10
              bg-linear-to-r from-current via-current to-transparent
              w-full origin-left scale-x-0 group-hover:scale-x-100 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-500 ${c.accent}`}
            />

            {/* Visual panel */}
            <div className="lg:order-2 aspect-11/6 lg:aspect-auto">
              <FeaturedVisual post={p} />
            </div>

            {/* Content panel */}
            <div
              className={`flex min-w-0 flex-col justify-between p-6 sm:p-8 md:p-10
              bg-surface group-hover:bg-surface-hi transition-colors duration-300`}
            >
              {/* Top — meta */}
              <div>
                {/* Author + date */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`size-9 rounded-lg border flex items-center
                    justify-center font-display font-bold text-[12px] tracking-tight
                    ${p.author.dimBg} ${p.author.border} ${p.author.accent}`}
                  >
                    {p.author.initials}
                  </div>
                  <div>
                    <p className="font-sans text-xs font-medium text-ink leading-none mb-0.5">
                      {p.author.name}
                    </p>
                    <p className="font-sans text-[11px] text-ink-faint leading-none">
                      {formatDate(p.publishedAt)} · {p.readTime}
                    </p>
                  </div>
                </div>

                <h2
                  className="font-display text-[clamp(22px,3vw,36px)] font-extrabold
                  tracking-tight leading-[1.1] text-ink mb-4 break-words"
                >
                  {p.title}
                </h2>

                <p
                  className="font-sans text-[15px] font-light text-ink-muted
                  leading-relaxed mb-6 break-words"
                >
                  {p.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {p.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] tracking-widest uppercase
                        px-2.5 py-1 rounded border border-line bg-page
                        text-ink-faint"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom — CTA */}
              <Link
                href={`/blog/${p.slug}`}
                className={`inline-flex items-center gap-2 font-sans text-[15px]
                  font-medium no-underline transition-colors duration-200 ${c.accent}`}
              >
                Read Article
                <AnimatedArrow hovered={false} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
