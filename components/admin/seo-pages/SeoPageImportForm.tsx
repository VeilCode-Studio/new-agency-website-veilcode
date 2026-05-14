"use client";

import { useRef, useState, useTransition } from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/admin/forms/Field";

type ImportResponse =
  | { ok: true; count: number; results: { slug: string; action: "created" | "updated" }[] }
  | { error: string };

export function SeoPageImportForm() {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(file?: File) {
    if (!file) return;
    void file.text().then(setText);
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        const payload = JSON.parse(text) as unknown;

        const res = await fetch("/api/admin/seo-pages/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = (await res.json()) as ImportResponse;
        if (!res.ok) {
          throw new Error("error" in json ? json.error : "Import failed");
        }

        if (!("ok" in json)) {
          throw new Error("Import failed");
        }

        toast.success(`Imported ${json.count} SEO pages`);
        setText("");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Import failed");
      }
    });
  }

  return (
    <section className="rounded-xl border border-line bg-surface/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Import SEO pages</p>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Paste the JSON seed file or choose it from disk. Rows are matched by slug, so existing
            pages are updated and new pages are created.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink">
          <Upload className="size-4" />
          Load file
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json,text/plain"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
        </label>
      </div>

      <div className="mt-4 space-y-4">
        <Field label="JSON content">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder='Paste the contents of docs/seo/veilcode-seo-page-seed-data.json here.'
            className="w-full rounded-md border border-line bg-page px-3 py-2 font-mono text-xs text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink-faint">
            This is the quickest way to seed the first market pages without manual entry.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !text.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            {isPending ? "Importing..." : "Import pages"}
          </button>
        </div>
      </div>
    </section>
  );
}
