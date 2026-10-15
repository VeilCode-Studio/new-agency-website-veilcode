import Link from "next/link";
import type { Service } from "@/db/schema";

export function ServiceCard({
  service,
}: {
  service: Service;
}) {

  const c = service.cardClasses; // shorthand for classes from DB
  const href = service.seoEnabled && service.slug ? `/services/${service.slug}` : "/services";

  return (
    <article
      className={`group relative rounded-xl p-9 cursor-pointer overflow-hidden
        bg-surface border border-line
        transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300
        hover:bg-surface-hi
        ${c.hoverBorder}
        ${c.hoverShadow}`}
    >
      {/* Corner glow — always rendered, opacity on hover */}
      <div
        aria-hidden
        className={`absolute top-0 right-0 pointer-events-none
          transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-400 rounded-bl-full
          ${c.glow}
          w-36 h-36 opacity-0 group-hover:opacity-100`}
      />

      {/* Icon */}
      <div className={`text-[28px] leading-none mb-5 ${c.icon}`} aria-hidden>
        {service.icon}
      </div>

      {/* Title */}
      <h3 className="font-display text-[22px] font-bold tracking-tight text-ink mb-3">
        {service.title}
      </h3>

      {/* Description */}
      <p className="font-sans text-sm text-ink-muted leading-relaxed mb-6">
        {service.desc}
      </p>

      {/* Tags */}
      <ul className="flex flex-wrap gap-2 mb-8 list-none p-0 m-0" aria-label="Technologies">
        {service.tags.map((tag) => (
          <li
            key={tag}
            className={`font-mono text-[10px] tracking-widest uppercase
              px-2.5 py-1 rounded border
              ${c.tag}`}
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* Link */}
      <Link href={href} className={`flex items-center gap-1.5 text-[13px] font-medium font-sans ${c.link}`}>
        <span>Explore service</span>
        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
      </Link>
    </article>
  );
}
