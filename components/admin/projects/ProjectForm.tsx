"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Upload,
  Loader2,
  ChevronUp,
  ChevronDown,
  Star,
  Eye,
  EyeOff,
  RotateCcw,
  FileJson,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectClasses } from "@/types/content";
import { Input } from "@/components/ui/input";
import { parseProjectJsonForForm } from "@/lib/projects/importJson";

// types/ interfaces

type ServiceSlug = "web" | "mobile" | "data" | "social" | "ai";

export type ProjectFormData = {
  slug: string;
  service: ServiceSlug;
  serviceLabel: string;
  year: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  team: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  results: ProjectResult[];
  deliverables: ProjectDeliverable[];
  screenshots: ProjectScreenshot[];
  testimonial: ProjectTestimonial | null;
  nextSlug: string;
  classes: ProjectClasses;
};

export type ProjectFormProps =
  | { mode: "create" }
  | { mode: "edit"; id: number; initialData: ProjectFormData };

// Service presets

const SERVICE_PRESETS: Record<ServiceSlug, { label: string; classes: ProjectClasses }> = {
  web: {
    label: "Web Solutions",
    classes: {
      accent: "text-svc-web",
      dimBg: "bg-svc-web-dim",
      border: "border-svc-web-border",
      hoverBorder: "hover:border-svc-web-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-web-border)]",
      gradFrom: "from-svc-web-dim",
    },
  },
  mobile: {
    label: "Mobile Apps",
    classes: {
      accent: "text-svc-mobile",
      dimBg: "bg-svc-mobile-dim",
      border: "border-svc-mobile-border",
      hoverBorder: "hover:border-svc-mobile-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-mobile-border)]",
      gradFrom: "from-svc-mobile-dim",
    },
  },
  data: {
    label: "Data Analytics",
    classes: {
      accent: "text-svc-data",
      dimBg: "bg-svc-data-dim",
      border: "border-svc-data-border",
      hoverBorder: "hover:border-svc-data-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-data-border)]",
      gradFrom: "from-svc-data-dim",
    },
  },
  social: {
    label: "Social Media",
    classes: {
      accent: "text-svc-social",
      dimBg: "bg-svc-social-dim",
      border: "border-svc-social-border",
      hoverBorder: "hover:border-svc-social-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-social-border)]",
      gradFrom: "from-svc-social-dim",
    },
  },
  ai: {
    label: "AI Automation",
    classes: {
      accent: "text-svc-ai",
      dimBg: "bg-svc-ai-dim",
      border: "border-svc-ai-border",
      hoverBorder: "hover:border-svc-ai-border",
      hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-ai-border)]",
      gradFrom: "from-svc-ai-dim",
    },
  },
};

const EMPTY: ProjectFormData = {
  slug: "",
  service: "web",
  serviceLabel: "Web Solutions",
  year: String(new Date().getFullYear()),
  title: "",
  client: "",
  industry: "",
  duration: "",
  team: "",
  summary: "",
  challenge: "",
  approach: "",
  outcome: "",
  metric: "",
  metricLabel: "",
  tags: [],
  featured: false,
  published: false,
  sortOrder: 0,
  results: [],
  deliverables: [],
  screenshots: [],
  testimonial: null,
  nextSlug: "",
  classes: SERVICE_PRESETS.web.classes,
};

// Helpers

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Primitive field components

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-ink-muted">
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

const textareaCls =
  "w-full resize-y rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface/40 p-5">
      <div className="mb-4">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Tags Editor

