"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Mail, RefreshCw } from "lucide-react";

export default function WorkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[work] route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-6">
      <div className="flex max-w-md flex-col items-start gap-6 rounded-xl border border-line bg-surface p-8">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">
            Work route error
          </p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            The work page could not finish loading
          </h1>
          <p className="text-sm leading-relaxed text-ink-muted">
            Refresh the page first. If it keeps failing, the projects data source
            may need attention.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-page transition-opacity hover:opacity-90"
          >
            <RefreshCw className="size-4" />
            Refresh
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
    </div>
  );
}
