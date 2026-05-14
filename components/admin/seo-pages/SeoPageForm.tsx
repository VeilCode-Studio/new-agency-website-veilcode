"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChipEditor } from "@/components/admin/forms/ChipEditor";
import { Field } from "@/components/admin/forms/Field";
import { SectionCard } from "@/components/admin/forms/SectionCard";

const PAGE_TYPES = [
  { value: "location", label: "Location" },
  { value: "service-location", label: "Service + Location" },
  { value: "industry", label: "Industry" },
  { value: "custom", label: "Custom" },
] as const;

export type SeoPageFaq = { question: string; answer: string };

export type SeoPageFormData = {
  slug: string;
  pageType: (typeof PAGE_TYPES)[number]["value"];
  countryCode: string;
  countryName: string;
  serviceId: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroCopy: string;
  bodyText: string;
  faqs: SeoPageFaq[];
  ctaLabel: string;
  ctaHref: string;
  relatedServiceIds: string[];
  relatedProjectSlugs: string[];
  relatedBlogSlugs: string[];
  published: boolean;
  indexable: boolean;
};

export type SeoPageFormProps =
  | { mode: "create" }
  | { mode: "edit"; id: number; initialData: SeoPageFormData };

const EMPTY: SeoPageFormData = {
  slug: "",
  pageType: "location",
  countryCode: "",
  countryName: "",
  serviceId: "",
  title: "",
  metaDescription: "",
  h1: "",
  heroCopy: "",
  bodyText: "",
  faqs: [],
  ctaLabel: "Let's Discuss your Project",
  ctaHref: "/start",
  relatedServiceIds: [],
  relatedProjectSlugs: [],
  relatedBlogSlugs: [],
  published: false,
  indexable: true,
};

const inputCls =
  "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

