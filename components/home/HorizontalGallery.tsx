"use client";

import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Children stay server-rendered; only the two scroll controls hydrate.
export function HorizontalGallery({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div
      className="home-gallery"
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
    >
      <div
        className="home-gallery-track"
        ref={track}
        tabIndex={0}
        aria-label={`${label}; scroll to explore`}
      >
        {children}
      </div>
      <div className="home-gallery-controls">
        <span>Explore the work</span>
        <button
          type="button"
          aria-label={`Previous ${label.toLowerCase()}`}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Next ${label.toLowerCase()}`}
          onClick={() => move(1)}
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
