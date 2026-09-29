"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { stagger } from "@/lib/motion";
import { StatItem } from "../extras/StatItem";
import { STATS } from "@/constants";

/**
 * Client-only motion pieces for the homepage hero. The hero's H1 and intro
 * paragraph stay in the server component and are passed through as children,
 * so they are plain server-rendered HTML with no JS or opacity dependency.
 */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Live prefers-reduced-motion value. The server snapshot is `false`, so the
// server HTML and hydration agree; React re-renders if the client differs.
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/** Scroll parallax around the hero content. Disabled under reduced motion. */
export function HeroParallax({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 80]);
  const opacity = useTransform(scrollY, [300, 800], [1, 0]);

  return (
    <motion.div style={reduced ? undefined : { y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

function useTypewriter(words: readonly string[], enabled: boolean) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const current = words[wordIdx];
    const id = setTimeout(
      () => {
        if (!deleting) {
          setText(current.slice(0, charIdx + 1));
          if (charIdx + 1 === current.length) {
            setTimeout(() => setDeleting(true), 1800);
          } else {
            setCharIdx((c) => c + 1);
          }
        } else {
          setText(current.slice(0, charIdx - 1));
          if (charIdx - 1 === 0) {
            setDeleting(false);
            setWordIdx((i) => (i + 1) % words.length);
            setCharIdx(0);
          } else {
            setCharIdx((c) => c - 1);
          }
        }
      },
      deleting ? 38 : 78
    );
    return () => clearTimeout(id);
  }, [charIdx, deleting, enabled, wordIdx, words]);

  return text;
}

/**
 * Decorative line under the intro paragraph. Hidden from assistive tech; the
 * same information is already in the H1. Under reduced motion it shows all
 * words at once instead of typing.
 */
export function HeroTypewriter({ words }: { words: readonly string[] }) {
  const reduced = usePrefersReducedMotion();
  const typed = useTypewriter(words, !reduced);

  return (
    <p
      aria-hidden="true"
      className="font-mono text-sm tracking-wide text-brand mb-10 min-h-[1.5em]"
    >
      <span className="text-ink-faint">&gt; </span>
      {reduced ? (
        words.join(" · ")
      ) : (
        <>
          {typed}
          <span className="animate-blink motion-reduce:animate-none">|</span>
        </>
      )}
    </p>
  );
}

export function HeroStats() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-10 md:gap-16 mb-10 mt-5"
    >
      {STATS.map((s) => (
        <StatItem key={s.val} {...s} />
      ))}
    </motion.div>
  );
}

/** Bouncing "Scroll" cue. Static under reduced motion. */
export function HeroScrollCue() {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      animate={reduced ? undefined : { y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2
        flex flex-col items-center gap-2 pointer-events-none"
      aria-hidden
    >
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint">
        Scroll
      </span>
      <div className="w-px h-10 bg-linear-to-b from-brand to-transparent" />
    </motion.div>
  );
}