const textareaCls =
  "w-full resize-y rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function SeoPageForm(props: SeoPageFormProps) {
  const router = useRouter();
  const [data, setData] = useState<SeoPageFormData>(
    props.mode === "edit" ? props.initialData : EMPTY,
  );
  const [slugManual, setSlugManual] = useState(props.mode === "edit");
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof SeoPageFormData>(key: K, value: SeoPageFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!slugManual) {
      set("slug", slugify(title));
    }
  }

  function handleSlugChange(slug: string) {
    setSlugManual(true);
    set("slug", slug);
  }

  function updateFaq(index: number, next: SeoPageFaq) {
    set("faqs", data.faqs.map((faq, itemIndex) => (itemIndex === index ? next : faq)));
  }

  function removeFaq(index: number) {
    set("faqs", data.faqs.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const url =
        props.mode === "edit"
          ? `/api/admin/seo-pages/${props.id}`
          : "/api/admin/seo-pages";
      const method = props.mode === "edit" ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Save failed");
        toast.success(props.mode === "edit" ? "SEO page saved" : "SEO page created");
        router.push("/admin/seo-pages");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Save failed");
      }
    });
  }

  const pageTitle =
    props.mode === "edit" ? `Edit: ${data.title || "Untitled"}` : "New SEO Page";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {pageTitle}
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            Build a controlled landing page for locations, service combinations, and other search targets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/seo-pages"
            className="rounded-md border border-line px-3.5 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Saving..." : props.mode === "edit" ? "Save changes" : "Create page"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_272px]">
        <div className="space-y-5">
          <SectionCard
            title="Identity"
            description="Core routing and page identification."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Page type" required>
                <select
                  value={data.pageType}
                  onChange={(e) => set("pageType", e.target.value as SeoPageFormData["pageType"])}
                  className={inputCls}
                >
                  {PAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Slug" required>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="uganda-web-development"
                  required
                  className={cn(inputCls, "font-mono text-xs")}
                />
              </Field>
              <Field label="Country code">
                <input
                  type="text"
                  value={data.countryCode}
                  onChange={(e) => set("countryCode", e.target.value.toUpperCase())}
                  placeholder="UG"
                  className={cn(inputCls, "font-mono text-xs")}
                />
              </Field>
              <Field label="Country name">
                <input
                  type="text"
                  value={data.countryName}
                  onChange={(e) => set("countryName", e.target.value)}
                  placeholder="Uganda"
                  className={inputCls}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Service ID">
                  <input
                    type="text"
                    value={data.serviceId}
                    onChange={(e) => set("serviceId", e.target.value)}
                    placeholder="web"
                    className={cn(inputCls, "font-mono text-xs")}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="SEO Copy"
            description="Search title, description, and hero messaging."
          >
            <div className="space-y-4">
              <Field label="Title" required>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Digital Product Agency in Uganda | VeilCode"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Meta description" required>
                <textarea
                  value={data.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  placeholder="Short search result summary for this page."
                  rows={3}
                  required
                  className={textareaCls}
                />
              </Field>
              <Field label="H1" required>
                <input
                  type="text"
                  value={data.h1}
                  onChange={(e) => set("h1", e.target.value)}
                  placeholder="Digital product strategy and engineering for Ugandan businesses"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Hero copy" required>
                <textarea
                  value={data.heroCopy}
                  onChange={(e) => set("heroCopy", e.target.value)}
                  placeholder="Opening paragraph shown in the hero section."
                  rows={4}
                  required
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Body"
            description="Use blank lines for paragraphs. Prefix a line with ## or ### for headings."
          >
            <Field label="Body text">
              <textarea
                value={data.bodyText}
                onChange={(e) => set("bodyText", e.target.value)}
                placeholder={"## Why this page exists\n\nAdd the first paragraph here.\n\nAdd the second paragraph here."}
                rows={10}
                className={textareaCls}
              />
            </Field>
          </SectionCard>

          <SectionCard
            title="FAQs"
            description="Optional answers that can support search intent and conversion."
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-ink-muted">FAQ items</p>
                <button
                  type="button"
                  onClick={() => set("faqs", [...data.faqs, { question: "", answer: "" }])}
                  className="inline-flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-xs text-ink-muted hover:text-ink"
                >
                  <Plus className="size-3" />
                  Add FAQ
                </button>
              </div>
              {data.faqs.map((faq, index) => (
                <div key={index} className="rounded-lg border border-line bg-page p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-ink-faint">
                      FAQ {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-ink-faint hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, { ...faq, question: e.target.value })}
                      placeholder="Question"
                      className={inputCls}
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, { ...faq, answer: e.target.value })}
                      placeholder="Answer"
                      rows={3}
                      className={textareaCls}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Connections"
            description="Optional related content and calls to action."
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="CTA label" required>
                  <input
                    type="text"
                    value={data.ctaLabel}
                    onChange={(e) => set("ctaLabel", e.target.value)}
                    required
                    className={inputCls}
                  />
                </Field>
                <Field label="CTA href" required>
                  <input
                    type="text"
                    value={data.ctaHref}
                    onChange={(e) => set("ctaHref", e.target.value)}
                    required
                    className={inputCls}
                  />
                </Field>
              </div>
              <ChipEditor
                label="Related service IDs"
                values={data.relatedServiceIds}
                onChange={(v) => set("relatedServiceIds", v)}
                placeholder="web, mobile, ai"
              />
              <ChipEditor
                label="Related project slugs"
                values={data.relatedProjectSlugs}
                onChange={(v) => set("relatedProjectSlugs", v)}
                placeholder="project-slug"
              />
              <ChipEditor
                label="Related blog slugs"
                values={data.relatedBlogSlugs}
                onChange={(v) => set("relatedBlogSlugs", v)}
                placeholder="blog-post-slug"
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Status
            </h3>
            <button
              type="button"
              onClick={() => set("published", !data.published)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                data.published
                  ? "border-svc-data-border bg-svc-data-dim text-svc-data"
                  : "border-line text-ink-muted hover:border-line-hi",
              )}
            >
              <span>{data.published ? "Published" : "Draft"}</span>
              {data.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>

          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Indexing
            </h3>
            <button
              type="button"
              onClick={() => set("indexable", !data.indexable)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                data.indexable
                  ? "border-brand-border bg-brand-dim text-brand"
                  : "border-line text-ink-muted hover:border-line-hi",
              )}
            >
              <span>{data.indexable ? "Indexable" : "Noindex"}</span>
              {data.indexable ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>

          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Body format
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              Prefix a line with <code className="rounded bg-page px-1 py-0.5">##</code> or{" "}
              <code className="rounded bg-page px-1 py-0.5">###</code> for headings. Use blank lines to
              separate paragraphs.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Saving..." : props.mode === "edit" ? "Save changes" : "Create page"}
          </button>
        </div>
      </div>
    </form>
  );
}
