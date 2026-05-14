"use client";

import { useMemo, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, FilePlus2, Loader2, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Field } from "@/components/admin/forms/Field";
import {
  LOCATION_MARKETS,
  type LocationMarket,
} from "@/constants/locations";
import {
  buildSeoPageGeneratorPages,
  SEO_SERVICE_OPTIONS,
  type SeoPageGeneratorSelection,
} from "@/lib/seo/seoPageGenerator";

type PreviewResponse = {
  ok: true;
  mode: "preview";
  publishMode: "draft" | "live";
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

type GenerateResponse =
  | { ok: true; summary: PreviewResponse; results: { slug: string; action: "created" | "updated" }[]; generated: number }
  | { error: string };

function hasSelection(selection: SeoPageGeneratorSelection) {
  return selection.marketSlugs.length > 0 && (selection.includeLocationPages || selection.includeServiceLocationPages);
}

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function marketLabel(market: LocationMarket) {
  return market.shortName === "USA" ? "USA" : market.countryName;
}

export function SeoPageGeneratorForm() {
  const [marketSlugs, setMarketSlugs] = useState<string[]>(() => LOCATION_MARKETS.map((market) => market.slug));
  const [serviceIds, setServiceIds] = useState<SeoPageGeneratorSelection["serviceIds"]>(["web", "mobile", "ai"]);
  const [includeLocationPages, setIncludeLocationPages] = useState(true);
  const [includeServiceLocationPages, setIncludeServiceLocationPages] = useState(true);
  const [publishMode, setPublishMode] = useState<"draft" | "live">("draft");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const selection = useMemo<SeoPageGeneratorSelection>(
    () => ({
      marketSlugs,
      serviceIds,
      includeLocationPages,
      includeServiceLocationPages,
      publishMode,
    }),
    [marketSlugs, serviceIds, includeLocationPages, includeServiceLocationPages, publishMode],
  );

  const generated = useMemo(() => buildSeoPageGeneratorPages(selection), [selection]);
  const canRun = hasSelection(selection) && generated.pages.length > 0;

  function handlePreview() {
    if (!canRun) {
      toast.error("Select at least one market and one page type");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/seo-pages/import?mode=preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pages: generated.pages,
            publishMode: generated.publishMode,
          }),
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

  function handleGenerate() {
    if (!canRun) {
      toast.error("Select at least one market and one page type");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/seo-pages/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selection),
        });

        const json = (await res.json()) as GenerateResponse;
        if (!res.ok) {
          throw new Error("error" in json ? json.error : "Generation failed");
        }
        if (!("ok" in json)) {
          throw new Error("Generation failed");
        }

        toast.success(`Generated ${json.generated} SEO pages`);
        setPreview(json.summary);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Generation failed");
      }
    });
  }

  return (
    <section className="rounded-xl border border-line bg-surface/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Generate SEO pages</p>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Batch-create location and service-location pages from the current market matrix, preview the results, then push them through the same import pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <WandSparkles className="size-4" />
          Matrix generator
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Field label="Markets">
          <div className="grid gap-2 sm:grid-cols-2">
            {LOCATION_MARKETS.map((market) => {
              const active = marketSlugs.includes(market.slug);
              return (
                <button
                  key={market.slug}
                  type="button"
                  onClick={() => setMarketSlugs((current) => toggleValue(current, market.slug))}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left transition-colors",
                    active
                      ? "border-brand bg-brand-dim text-ink"
                      : "border-line bg-page text-ink-muted hover:border-line-hi hover:text-ink",
                  )}
                >
                  <div className="text-sm font-semibold">{marketLabel(market)}</div>
                  <div className="mt-1 text-xs opacity-75">{market.metaTitle}</div>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Services">
          <div className="grid gap-2">
            {SEO_SERVICE_OPTIONS.map((service) => {
              const active = serviceIds.includes(service.value);
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => setServiceIds((current) => toggleValue(current, service.value))}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left transition-colors",
                    active
                      ? "border-brand bg-brand-dim text-ink"
                      : "border-line bg-page text-ink-muted hover:border-line-hi hover:text-ink",
                  )}
                >
                  <div className="text-sm font-semibold">{service.label}</div>
                  <div className="mt-1 text-xs opacity-75">{service.description}</div>
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Field label="Page types">
          <div className="grid grid-cols-2 gap-2 rounded-md border border-line bg-page p-1">
            {[
              {
                key: "location" as const,
                label: "Location pages",
                description: "Country-level landing pages.",
              },
              {
                key: "service" as const,
                label: "Service-location pages",
                description: "Country + service combinations.",
              },
            ].map((option) => {
              const active =
                option.key === "location" ? includeLocationPages : includeServiceLocationPages;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() =>
                    option.key === "location"
                      ? setIncludeLocationPages((value) => !value)
                      : setIncludeServiceLocationPages((value) => !value)
                  }
                  className={cn(
                    "rounded-md border px-3 py-2 text-left transition-colors",
                    active
                      ? "border-brand bg-brand-dim text-ink"
                      : "border-transparent bg-transparent text-ink-muted hover:border-line-hi hover:bg-surface/40 hover:text-ink",
                  )}
                >
                  <div className="text-sm font-semibold">{option.label}</div>
                  <div className="mt-1 text-xs leading-relaxed">{option.description}</div>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Import mode">
          <div className="grid grid-cols-2 gap-2 rounded-md border border-line bg-page p-1">
            {[
              {
                value: "draft" as const,
                label: "Draft",
                description: "Generate pages without publishing them.",
              },
              {
                value: "live" as const,
                label: "Live",
                description: "Generate and publish the pages immediately.",
              },
            ].map((option) => {
              const active = publishMode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPublishMode(option.value)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left transition-colors",
                    active
                      ? "border-brand bg-brand-dim text-ink"
                      : "border-transparent bg-transparent text-ink-muted hover:border-line-hi hover:bg-surface/40 hover:text-ink",
                  )}
                >
                  <div className="text-sm font-semibold">{option.label}</div>
                  <div className="mt-1 text-xs leading-relaxed">{option.description}</div>
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-ink-faint">
          {generated.pages.length} page{generated.pages.length === 1 ? "" : "s"} ready across {marketSlugs.length} market{marketSlugs.length === 1 ? "" : "s"} and {serviceIds.length} service{serviceIds.length === 1 ? "" : "s"}.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={isPending || !canRun}
            className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-line-hi hover:text-ink disabled:opacity-60"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            Preview
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending || !canRun}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <FilePlus2 className="size-4" />}
            Generate pages
          </button>
        </div>
      </div>

      {preview ? (
        <div className="mt-5 rounded-xl border border-line bg-page p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Preview summary
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {preview.total} total, {preview.create} create, {preview.update} update,{" "}
                {preview.errors} error(s), {preview.warnings} warning(s)
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-faint">
                Import will save as {preview.publishMode}
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
                  <p className="mt-2 inline-flex rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {preview.publishMode}
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
    </section>
  );
}
