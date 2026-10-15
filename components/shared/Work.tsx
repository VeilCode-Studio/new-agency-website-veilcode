
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  SectionTag,
  AccentLine,
  GhostButton,
} from "@/components/extras/Primitives";
import { cn } from "@/lib/utils";
import type { Project } from "@/db/schema";

type BentoLayout = {
  card: string;
  visual: string;
  title: string;
  summary: string;
  featured?: boolean;
};

const bentoLayouts: BentoLayout[] = [
  {
    card: "md:col-span-6 xl:col-span-7 xl:row-span-2 min-h-[480px] md:min-h-[560px]",
    visual: "from-black/85 via-black/35 to-transparent",
    title: "text-[clamp(28px,4vw,46px)] leading-[1.02]",
    summary: "text-[15px] md:max-w-130 line-clamp-3",
    featured: true,
  },
  {
    card: "md:col-span-3 xl:col-span-5 min-h-[340px]",
    visual: "from-black/80 via-black/30 to-transparent",
    title: "text-[clamp(22px,2.4vw,30px)] leading-tight",
    summary: "text-sm line-clamp-2",
  },
  {
    card: "md:col-span-3 xl:col-span-5 min-h-[340px]",
    visual: "from-black/80 via-black/30 to-transparent",
    title: "text-[clamp(22px,2.4vw,30px)] leading-tight",
    summary: "text-sm line-clamp-2",
  },
  {
    card: "md:col-span-3 xl:col-span-4 min-h-[320px]",
    visual: "from-black/82 via-black/35 to-transparent",
    title: "text-[clamp(21px,2vw,27px)] leading-tight",
    summary: "text-sm line-clamp-2",
  },
  {
    card: "md:col-span-3 xl:col-span-4 min-h-[320px]",
    visual: "from-black/82 via-black/35 to-transparent",
    title: "text-[clamp(21px,2vw,27px)] leading-tight",
    summary: "text-sm line-clamp-2",
  },
  {
    card: "md:col-span-6 xl:col-span-4 min-h-[320px]",
    visual: "from-black/82 via-black/35 to-transparent",
    title: "text-[clamp(21px,2vw,27px)] leading-tight",
    summary: "text-sm line-clamp-2",
  },
];

function getBentoLayout(index: number) {
  return bentoLayouts[index % bentoLayouts.length];
}

function WorkBentoCard({ project, index }: { project: Project; index: number }) {
  const layout = getBentoLayout(index);
  const { classes: c } = project;
  const shot = project.screenshots?.find((item) => item.src);

  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-xl border border-line bg-surface",
        "transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300 hover:-translate-y-1 hover:border-line-hi",
        c.hoverBorder,
        c.hoverShadow,
        layout.card
      )}
    >
      <Link
        href={`/work/${project.slug}`}
        aria-label={`View ${project.title} case study`}
        className="relative flex h-full min-h-[inherit] flex-col justify-end overflow-hidden"
      >
        {shot?.src ? (
          <Image
            src={shot.src}
            alt={shot.alt || `${project.title} preview`}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes={
              layout.featured
                ? "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 58vw"
                : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 34vw"
            }
            loading="lazy"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-linear-to-br to-surface", c.gradFrom)} />
        )}

        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-linear-to-t",
            layout.visual
          )}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div
          aria-hidden
          className={cn(
            "absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-linear-to-r from-current to-transparent transition-transform duration-500 group-hover:scale-x-100",
            c.accent
          )}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <span
              className={cn(
                "rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md",
                c.dimBg,
                c.border,
                c.accent
              )}
            >
              {project.serviceLabel || project.tags[0] || "Case Study"}
            </span>

            <span className="rounded border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/75 backdrop-blur-md">
              {project.year}
            </span>
          </div>

          <div className={cn("mt-16", layout.featured && "md:max-w-170")}>
            <div className="mb-4 flex items-end justify-between gap-5">
              <div>
                {project.metric && (
                  <p className={cn("mb-2 font-display text-5xl font-extrabold leading-none tracking-tight drop-shadow-md", c.accent)}>
                    {project.metric}
                  </p>
                )}
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">
                  {project.metricLabel}
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white backdrop-blur-md transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-white/15">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </div>

            <h3 className={cn("font-display font-extrabold tracking-tight text-white drop-shadow-md", layout.title)}>
              {project.title}
            </h3>
            <p className={cn("mt-3 max-w-150 font-sans leading-relaxed text-white/78", layout.summary)}>
              {project.summary}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function Work({ projects }: { projects: Project[] }) {

  return (
    <section id="work" className="py-32 px-6 md:px-10">
      <div className="max-w-300 mx-auto">

        {/* Header */}
        <div
          className="mb-16"
        >
          <div>
            <SectionTag>Selected Work</SectionTag>
            <AccentLine />
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <h2
              className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
                tracking-tight text-ink leading-[1.1]"
            >
              Products{" "}
              <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
                we&apos;ve built
              </span>
            </h2>

            <div>
              <GhostButton asChild>
                <Link href={"/work"}>View All Projects →</Link>
              </GhostButton>
            </div>
          </div>
        </div>

        {projects.length > 0 ? (
          <div
            className="grid grid-cols-1 gap-5 md:grid-cols-6 xl:grid-cols-12"
          >
            {projects.map((p, i) => (
              <WorkBentoCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl border border-line bg-surface px-6 py-10 text-center"
          >
            <p className="font-display text-xl font-bold text-ink">No selected work yet.</p>
            <p className="mt-2 font-sans text-sm text-ink-muted">
              Published projects will appear here once they are available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
