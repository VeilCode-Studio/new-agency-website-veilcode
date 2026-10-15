
import {
  SectionTag,
  AccentLine,
  GhostButton,
} from "@/components/extras/Primitives";
import { ServiceCard } from "../extras/ServiceCard";
import Link from "next/link";
import type { Service } from "@/db/schema";



export function Services({services} : { services: Service[]}) {

  return (
    <section id="services" className="py-32 px-6 md:px-10">
      <div className="max-w-300 mx-auto">

        {/* Header */}
        <div
          className="mb-16"
        >
          <div>
            <SectionTag>What We Do</SectionTag>
            <AccentLine />
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <h2
              className="font-display text-[clamp(30px,4vw,52px)] font-extrabold
                tracking-tight text-ink leading-[1.1] max-w-120"
            >
              Full-Stack Digital{" "}
              <span className="text-brand drop-shadow-[0_0_24px_var(--color-brand-glow)]">
                Capabilities
              </span>
            </h2>

            <p
              className="font-sans text-[15px] text-ink-muted max-w-90 leading-relaxed"
            >
              From concept to deployment — we cover every dimension of your
              digital presence with precision and craft.
            </p>
          </div>
        </div>

        {/* Grid: 3-col top row, 2-col centred bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {services.slice(0, 3).map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-205 mx-auto">
          {services.slice(3).map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>

        {/* CTA row */}
        <div className="flex justify-center mt-12">
          <GhostButton asChild>
            <Link href={"/services"}>View All Services →</Link>
          </GhostButton>
        </div>
      </div>
    </section>
  );
}
