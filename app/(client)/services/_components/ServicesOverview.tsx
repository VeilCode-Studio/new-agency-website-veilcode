import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { OverviewCard } from "./OverviewCard";
import type { Service } from "@/db/schema";

export function ServicesOverview({ serviceList }: { serviceList: Service[] }) {
  return (
    <section id="services-overview" className="py-24 px-6 md:px-10">
      <div className="max-w-300 mx-auto">
        {/* Header */}
        <div className="mb-14">
          <div>
            <SectionTag>Service Overview</SectionTag>
            <AccentLine />
          </div>
          <h2
            className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold
              tracking-tight text-ink leading-[1.1] max-w-140"
          >
            Three Practices.{" "}
            <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
              One Unified Partner.
            </span>
          </h2>
        </div>

        {/* Grid — 3 top, 2 bottom centred */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {serviceList.slice(0, 3).map((c, i) => (
              <OverviewCard key={c.id} card={c} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-205 mx-auto">
            {serviceList.slice(3).map((c, i) => (
              <OverviewCard key={c.id} card={c} index={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
