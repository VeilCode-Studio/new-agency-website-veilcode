import Link from "next/link";
import { FAQS } from "@/constants";
export function FAQ() {
  return (
    <section className="border-t border-line px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-300 gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div>
          <p className="public-eyebrow">Questions, answered</p>
          <h2>Before we start.</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            Have something else in mind?{" "}
            <Link className="text-brand underline" href="/contact">
              Send us a message
            </Link>
            .
          </p>
        </div>
        <div>
          {FAQS.map((faq) => (
            <details key={faq.q} className="py-3">
              <summary className="font-semibold text-ink">{faq.q}</summary>
              <p className="mt-3 text-sm text-ink-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
