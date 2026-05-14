import type { SeoFaq } from "@/types/content";

export function ServiceDetailFaq({ faqs }: { faqs: SeoFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-line px-6 py-24 md:px-10">
      <div className="mx-auto max-w-220">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
          FAQ
        </p>
        <h2 className="mb-10 font-display text-[clamp(30px,4vw,48px)] font-extrabold tracking-tight text-ink">
          Questions buyers ask
        </h2>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface/40">
          {faqs.map((faq) => (
            <article key={faq.question} className="p-6">
              <h3 className="font-display text-lg font-bold text-ink">{faq.question}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
