"use client";

import { useRouter } from "next/navigation";
import { RefreshCw, Mail } from "lucide-react";
import Link from "next/link";

export function ServicesDataError() {
  const router = useRouter();

  return (
    <section className="border-t border-line bg-surface px-6 py-20 md:px-10">
      <div className="mx-auto flex max-w-220 flex-col gap-6 rounded-xl border border-line bg-page p-8">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">
            Services temporarily unavailable
          </p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            We could not load the services list just now.
          </h2>
          <p className="max-w-170 text-sm leading-relaxed text-ink-muted">
            This usually means the database is temporarily unavailable or a
            schema update is still settling. You can refresh the page in a few
            seconds or reach out and we will help directly.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            <RefreshCw className="size-4" />
            Retry load
          </button>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
          >
            <Mail className="size-4" />
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
