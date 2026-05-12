"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, RotateCcw, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ServiceCardClasses,
  ServiceOverviewClasses,
  ServiceDeepDiveClasses,
} from "@/types/content";

// Service slug options (must match serviceSlugEnum in schema)
const SERVICE_IDS = ["web", "mobile", "data", "social", "ai"] as const;
type ServiceId = (typeof SERVICE_IDS)[number];

export type ServiceFormData = {
  id: string;
  number: string;
  icon: string;
  title: string;
  tagline: string;
  desc: string;
  intro: string;
  challenge: string;
  approach: string;
  bullets: string[];
  deliverables: DeliverableItem[];
  stack: string[];
  tags: string[];
  metric: string;
  metricLabel: string;
  metricSub: string;
  cardClasses: ServiceCardClasses;
  overviewClasses: ServiceOverviewClasses;
  deepDiveClasses: ServiceDeepDiveClasses;
  sortOrder: number;
  published: boolean;
};

export type ServiceFormProps =
  | { mode: "create" }
  | { mode: "edit"; id: string; initialData: ServiceFormData };

// Class presets per service slug
const CLASS_PRESETS: Record<ServiceId, {
  card: ServiceCardClasses;
  overview: ServiceOverviewClasses;
  deepDive: ServiceDeepDiveClasses;
}> = {
  web: {
    card: {
      icon: "text-svc-web",
      tag: "bg-svc-web-dim border-svc-web-border text-svc-web",
      glow: "bg-svc-web/5",
      hoverBorder: "hover:border-svc-web-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-web-border)]",
      link: "text-svc-web",
    },
    overview: {
      accent: "text-svc-web",
      dimBg: "bg-svc-web-dim",
      border: "border-svc-web-border",
      hoverBorder: "hover:border-svc-web-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-web-border)]",
    },
    deepDive: {
      accent: "text-svc-web",
      dimBg: "bg-svc-web-dim",
      border: "border-svc-web-border",
      glow: "bg-svc-web/5",
      stackBg: "bg-svc-web-dim",
      stackBorder: "border-svc-web-border",
      metricText: "text-svc-web",
      divider: "bg-svc-web",
    },
  },
  mobile: {
    card: {
      icon: "text-svc-mobile",
      tag: "bg-svc-mobile-dim border-svc-mobile-border text-svc-mobile",
      glow: "bg-svc-mobile/5",
      hoverBorder: "hover:border-svc-mobile-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-mobile-border)]",
      link: "text-svc-mobile",
    },
    overview: {
      accent: "text-svc-mobile",
      dimBg: "bg-svc-mobile-dim",
      border: "border-svc-mobile-border",
      hoverBorder: "hover:border-svc-mobile-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-mobile-border)]",
    },
    deepDive: {
      accent: "text-svc-mobile",
      dimBg: "bg-svc-mobile-dim",
      border: "border-svc-mobile-border",
      glow: "bg-svc-mobile/5",
      stackBg: "bg-svc-mobile-dim",
      stackBorder: "border-svc-mobile-border",
      metricText: "text-svc-mobile",
      divider: "bg-svc-mobile",
    },
  },
  data: {
    card: {
      icon: "text-svc-data",
      tag: "bg-svc-data-dim border-svc-data-border text-svc-data",
      glow: "bg-svc-data/5",
      hoverBorder: "hover:border-svc-data-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-data-border)]",
      link: "text-svc-data",
    },
    overview: {
      accent: "text-svc-data",
      dimBg: "bg-svc-data-dim",
      border: "border-svc-data-border",
      hoverBorder: "hover:border-svc-data-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-data-border)]",
    },
    deepDive: {
      accent: "text-svc-data",
      dimBg: "bg-svc-data-dim",
      border: "border-svc-data-border",
      glow: "bg-svc-data/5",
      stackBg: "bg-svc-data-dim",
      stackBorder: "border-svc-data-border",
      metricText: "text-svc-data",
      divider: "bg-svc-data",
    },
  },
  social: {
    card: {
      icon: "text-svc-social",
      tag: "bg-svc-social-dim border-svc-social-border text-svc-social",
      glow: "bg-svc-social/5",
      hoverBorder: "hover:border-svc-social-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-social-border)]",
      link: "text-svc-social",
    },
    overview: {
      accent: "text-svc-social",
      dimBg: "bg-svc-social-dim",
      border: "border-svc-social-border",
      hoverBorder: "hover:border-svc-social-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-social-border)]",
    },
    deepDive: {
      accent: "text-svc-social",
      dimBg: "bg-svc-social-dim",
      border: "border-svc-social-border",
      glow: "bg-svc-social/5",
      stackBg: "bg-svc-social-dim",
      stackBorder: "border-svc-social-border",
      metricText: "text-svc-social",
      divider: "bg-svc-social",
    },
  },
  ai: {
    card: {
      icon: "text-svc-ai",
      tag: "bg-svc-ai-dim border-svc-ai-border text-svc-ai",
      glow: "bg-svc-ai/5",
      hoverBorder: "hover:border-svc-ai-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-ai-border)]",
      link: "text-svc-ai",
    },
    overview: {
      accent: "text-svc-ai",
      dimBg: "bg-svc-ai-dim",
      border: "border-svc-ai-border",
      hoverBorder: "hover:border-svc-ai-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-ai-border)]",
    },
    deepDive: {
      accent: "text-svc-ai",
      dimBg: "bg-svc-ai-dim",
      border: "border-svc-ai-border",
      glow: "bg-svc-ai/5",
      stackBg: "bg-svc-ai-dim",
      stackBorder: "border-svc-ai-border",
      metricText: "text-svc-ai",
      divider: "bg-svc-ai",
    },
  },
};

