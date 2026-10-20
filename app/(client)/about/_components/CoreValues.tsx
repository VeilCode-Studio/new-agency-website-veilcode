import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { ValueCard } from "./ValueCard";
import { VALUES } from "@/constants";

export function CoreValues() {
  return (
    <section className="py-32 px-6 md:px-10 bg-surface border-y border-line">
      <div className="max-w-300 mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div>
            <SectionTag>Core Values</SectionTag>
            <AccentLine />
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <h2
              className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
                tracking-tight text-ink leading-[1.1] max-w-120"
            >
              The Principles We{" "}
              <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
                Refuse to Compromise
              </span>
            </h2>

            <p className="font-sans text-[15px] text-ink-muted max-w-90 leading-relaxed">
              These aren&apos;t aspirational statements. They&apos;re
              operational commitments that shape how we hire, how we work, and
              how we deliver.
            </p>
          </div>
        </div>

        {/* Cards grid — 3 × 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((v, i) => (
            <ValueCard key={v.number} value={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
