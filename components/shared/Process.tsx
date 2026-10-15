
import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { STEPS } from "@/constants";
import { StepCard } from "../extras/StepCard";


/* ─── PROCESS SECTION ─────────────────────────────────────────────────────── */

export function Process() {

  return (
    <section className="py-32 px-6 md:px-10 bg-surface border-y border-line">
      <div className="max-w-300 mx-auto">
        <div
        >
          {/* Header */}
          <div>
            <SectionTag>How We Work</SectionTag>
            <AccentLine />
          </div>

          <h2
            className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
              tracking-tight text-ink leading-[1.1] mb-16 max-w-140"
          >
            A Process Built for{" "}
            <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
              Clarity &amp; Speed
            </span>
          </h2>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {STEPS.map((step, i) => (
              <StepCard
                key={step.num}
                step={step}
                isLast={i === STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}