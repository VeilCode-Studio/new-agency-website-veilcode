"use client";

import Link from "next/link";
import * as m from "framer-motion/m";
import { GridBg, GlowOrb, SectionTag, AccentLine } from "@/components/extras/Primitives";
import { fadeUp, stagger } from "@/lib/motion";
import { getProjectKindLabel } from "@/lib/projects/kind";

// image placeholder

export function ScreenshotPlaceholder({
  alt,
  caption,
  accent,
  dimBg,
  border,
}: {
  alt:     string;
  caption: string;
  accent:  string;
  dimBg:   string;
  border:  string;
}) {
  return (
    <figure className="group w-full">
      {/* Placeholder panel */}
      <div
        className={`relative w-full overflow-hidden rounded-xl border ${border}
          bg-linear-to-br ${dimBg} to-surface-hi
          flex flex-col items-center justify-center gap-4
          min-h-60 sm:min-h-80 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300
          hover:border-opacity-60`}
        role="img"
        aria-label={alt}
      >
        {/* Grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-20
            bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)]
            bg-size-[32px_32px]"
        />

        {/* Corner brackets */}
        <div aria-hidden className={`absolute top-3 left-3 size-5 border-t-2 border-l-2 rounded-tl-sm opacity-40 ${border}`} />
        <div aria-hidden className={`absolute top-3 right-3 size-5 border-t-2 border-r-2 rounded-tr-sm opacity-40 ${border}`} />
        <div aria-hidden className={`absolute bottom-3 left-3 size-5 border-b-2 border-l-2 rounded-bl-sm opacity-40 ${border}`} />
        <div aria-hidden className={`absolute bottom-3 right-3 size-5 border-b-2 border-r-2 rounded-br-sm opacity-40 ${border}`} />

        {/* Icon + label */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
          <div className={`size-12 rounded-xl border flex items-center justify-center ${dimBg} ${border}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className={accent}>
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className={`font-mono text-[11px] tracking-widest uppercase ${accent}`}>
            Screenshot
          </p>
          <p className="font-sans text-xs text-ink-faint max-w-50 leading-relaxed">
            {alt}
          </p>
        </div>

        {/* "Replace me" badge */}
        <div className="absolute bottom-3 right-14">
          <span className="font-mono text-[9px] tracking-widest uppercase
            px-2 py-1 rounded border border-line bg-surface text-ink-faint">
            /public/work/{"{slug}"}/{"{filename}"}.png
          </span>
        </div>
      </div>

      {/* Caption */}
      <figcaption className="mt-2.5 font-sans text-xs text-ink-faint text-center">
        {caption}
      </figcaption>
    </figure>
  );
}

function HeroScreenshot({ project: p }: { project: Project }) {
  const { classes: c } = p;
  const shot = p.screenshots[0];
  const isMobileApp = p.service === "mobile";

  if (!shot?.src) {
    return (
      <ScreenshotPlaceholder
        alt={shot?.alt ?? `${p.title} - hero screenshot`}
        caption={shot?.caption ?? "Hero screenshot"}
        accent={c.accent}
        dimBg={c.dimBg}
        border={c.border}
      />
    );
  }

  if (isMobileApp) {
    return (
      <figure className="mx-auto max-w-105">
        <div
          className={`relative mx-auto rounded-[2rem] border ${c.border}
            bg-page p-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)]`}
        >
          <div className="pointer-events-none absolute left-1/2 top-3 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-line" />
          <div className="relative aspect-9/19.5 overflow-hidden rounded-[1.55rem] bg-surface-hi">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              decoding="async"
              width={420}
              height={910}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <figcaption className="mt-3 font-sans text-xs text-ink-faint text-center">
          {shot.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.src}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl border border-line object-cover"
      />
      <figcaption className="mt-3 font-sans text-xs text-ink-faint text-center">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

// case study hero

// Results strip layout — a project may carry anywhere from 1 to 4+ results,
// so both the column count and the cell dividers are derived from the total.
function resultsGridCols(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-3";
  return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
}

function resultsCellBorder(i: number, count: number, border: string) {
  if (count === 1) return "";
  if (count === 2) return i === 0 ? `border-r ${border}` : "";
  if (count === 3)
    return i < 2 ? `border-b sm:border-b-0 sm:border-r ${border}` : "";
  return i < count - 1
    ? `border-r ${border} max-md:even:border-r-0 max-md:border-b`
    : "";
}

export function CaseStudyHero({ project: p }: { project: Project }) {
  const { classes: c } = p;

  return (
    <section className="relative overflow-hidden">
      <GridBg />
      <GlowOrb color="rgba(0,229,255,0.08)" size={500} top="0%"   left="55%" />
      <GlowOrb
        color={`rgba(0,229,255,0.05)`}
        size={360}
        bottom="0%"
        left="0%"
        delay="2s"
      />

      {/* Scan line */}
      <div aria-hidden className="absolute inset-x-0 h-px pointer-events-none
        bg-linear-to-r from-transparent via-brand/20 to-transparent
        animate-scan" />

      <div className="relative z-10 max-w-300 mx-auto px-6 md:px-10 pt-36 pb-16">
        <m.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb */}
          <m.div variants={fadeUp(0)} className="flex items-center gap-2 mb-8">
            <Link href="/work"
              className="font-mono text-[11px] tracking-widest uppercase
                text-ink-faint hover:text-ink transition-colors duration-200 no-underline">
              Work
            </Link>
            <span className="text-ink-faint" aria-hidden>/</span>
            <span className={`font-mono text-[11px] tracking-widest uppercase ${c.accent}`}>
              {p.title}
            </span>
          </m.div>

          {/* Tag + build kind */}
          <m.div variants={fadeUp(0.04)}>
            <div className="flex flex-wrap items-center gap-3">
              <SectionTag>{p.serviceLabel}</SectionTag>
              <span className="font-mono text-[10px] tracking-widest uppercase
                text-ink-muted bg-surface border border-line px-3 py-1.5 rounded">
                {getProjectKindLabel(p.client)}
              </span>
            </div>
            <AccentLine width={48} />
          </m.div>

          {/* Headline */}
          <m.h1
            variants={fadeUp(0.08)}
            className="font-display font-extrabold leading-[1.02] tracking-tight
              text-[clamp(36px,5.5vw,72px)] text-ink mb-4 max-w-220"
          >
            {p.title}
          </m.h1>

          {/* Client / industry / year row */}
          <m.div
            variants={fadeUp(0.12)}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8"
          >
            <span className="font-sans text-sm text-ink-muted">{p.client}</span>
            <span className="size-1 rounded-full bg-line" aria-hidden />
            <span className="font-sans text-sm text-ink-muted">{p.industry}</span>
            <span className="size-1 rounded-full bg-line" aria-hidden />
            <span className="font-sans text-sm text-ink-muted">{p.year}</span>
          </m.div>

          {/* Summary */}
          <m.p
            variants={fadeUp(0.16)}
            className="font-sans font-light text-lg text-ink-muted
              leading-relaxed max-w-170 mb-10"
          >
            {p.summary}
          </m.p>

          {/* Meta row — duration, team, tags */}
          <m.div
            variants={fadeUp(0.2)}
            className="flex flex-wrap gap-2 mb-14"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px]
              tracking-widest uppercase text-ink-faint
              bg-surface border border-line px-3 py-1.5 rounded-lg">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {p.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px]
              tracking-widest uppercase text-ink-faint
              bg-surface border border-line px-3 py-1.5 rounded-lg">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {p.team}
            </span>
            {p.tags.map((tag) => (
              <span key={tag}
                className="font-mono text-[10px] tracking-widest uppercase
                  px-3 py-1.5 rounded-lg border border-line bg-surface text-ink-faint">
                {tag}
              </span>
            ))}
          </m.div>

          {/* Results strip — column count follows the number of results */}
          {p.results.length > 0 && (
          <m.div
            variants={fadeUp(0.26)}
            className={`grid gap-0 ${resultsGridCols(p.results.length)}
              border ${c.border} rounded-2xl overflow-hidden mb-16`}
          >
            {p.results.map((r, i) => (
              <div
                key={r.label}
                className={`p-5 ${c.dimBg} ${resultsCellBorder(i, p.results.length, c.border)}`}
              >
                <div className={`font-display font-extrabold text-xl sm:text-[30px] md:text-[36px] tracking-tight
                  leading-none mb-1.5 drop-shadow-[0_0_20px_currentColor] ${c.accent}`}>
                  {r.metric}
                </div>
                <div className="font-sans text-sm font-medium text-ink mb-0.5">{r.label}</div>
                <div className="font-sans text-xs text-ink-faint">{r.sub}</div>
              </div>
            ))}
          </m.div>
          )}

          {/* Hero screenshot — always wide */}
          <m.div variants={fadeUp(0.32)}>
            {p.screenshots[0]?.src ? (
              p.service === "mobile" ? (
                <HeroScreenshot project={p} />
              ) : (
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.screenshots[0].src}
                  alt={p.screenshots[0].alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-2xl border border-line object-cover"
                />
                <figcaption className="mt-3 font-sans text-xs text-ink-faint text-center">
                  {p.screenshots[0].caption}
                </figcaption>
              </figure>
              )
            ) : (
              <ScreenshotPlaceholder
                alt={p.screenshots[0]?.alt ?? `${p.title} — hero screenshot`}
                caption={p.screenshots[0]?.caption ?? "Hero screenshot"}
                accent={c.accent}
                dimBg={c.dimBg}
                border={c.border}
              />
            )}
          </m.div>
        </m.div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-24
        bg-linear-to-t from-page to-transparent pointer-events-none" />
    </section>
  );
}
