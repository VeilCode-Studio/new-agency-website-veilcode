import React from "react";
import type { DisplayTestimonial } from "@/lib/testimonials/display";

export function TestimonialCard({ item }: { item: DisplayTestimonial }) {
  return (
    <blockquote
      key={item.name}
      className="bg-page border border-line rounded-2xl px-8 md:px-14 py-12 m-0"
    >
      {/* Open quote */}
      <span
        aria-hidden
        className="block font-serif text-5xl leading-none text-brand/30 mb-6 select-none"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <p className="font-sans text-lg font-light text-ink leading-[1.8] mb-9 italic">
        {item.quote}
      </p>

      {/* Attribution */}
      <footer className="flex items-center justify-center gap-3.5">
        <div
          className="size-11 rounded-full flex items-center justify-center shrink-0
            bg-linear-to-br from-brand/20 to-brand/5
            border border-brand-border
            overflow-hidden font-mono text-[12px] font-medium text-brand"
        >
          {item.avatar ? (
            <span
              aria-hidden
              className="size-full bg-cover bg-center"
              style={{ backgroundImage: `url(${item.avatar})` }}
            />
          ) : (
            item.initials
          )}
        </div>
        <div className="text-left">
          <cite className="not-italic font-sans text-[14px] font-medium text-ink block">
            {item.name}
          </cite>
          <span className="font-sans text-[12px] text-ink-muted">{item.role}</span>
        </div>
      </footer>
    </blockquote>
  );
}
