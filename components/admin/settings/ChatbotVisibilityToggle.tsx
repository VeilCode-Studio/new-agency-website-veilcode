"use client";

import { useState, useTransition } from "react";
import { Bot, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateChatbotEnabledAction } from "@/app/(admin)/admin/settings/actions";

export function ChatbotVisibilityToggle({
  initialEnabled,
}: {
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);

    startTransition(async () => {
      const result = await updateChatbotEnabledAction(next);
      if (result.error) {
        setEnabled(enabled);
        toast.error(result.error);
        return;
      }

      toast.success(next ? "Chatbot is visible" : "Chatbot is hidden");
    });
  }

  return (
    <section className="max-w-3xl rounded-xl border border-line bg-surface/40 p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-lg border",
              enabled
                ? "border-brand-border bg-brand-dim text-brand"
                : "border-line bg-surface-hi text-ink-muted",
            )}
          >
            <Bot className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-ink">
              Public chatbot
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted">
              Control whether the Ask VeilCode chatbot appears on public pages.
              Turning it off hides the launcher for visitors, but keeps the
              chatbot code and saved admin setting intact.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-page px-3 py-1 text-xs text-ink-muted">
              {enabled ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              {enabled ? "Currently visible" : "Currently hidden"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          aria-pressed={enabled}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            enabled
              ? "border-line bg-surface-hi text-ink-muted hover:border-line-hi hover:text-ink"
              : "border-brand bg-brand text-page hover:opacity-90",
          )}
        >
          {enabled ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {enabled ? "Turn off" : "Turn on"}
        </button>
      </div>
    </section>
  );
}
