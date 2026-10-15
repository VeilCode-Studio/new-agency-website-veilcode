"use client";

import { useState } from "react";
import { SectionTag } from "@/components/extras/Primitives";
import { Button } from "../ui/button";
import { TestimonialCard } from "../extras/TestimonialCard";
import type { DisplayTestimonial } from "@/lib/testimonials/display";

export function Testimonials({ items }: { items: DisplayTestimonial[] }) {
  const [active, setActive] = useState(0);
  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));

  if (items.length === 0) return null;

  return (
    <section className="py-32 px-6 md:px-10 bg-surface border-y border-line" id="testimonials">
      <div className="max-w-205 mx-auto text-center">
        <div
        >
          {/* Tag */}
          <div className="flex justify-center">
            <SectionTag>Client Stories</SectionTag>
          </div>

          {/* Heading */}
          <h2
            className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
              tracking-tight text-ink leading-[1.1] mb-16"
          >
            What clients{" "}
            <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
              say
            </span>
          </h2>

          {/* Carousel */}
          <div>
            <>
              <TestimonialCard
                key={items[activeIndex].name}
                item={items[activeIndex]}
              />
            </>

            {/* Dot indicators */}
            <div
              className="flex justify-center gap-2 mt-8"
              aria-label="Testimonials"
            >
              {items.map((t, i) => (
                <Button
                  key={t.name}
                  aria-pressed={i === activeIndex}
                  aria-label={`Show testimonial from ${t.name}`}
                  onClick={() => setActive(i)}
                  className="size-11 rounded-full border-none bg-transparent p-3 hover:bg-surface-hi focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span aria-hidden="true" className={`block h-2 rounded-full ${i === activeIndex ? "w-5 bg-brand" : "w-2 bg-line-hi"}`} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