const EMPTY: ServiceFormData = {
  id: "web",
  number: "01",
  icon: "🌐",
  title: "",
  tagline: "",
  desc: "",
  intro: "",
  challenge: "",
  approach: "",
  bullets: [],
  deliverables: [],
  stack: [],
  tags: [],
  metric: "",
  metricLabel: "",
  metricSub: "",
  cardClasses: CLASS_PRESETS.web.card,
  overviewClasses: CLASS_PRESETS.web.overview,
  deepDiveClasses: CLASS_PRESETS.web.deepDive,
  sortOrder: 0,
  published: true,
};

// Primitive field components imported from shared forms directory
import { Field } from "../forms/Field";
import { SectionCard } from "../forms/SectionCard";
import { ChipEditor } from "../forms/ChipEditor";
import { BulletsEditor } from "../forms/BulletsEditor";
import { DeliverablesEditor } from "../forms/DeliverablesEditor";
import { ClassesEditor } from "../forms/ClassesEditor";

const inputCls =
  "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

const textareaCls =
  "w-full resize-y rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

// Field definitions for the three class groups
const CARD_FIELDS: { key: keyof ServiceCardClasses; label: string; hint: string }[] = [
  { key: "icon",        label: "Icon color",    hint: "e.g. text-svc-web" },
  { key: "tag",         label: "Tag classes",   hint: "e.g. bg-svc-web-dim border-svc-web-border text-svc-web" },
  { key: "glow",        label: "Glow",          hint: "e.g. bg-svc-web/5" },
  { key: "hoverBorder", label: "Hover border",  hint: "e.g. hover:border-svc-web-border" },
  { key: "hoverShadow", label: "Hover shadow",  hint: "e.g. hover:shadow-[0_0_32px_var(--color-svc-web-border)]" },
  { key: "link",        label: "Link color",    hint: "e.g. text-svc-web" },
];

const OVERVIEW_FIELDS: { key: keyof ServiceOverviewClasses; label: string; hint: string }[] = [
  { key: "accent",      label: "Accent",       hint: "e.g. text-svc-web" },
  { key: "dimBg",       label: "Dim bg",       hint: "e.g. bg-svc-web-dim" },
  { key: "border",      label: "Border",       hint: "e.g. border-svc-web-border" },
  { key: "hoverBorder", label: "Hover border", hint: "e.g. hover:border-svc-web-border" },
  { key: "hoverShadow", label: "Hover shadow", hint: "e.g. hover:shadow-[0_0_32px_var(--color-svc-web-border)]" },
];

