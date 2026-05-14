"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/admin/forms/Field";

type PreviewResponse = {
  ok: true;
  mode: "preview";
  total: number;
  create: number;
  update: number;
  errors: number;
  warnings: number;
  items: {
    input: {
      slug: string;
      title: string;
      pageType: string;
      countryName: string | null;
      serviceId: string | null;
    };
    action: "create" | "update";
    issues: { slug: string; field?: string; message: string; level: "error" | "warning" }[];
  }[];
};

type ImportResponse =
  | { ok: true; mode: "import"; summary: PreviewResponse; results: { slug: string; action: "created" | "updated" }[] }
  | { error: string };

export function SeoPageImportForm() {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canImport = useMemo(() => {
    if (!preview) return false;
    return preview.errors === 0 && text.trim().length > 0;
  }, [preview, text]);

  function handleFileChange(file?: File) {
    if (!file) return;
    void file.text().then(setText);
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        const payload = JSON.parse(text) as unknown;

        if (!preview) {
          throw new Error("Run preview first");
        }

        if (preview.errors > 0) {
          throw new Error("Resolve preview errors before importing");
        }

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

        toast.success(`Imported ${json.summary.total} SEO pages`);
        setText("");
        setPreview(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Import failed");
      }
    });
  }

  function handlePreview() {
    startTransition(async () => {
      try {
        const payload = JSON.parse(text) as unknown;
        const res = await fetch("/api/admin/seo-pages/import?mode=preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as PreviewResponse | { error: string };
        if (!res.ok) {
          throw new Error("error" in json ? json.error : "Preview failed");
        }
        if (!("ok" in json)) {
          throw new Error("Preview failed");
        }
        setPreview(json);
        if (json.errors > 0) {
          toast.error(`Preview found ${json.errors} error(s)`);
        } else {
          toast.success(`Preview ready: ${json.create} create, ${json.update} update`);
        }
      } catch (error) {
        setPreview(null);
        toast.error(error instanceof Error ? error.message : "Preview failed");
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={isPending || !text.trim()}
              className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink disabled:opacity-60"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Preview
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !canImport}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
              Import pages
            </button>
          </div>
        </div>

        {preview ? (
          <div className="rounded-xl border border-line bg-page p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  Preview summary
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {preview.total} total, {preview.create} create, {preview.update} update,{" "}
                  {preview.errors} error(s), {preview.warnings} warning(s)
                </p>
              </div>
              {preview.errors > 0 ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs text-destructive">
                  <AlertCircle className="size-3.5" />
                  Fix errors first
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-svc-data-border bg-svc-data-dim px-3 py-1 text-xs text-svc-data">
                  <CheckCircle2 className="size-3.5" />
                  Ready to import
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {preview.items.map((item) => {
                const hasError = item.issues.some((issue) => issue.level === "error");
                return (
                  <div
                    key={item.input.slug}
                    className={hasError
                      ? "rounded-lg border border-destructive/25 bg-destructive/5 p-3"
                      : "rounded-lg border border-line bg-surface/40 p-3"}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                          {item.action}
                        </p>
                        <h4 className="mt-1 font-medium text-ink">{item.input.slug || "Untitled"}</h4>
                      </div>
                      <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-faint">
                        {item.input.pageType}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                      {item.input.countryName || "No country"}{" "}
                      {item.input.serviceId ? `- service: ${item.input.serviceId}` : ""}
                    </p>
                    {item.issues.length > 0 ? (
                      <ul className="mt-3 space-y-1">
                        {item.issues.map((issue, index) => (
                          <li
                            key={`${issue.message}-${index}`}
                            className={issue.level === "error" ? "text-xs text-destructive" : "text-xs text-ink-muted"}
                          >
                            {issue.message}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