function TagsEditor({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function add() {
    const t = input.trim();
    if (!t || tags.includes(t)) return;
    onChange([...tags, t]);
    setInput("");
  }

  return (
    <Field label="Tags">
      <div className="flex min-h-10.5 flex-wrap gap-1.5 rounded-md border border-line bg-page p-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-ink"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="text-ink-faint hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
            if (e.key === "Backspace" && !input && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          placeholder={tags.length === 0 ? "Type a tag and press Enter…" : "Add another…"}
          className="min-w-28 flex-1 bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
        />
      </div>
    </Field>
  );
}

// results editor

function ResultsEditor({
  results,
  onChange,
}: {
  results: ProjectResult[];
  onChange: (v: ProjectResult[]) => void;
}) {
  function patch(i: number, p: Partial<ProjectResult>) {
    onChange(results.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  }

  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <div
          key={i}
          className="relative grid gap-2 rounded-lg border border-line bg-page p-3 sm:grid-cols-3"
        >
          <button
            title="delet-service"
            type="button"
            onClick={() => onChange(results.filter((_, idx) => idx !== i))}
            className="absolute right-2 top-2 text-ink-faint hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
          <Field label="Metric">
            <input
              type="text"
              value={r.metric}
              onChange={(e) => patch(i, { metric: e.target.value })}
              placeholder="+210%"
              className={inputCls}
            />
          </Field>
          <Field label="Label">
            <input
              type="text"
              value={r.label}
              onChange={(e) => patch(i, { label: e.target.value })}
              placeholder="Property inquiries"
              className={inputCls}
            />
          </Field>
          <Field label="Sub-text">
            <input
              type="text"
              value={r.sub}
              onChange={(e) => patch(i, { sub: e.target.value })}
              placeholder="within first 60 days"
              className={inputCls}
            />
          </Field>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...results, { metric: "", label: "", sub: "" }])}
        className="flex items-center gap-1.5 rounded-md border border-dashed border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="size-3.5" /> Add result
      </button>
    </div>
  );
}

// deliverables editor

function DeliverablesEditor({
  deliverables,
  onChange,
}: {
  deliverables: ProjectDeliverable[];
  onChange: (v: ProjectDeliverable[]) => void;
}) {
  function patch(i: number, p: Partial<ProjectDeliverable>) {
    onChange(deliverables.map((d, idx) => (idx === i ? { ...d, ...p } : d)));
  }

  return (
    <div className="space-y-3">
      {deliverables.map((d, i) => (
        <div key={i} className="relative rounded-lg border border-line bg-page p-3">
          <button
            title="delete-deliverable"
            type="button"
            onClick={() => onChange(deliverables.filter((_, idx) => idx !== i))}
            className="absolute right-2 top-2 text-ink-faint hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
            <Field label="Title">
              <input
                type="text"
                value={d.title}
                onChange={(e) => patch(i, { title: e.target.value })}
                placeholder="Product strategy"
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <input
                type="text"
                value={d.desc}
                onChange={(e) => patch(i, { desc: e.target.value })}
                placeholder="Defined user journeys and information architecture…"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...deliverables, { title: "", desc: "" }])}
        className="flex items-center gap-1.5 rounded-md border border-dashed border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="size-3.5" /> Add deliverable
      </button>
    </div>
  );
}

// Screenshot row

