"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] layout error:", error);
  }, [error]);

  const isSessionError = error.message.includes("Clerk session lookup failed");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <div className="grid size-14 place-items-center rounded-full border border-brand-border bg-brand-dim">
          <RefreshCw className="size-6 text-brand" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-xl font-semibold text-ink">
            {isSessionError ? "Session still loading" : "Something went wrong"}
          </h1>
          <p className="text-sm text-ink-muted">
            {isSessionError
              ? "Your session is still propagating. This usually resolves in one refresh."
              : "An unexpected error occurred in the admin panel."}
          </p>
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}