const DEEP_DIVE_FIELDS: { key: keyof ServiceDeepDiveClasses; label: string; hint: string }[] = [
  { key: "accent",      label: "Accent",        hint: "e.g. text-svc-web" },
  { key: "dimBg",       label: "Dim bg",        hint: "e.g. bg-svc-web-dim" },
  { key: "border",      label: "Border",        hint: "e.g. border-svc-web-border" },
  { key: "glow",        label: "Glow",          hint: "e.g. bg-svc-web/5" },
  { key: "stackBg",     label: "Stack bg",      hint: "e.g. bg-svc-web-dim" },
  { key: "stackBorder", label: "Stack border",  hint: "e.g. border-svc-web-border" },
  { key: "metricText",  label: "Metric text",   hint: "e.g. text-svc-web" },
  { key: "divider",     label: "Divider",       hint: "e.g. bg-svc-web" },
];

// Main form

export function ServiceForm(props: ServiceFormProps) {
  const router = useRouter();
  const [data, setData] = useState<ServiceFormData>(
    props.mode === "edit" ? props.initialData : EMPTY,
  );
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleIdChange(id: string) {
    const preset = CLASS_PRESETS[id as ServiceId];
    if (preset) {
      setData((prev) => ({
        ...prev,
        id,
        cardClasses: preset.card,
        overviewClasses: preset.overview,
        deepDiveClasses: preset.deepDive,
      }));
    } else {
      set("id", id);
    }
  }

  function getPreset() {
    return CLASS_PRESETS[data.id as ServiceId] ?? CLASS_PRESETS.web;
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const url =
        props.mode === "edit"
          ? `/api/admin/services/${props.id}`
          : "/api/admin/services";
      const method = props.mode === "edit" ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Save failed");
        toast.success(props.mode === "edit" ? "Service saved" : "Service created");
        router.push("/admin/services");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  const pageTitle =
    props.mode === "edit" ? `Edit: ${data.title || "Untitled"}` : "New Service";

  return (
    <form onSubmit={handleSubmit}>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {pageTitle}
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {props.mode === "edit"
              ? "Update the service details below."
              : "Fill in the details to create a new service."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/services"
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
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Create service"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_272px]">
        {/* Main content */}
        <div className="space-y-5">

          {/* 1. Identity */}
          <SectionCard
            title="Identity"
            description="The service ID, icon, and display name."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Service ID" required>
                {props.mode === "create" ? (
                  <select
                    title="service-type"
                    value={data.id}
                    onChange={(e) => handleIdChange(e.target.value)}
                    className={inputCls}
                    required
                  >
                    {SERVICE_IDS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={data.id}
                    readOnly
                    className={cn(inputCls, "font-mono cursor-not-allowed opacity-60")}
                  />
                )}
                <p className="mt-1 text-[11px] text-ink-faint">
                  Used as the URL-safe identifier; cannot be changed after creation.
                </p>
              </Field>
              <Field label="Number" required>
                <input
                  type="text"
                  value={data.number}
                  onChange={(e) => set("number", e.target.value)}
                  placeholder="01"
                  required
                  className={cn(inputCls, "font-mono")}
                />
              </Field>
              <Field label="Icon" required>
                <input
                  type="text"
                  value={data.icon}
                  onChange={(e) => set("icon", e.target.value)}
                  placeholder="🌐"
                  required
                  className={cn(inputCls, "text-xl")}
                />
                <p className="mt-1 text-[11px] text-ink-faint">Emoji or short symbol shown on the card.</p>
              </Field>
              <Field label="Title" required>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Web Solutions"
                  required
                  className={inputCls}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Tagline" required>
                  <input
                    type="text"
                    value={data.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                    placeholder="Design-led, conversion-focused web experiences"
                    required
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* 2. Descriptions */}
          <SectionCard
            title="Descriptions"
            description="Card-level description and the deep-dive intro paragraph."
          >
            <div className="space-y-4">
              <Field label="Card description" required>
                <textarea
                  value={data.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  placeholder="Short paragraph shown on the services overview card…"
                  rows={3}
                  required
                  className={textareaCls}
                />
              </Field>
              <Field label="Deep-dive intro" required>
                <textarea
                  value={data.intro}
                  onChange={(e) => set("intro", e.target.value)}
                  placeholder="Longer opening paragraph shown in the full service section…"
                  rows={4}
                  required
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 3. Narrative */}
          <SectionCard
            title="Narrative"
            description="The challenge and approach paragraphs shown in the deep-dive section."
          >
            <div className="space-y-4">
              <Field label="The challenge" required>
                <textarea
                  value={data.challenge}
                  onChange={(e) => set("challenge", e.target.value)}
                  placeholder="Describe the common problems clients in this service face…"
                  rows={4}
                  required
                  className={textareaCls}
                />
              </Field>
              <Field label="Our approach" required>
                <textarea
                  value={data.approach}
                  onChange={(e) => set("approach", e.target.value)}
                  placeholder="Explain the methodology and process used to solve those problems…"
                  rows={4}
                  required
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 4. Bullets */}
          <SectionCard
            title="Bullets"
            description="Short capability highlights shown in the overview list."
          >
            <BulletsEditor bullets={data.bullets} onChange={(v) => set("bullets", v)} />
          </SectionCard>

          {/* 5. Deliverables */}
          <SectionCard
            title="Deliverables"
            description="What the client receives — shown in the 'What You Get' panel."
          >
            <DeliverablesEditor
              deliverables={data.deliverables}
              onChange={(v) => set("deliverables", v)}
            />
          </SectionCard>

          {/* 6. Stack & Tags */}
          <SectionCard
            title="Stack & Tags"
            description="Technologies shown in the deep-dive section, and filter tags."
          >
            <div className="space-y-4">
              <ChipEditor
                label="Tech stack"
                values={data.stack}
                onChange={(v) => set("stack", v)}
                placeholder="e.g. Next.js, TypeScript, Tailwind CSS…"
              />
              <ChipEditor
                label="Tags"
                values={data.tags}
                onChange={(v) => set("tags", v)}
                placeholder="e.g. E-commerce, SaaS, Landing Page…"
              />
            </div>
          </SectionCard>

          {/* 7. Metrics */}
          <SectionCard
            title="Metrics"
            description="The stat callout shown in the deep-dive section header."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Metric" required>
                <input
                  type="text"
                  value={data.metric}
                  onChange={(e) => set("metric", e.target.value)}
                  placeholder="+340%"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Metric label" required>
                <input
                  type="text"
                  value={data.metricLabel}
                  onChange={(e) => set("metricLabel", e.target.value)}
                  placeholder="Organic Traffic"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Metric sub-text" required>
                <input
                  type="text"
                  value={data.metricSub}
                  onChange={(e) => set("metricSub", e.target.value)}
                  placeholder="avg. across client sites"
                  required
                  className={inputCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 8. Style classes */}
          <SectionCard
            title="Style Classes"
            description="Tailwind classes that theme this service's accent colour. Auto-filled by service ID — edit only if customising."
          >
            <div className="space-y-6 divide-y divide-line">
              <ClassesEditor
                title="Card classes"
                classes={data.cardClasses}
                onChange={(v) => set("cardClasses", v)}
                onReset={() => set("cardClasses", getPreset().card)}
                fields={CARD_FIELDS}
              />
              <div className="pt-5">
                <ClassesEditor
                  title="Overview classes"
                  classes={data.overviewClasses}
                  onChange={(v) => set("overviewClasses", v)}
                  onReset={() => set("overviewClasses", getPreset().overview)}
                  fields={OVERVIEW_FIELDS}
                />
              </div>
              <div className="pt-5">
                <ClassesEditor
                  title="Deep-dive classes"
                  classes={data.deepDiveClasses}
                  onChange={(v) => set("deepDiveClasses", v)}
                  onReset={() => set("deepDiveClasses", getPreset().deepDive)}
                  fields={DEEP_DIVE_FIELDS}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Published status */}
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
              {data.published ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </button>
          </div>

          {/* Sort order */}
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <Field label="Sort order">
              <input
                title="sort"
                type="number"
                value={data.sortOrder}
                onChange={(e) => set("sortOrder", parseInt(e.target.value, 10) || 0)}
                min={0}
                className={cn(inputCls, "font-mono")}
              />
            </Field>
            <p className="mt-1.5 text-[11px] text-ink-faint">
              Lower numbers appear first on the services page.
            </p>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Create service"}
          </button>
          
          {props.mode === "edit" && props.id && (
            <Link
              href={`/admin/services/${props.id}/preview`}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-line bg-surface py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-hi hover:bg-surface-hi"
            >
              <Eye className="size-4" />
              Preview Layout
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