function ScreenshotRow({
  s,
  onUpdate,
  onRemove,
  onUp,
  onDown,
  canUp,
  canDown,
}: {
  s: ProjectScreenshot;
  onUpdate: (p: Partial<ProjectScreenshot>) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "projects");
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onUpdate({ src: data.url });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-line bg-page p-3">
      <div className="flex gap-3">
        {/* Thumbnail / uploader */}
        <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
          {s.src ? (
            <>
              <Image src={s.src} alt={s.alt || "Screenshot"} fill className="object-cover" sizes="80px" />
              <button
                type="button"
                onClick={() => onUpdate({ src: null })}
                title="Remove image"
                className="absolute right-0.5 top-0.5 rounded bg-page/80 p-0.5 text-ink-faint hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-faint transition-colors hover:text-brand"
            >
              {uploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <Upload className="size-4" />
                  <span className="text-[9px]">Upload</span>
                </>
              )}
            </button>
          )}
          <Input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Alt, caption, size */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Alt text">
              <input
                type="text"
                value={s.alt}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                placeholder="Dashboard overview"
                className={cn(inputCls, "text-xs py-1.5")}
              />
            </Field>
            <Field label="Caption">
              <input
                type="text"
                value={s.caption}
                onChange={(e) => onUpdate({ caption: e.target.value })}
                placeholder="Property search interface"
                className={cn(inputCls, "text-xs py-1.5")}
              />
            </Field>
          </div>
          <div className="flex gap-2">
            {(["wide", "half"] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onUpdate({ size: sz })}
                className={cn(
                  "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                  s.size === sz
                    ? "border-brand-border bg-brand-dim text-brand"
                    : "border-line text-ink-muted hover:border-line-hi",
                )}
              >
                {sz === "wide" ? "Full width" : "Half width"}
              </button>
            ))}
          </div>
        </div>

        {/* Reorder + remove */}
        <div className="flex shrink-0 flex-col items-center gap-0.5 self-start pt-0.5">
          <button
            title="Move up"
            type="button"
            onClick={onUp}
            disabled={!canUp}
            className="rounded p-1 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            title="Move down"
            type="button"
            onClick={onDown}
            disabled={!canDown}
            className="rounded p-1 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
          >
            <ChevronDown className="size-3.5" />
          </button>
          <button
            title="Delete screenshot"
            type="button"
            onClick={onRemove}
            className="mt-1 rounded p-1 text-ink-faint hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenshotsEditor({
  screenshots,
  onChange,
}: {
  screenshots: ProjectScreenshot[];
  onChange: (v: ProjectScreenshot[]) => void;
}) {
  function update(i: number, p: Partial<ProjectScreenshot>) {
    onChange(screenshots.map((s, idx) => (idx === i ? { ...s, ...p } : s)));
  }
  function move(from: number, to: number) {
    const next = [...screenshots];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {screenshots.map((s, i) => (
        <ScreenshotRow
          key={i}
          s={s}
          onUpdate={(p) => update(i, p)}
          onRemove={() => onChange(screenshots.filter((_, idx) => idx !== i))}
          onUp={() => move(i, i - 1)}
          onDown={() => move(i, i + 1)}
          canUp={i > 0}
          canDown={i < screenshots.length - 1}
        />
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...screenshots, { src: null, alt: "", caption: "", size: "wide" }])
        }
        className="flex items-center gap-1.5 rounded-md border border-dashed border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="size-3.5" /> Add screenshot
      </button>
    </div>
  );
}

// Classes editor

const CLASS_FIELDS: { key: keyof ProjectClasses; label: string; hint: string }[] = [
  { key: "accent",      label: "Accent text",    hint: "e.g. text-svc-web" },
  { key: "dimBg",       label: "Dim background", hint: "e.g. bg-svc-web-dim" },
  { key: "border",      label: "Border",         hint: "e.g. border-svc-web-border" },
  { key: "hoverBorder", label: "Hover border",   hint: "e.g. hover:border-svc-web-border" },
  { key: "hoverShadow", label: "Hover shadow",   hint: "e.g. hover:shadow-[0_0_32px_var(--color-svc-web-border)]" },
  { key: "gradFrom",    label: "Gradient from",  hint: "e.g. from-svc-web-dim" },
];

function ClassesEditor({
  classes,
  service,
  onChange,
}: {
  classes: ProjectClasses;
  service: ServiceSlug;
  onChange: (v: ProjectClasses) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {CLASS_FIELDS.map(({ key, label, hint }) => (
          <Field key={key} label={label}>
            <input
              type="text"
              value={classes[key]}
              onChange={(e) =>
                onChange({ ...classes, [key]: e.target.value })
              }
              placeholder={hint}
              className={cn(inputCls, "font-mono text-xs")}
            />
          </Field>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange(SERVICE_PRESETS[service].classes)}
        className="flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-brand"
      >
        <RotateCcw className="size-3" /> Reset to {service} preset
      </button>
    </div>
  );
}

// Main form

export function ProjectForm(props: ProjectFormProps) {
  const router = useRouter();
  const importFileRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<ProjectFormData>(
    props.mode === "edit" ? props.initialData : EMPTY,
  );
  const [slugManual, setSlugManual] = useState(props.mode === "edit");
  const [importOpen, setImportOpen] = useState(false);
  const [importDraft, setImportDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  /* helpers */
  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!slugManual) set("slug", slugify(title));
  }

  function handleServiceChange(service: ServiceSlug) {
    const preset = SERVICE_PRESETS[service];
    setData((prev) => ({
      ...prev,
      service,
      serviceLabel: preset.label,
      classes: preset.classes,
    }));
  }

  function handleSlugChange(slug: string) {
    setSlugManual(true);
    set("slug", slug);
  }

  function handleTestimonialToggle(enabled: boolean) {
    set(
      "testimonial",
      enabled ? { quote: "", name: "", role: "", initials: "" } : null,
    );
  }

  function importProjectJson(raw: string) {
    const result = parseProjectJsonForForm(raw);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setData(result.data);
    setSlugManual(Boolean(result.data.slug));
    setImportDraft(JSON.stringify(result.data, null, 2));
    setImportOpen(false);
    toast.success("Project JSON imported");
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setImportDraft(text);
      importProjectJson(text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read JSON file");
    } finally {
      if (importFileRef.current) importFileRef.current.value = "";
    }
  }

  /* submit */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        ...data,
        nextSlug: data.nextSlug.trim() || null,
      };

      const url =
        props.mode === "edit"
          ? `/api/admin/projects/${props.id}`
          : "/api/admin/projects";
      const method = props.mode === "edit" ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Save failed");
        toast.success(props.mode === "edit" ? "Project saved" : "Project created");
        router.push("/admin/projects");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  const pageTitle =
    props.mode === "edit" ? `Edit: ${data.title || "Untitled"}` : "New Project";

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Page header ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {pageTitle}
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {props.mode === "edit"
              ? "Update the project details below."
              : "Fill in the details to create a new case study."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects"
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
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Create project"}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <SectionCard
          title="Import JSON"
          description="Paste a complete project payload or load a .json file to prefill this form."
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setImportOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
              >
                <FileJson className="size-4" />
                {importOpen ? "Hide JSON" : "Paste JSON"}
              </button>
              <button
                type="button"
                onClick={() => importFileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
              >
                <Upload className="size-4" />
                Load JSON file
              </button>
              <a
                href="/api/admin/projects/sample-json"
                download
                className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink"
              >
                <Download className="size-4" />
                Download sample
              </a>
              <input
                ref={importFileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleImportFile}
              />
            </div>

            {importOpen && (
              <div className="space-y-2">
                <textarea
                  value={importDraft}
                  onChange={(e) => setImportDraft(e.target.value)}
                  rows={10}
                  placeholder='{"slug":"project-slug","title":"Project title",...}'
                  className={cn(textareaCls, "font-mono text-xs")}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => importProjectJson(importDraft)}
                    className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90"
                  >
                    <FileJson className="size-4" />
                    Import into form
                  </button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_272px]">
        {/* ─── Main content ─── */}
        <div className="space-y-5">

          {/* 1. Core details */}
          <SectionCard
            title="Core Details"
            description="The primary identifiers for this project."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Title" required>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Bienvenidos Apartments Platform"
                    required
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Slug" required>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="bienvenidos-apartments"
                  required
                  className={cn(inputCls, "font-mono text-xs")}
                />
              </Field>
              <Field label="Year" required>
                <input
                  type="text"
                  value={data.year}
                  onChange={(e) => set("year", e.target.value)}
                  placeholder="2025"
                  required
                  className={inputCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 2. Client & service */}
          <SectionCard title="Client & Service">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client" required>
                <input
                  type="text"
                  value={data.client}
                  onChange={(e) => set("client", e.target.value)}
                  placeholder="Bienvenidos Apartments Ltd"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Industry" required>
                <input
                  type="text"
                  value={data.industry}
                  onChange={(e) => set("industry", e.target.value)}
                  placeholder="Real Estate"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Service" required>
                <select
                  name="service"
                  title="service"
                  value={data.service}
                  onChange={(e) => handleServiceChange(e.target.value as ServiceSlug)}
                  className={inputCls}
                >
                  {(Object.keys(SERVICE_PRESETS) as ServiceSlug[]).map((s) => (
                    <option key={s} value={s}>
                      {SERVICE_PRESETS[s].label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Service label" required>
                <input
                  type="text"
                  value={data.serviceLabel}
                  onChange={(e) => set("serviceLabel", e.target.value)}
                  placeholder="Web Solutions"
                  required
                  className={inputCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 3. Summary & metrics */}
          <SectionCard
            title="Summary & Metrics"
            description="The headline summary and key performance metric shown on the portfolio card."
          >
            <div className="space-y-4">
              <Field label="Summary" required>
                <textarea
                  value={data.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  placeholder="A concise paragraph describing the project and its impact…"
                  rows={3}
                  required
                  className={textareaCls}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Metric" required>
                  <input
                    type="text"
                    value={data.metric}
                    onChange={(e) => set("metric", e.target.value)}
                    placeholder="+210%"
                    required
                    className={inputCls}
                  />
                </Field>
                <Field label="Metric label" required>
                  <input
                    type="text"
                    value={data.metricLabel}
                    onChange={(e) => set("metricLabel", e.target.value)}
                    placeholder="Property Inquiries"
                    required
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* 4. Narrative */}
          <SectionCard
            title="Narrative"
            description="The three-part story shown in the case study body."
          >
            <div className="space-y-4">
              <Field label="Challenge" required>
                <textarea
                  value={data.challenge}
                  onChange={(e) => set("challenge", e.target.value)}
                  placeholder="Describe the problem or challenge the client faced…"
                  rows={4}
                  required
                  className={textareaCls}
                />
              </Field>
              <Field label="Approach" required>
                <textarea
                  value={data.approach}
                  onChange={(e) => set("approach", e.target.value)}
                  placeholder="Explain the solution strategy and methodology used…"
                  rows={4}
                  required
                  className={textareaCls}
                />
              </Field>
              <Field label="Outcome" required>
                <textarea
                  value={data.outcome}
                  onChange={(e) => set("outcome", e.target.value)}
                  placeholder="Describe the measurable results and impact achieved…"
                  rows={4}
                  required
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 5. Team & timeline */}
          <SectionCard title="Team & Timeline">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Duration" required>
                  <input
                    type="text"
                    value={data.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="6 weeks"
                    required
                    className={inputCls}
                  />
                </Field>
                <Field label="Team" required>
                  <input
                    type="text"
                    value={data.team}
                    onChange={(e) => set("team", e.target.value)}
                    placeholder="2 engineers, 1 designer"
                    required
                    className={inputCls}
                  />
                </Field>
              </div>
              <TagsEditor tags={data.tags} onChange={(v) => set("tags", v)} />
            </div>
          </SectionCard>

          {/* 6. Results */}
          <SectionCard
            title="Results"
            description="Key metrics shown in the case study hero. Add up to 4."
          >
            <ResultsEditor
              results={data.results}
              onChange={(v) => set("results", v)}
            />
          </SectionCard>

          {/* 7. Deliverables */}
          <SectionCard
            title="Deliverables"
            description="What was produced. Shown in the case study sidebar."
          >
            <DeliverablesEditor
              deliverables={data.deliverables}
              onChange={(v) => set("deliverables", v)}
            />
          </SectionCard>

          {/* 8. Screenshots */}
          <SectionCard
            title="Screenshots"
            description="Images for the case study gallery. First image is used as the portfolio card thumbnail."
          >
            <ScreenshotsEditor
              screenshots={data.screenshots}
              onChange={(v) => set("screenshots", v)}
            />
          </SectionCard>

          {/* 9. Testimonial */}
          <SectionCard
            title="Testimonial"
            description="Optional client quote shown below the screenshots."
          >
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-2.5">
                <div
                  onClick={() => handleTestimonialToggle(!data.testimonial)}
                  className={cn(
                    "relative h-5 w-9 cursor-pointer rounded-full border transition-colors",
                    data.testimonial
                      ? "border-brand bg-brand"
                      : "border-line bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 size-4 rounded-full bg-page shadow transition-transform",
                      data.testimonial ? "translate-x-4" : "translate-x-0.5",
                    )}
                  />
                </div>
                <span className="text-sm text-ink-muted">Include testimonial</span>
              </label>

              {data.testimonial && (
                <div className="space-y-3 rounded-lg border border-line bg-page p-4">
                  <Field label="Quote" required>
                    <textarea
                      value={data.testimonial.quote}
                      onChange={(e) =>
                        set("testimonial", { ...data.testimonial!, quote: e.target.value })
                      }
                      placeholder="The team delivered beyond our expectations…"
                      rows={3}
                      className={textareaCls}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Name">
                      <input
                        type="text"
                        value={data.testimonial.name}
                        onChange={(e) =>
                          set("testimonial", { ...data.testimonial!, name: e.target.value })
                        }
                        placeholder="Sarah Mitchell"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Role">
                      <input
                        type="text"
                        value={data.testimonial.role}
                        onChange={(e) =>
                          set("testimonial", { ...data.testimonial!, role: e.target.value })
                        }
                        placeholder="CEO, Bienvenidos Apartments"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Initials">
                      <input
                        type="text"
                        value={data.testimonial.initials}
                        onChange={(e) =>
                          set("testimonial", {
                            ...data.testimonial!,
                            initials: e.target.value.slice(0, 3).toUpperCase(),
                          })
                        }
                        placeholder="SM"
                        maxLength={3}
                        className={cn(inputCls, "font-mono uppercase")}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* 10. Style classes */}
          <SectionCard
            title="Style Classes"
            description="Tailwind classes that theme this project's accent colour. Auto-filled by service — edit only if customising."
          >
            <ClassesEditor
              classes={data.classes}
              service={data.service}
              onChange={(v) => set("classes", v)}
            />
          </SectionCard>
        </div>

        {/* ─── Settings sidebar ─── */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Publish status */}
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

          {/* Featured */}
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Featured
            </h3>
            <button
              type="button"
              onClick={() => set("featured", !data.featured)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                data.featured
                  ? "border-brand-border bg-brand-dim text-brand"
                  : "border-line text-ink-muted hover:border-line-hi",
              )}
            >
              <span>{data.featured ? "Featured" : "Not featured"}</span>
              <Star
                className="size-4"
                fill={data.featured ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Sort order */}
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <Field label="Sort order">
              <Input
                type="number"
                value={data.sortOrder}
                onChange={(e) => set("sortOrder", parseInt(e.target.value, 10) || 0)}
                min={0}
                className={cn(inputCls, "font-mono")}
              />
            </Field>
            <p className="mt-1.5 text-[11px] text-ink-faint">
              Lower numbers appear first in the portfolio grid.
            </p>
          </div>

          {/* Next project */}
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <Field label="Next project slug">
              <input
                type="text"
                value={data.nextSlug}
                onChange={(e) => set("nextSlug", e.target.value)}
                placeholder="nexus-commerce"
                className={cn(inputCls, "font-mono text-xs")}
              />
            </Field>
            <p className="mt-1.5 text-[11px] text-ink-faint">
              Shown as the &quot;Next case study&quot; link at the end of this project.
            </p>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Create project"}
          </button>
        </div>
      </div>
    </form>
  );
}
