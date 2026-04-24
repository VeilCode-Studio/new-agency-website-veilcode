"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus, Trash2, Upload, Loader2, ChevronUp, ChevronDown,
  RefreshCw, Eye, EyeOff, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogAuthor, TocEntry, ContentBlock } from "@/constants/blog";
import type { BlogPostClasses } from "@/types/content";

// Form data type

export type BlogFormData = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string; // YYYY-MM-DD
  readTime: string;
  author: BlogAuthor;
  heroAlt: string;
  heroSrc: string | null;
  toc: TocEntry[];
  body: ContentBlock[];
  relatedSlugs: string[];
  classes: BlogPostClasses;
  published: boolean;
};

export type BlogFormProps =
  | { mode: "create" }
  | { mode: "edit"; id: number; initialData: BlogFormData };

// Author presets matching constants/blog.ts

const AUTHOR_PRESETS: Record<string, BlogAuthor> = {
  frank: {
    name: "Frank Tamale",
    role: "Founder & Lead Engineer",
    initials: "DK",
    bio: "Full-stack engineer with a decade of experience building products that scale.",
    linkedin: "#",
    twitter: "#",
    accent: "text-brand",
    dimBg: "bg-brand-dim",
    border: "border-brand-border",
  },
  ronald: {
    name: "Ronald Mugisha",
    role: "Head of Data & AI",
    initials: "RM",
    bio: "Data engineer and ML practitioner building analytics systems and AI automation pipelines.",
    linkedin: "#",
    twitter: "#",
    accent: "text-svc-data",
    dimBg: "bg-svc-data-dim",
    border: "border-svc-data-border",
  },
  aisha: {
    name: "Aisha Nakato",
    role: "Creative Director",
    initials: "AN",
    bio: "Designer who codes. Writes about design systems and building interfaces that perform.",
    linkedin: "#",
    twitter: "#",
    accent: "text-svc-mobile",
    dimBg: "bg-svc-mobile-dim",
    border: "border-svc-mobile-border",
  },
};

// Class presets

const CLASS_PRESETS: Record<string, BlogPostClasses> = {
  brand:  { accent: "text-brand",      dimBg: "bg-brand-dim",       border: "border-brand-border" },
  web:    { accent: "text-svc-web",    dimBg: "bg-svc-web-dim",     border: "border-svc-web-border" },
  mobile: { accent: "text-svc-mobile", dimBg: "bg-svc-mobile-dim",  border: "border-svc-mobile-border" },
  data:   { accent: "text-svc-data",   dimBg: "bg-svc-data-dim",    border: "border-svc-data-border" },
  social: { accent: "text-svc-social", dimBg: "bg-svc-social-dim",  border: "border-svc-social-border" },
  ai:     { accent: "text-svc-ai",     dimBg: "bg-svc-ai-dim",      border: "border-svc-ai-border" },
};

const EMPTY: BlogFormData = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  tags: [],
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime: "",
  author: AUTHOR_PRESETS.frank,
  heroAlt: "",
  heroSrc: null,
  toc: [],
  body: [],
  relatedSlugs: [],
  classes: CLASS_PRESETS.brand,
  published: false,
};

// Primitive field components

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
      <label className="block text-xs font-medium text-ink-muted">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
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
        {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// Chip editor for string arrays

function ChipEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function add() {
    const t = input.trim();
    if (!t || values.includes(t)) return;
    onChange([...values, t]);
    setInput("");
  }

  return (
    <Field label={label}>
      <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-md border border-line bg-page p-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-ink"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
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
            if (e.key === "Enter") { e.preventDefault(); add(); }
            if (e.key === "Backspace" && !input && values.length) onChange(values.slice(0, -1));
          }}
          placeholder={values.length === 0 ? (placeholder ?? "Type and press Enter…") : "Add another…"}
          className="min-w-28 flex-1 bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
        />
      </div>
    </Field>
  );
}

// Hero image uploader

function HeroUploader({
  src,
  alt,
  onSrcChange,
  onAltChange,
}: {
  src: string | null;
  alt: string;
  onSrcChange: (v: string | null) => void;
  onAltChange: (v: string) => void;
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
      body.append("folder", "blog");
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onSrcChange(data.url);
      toast.success("Hero image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview / upload zone */}
      <div className="relative h-48 overflow-hidden rounded-xl border border-line bg-surface">
        {src ? (
          <>
            <Image src={src} alt={alt || "Hero"} fill className="object-cover" sizes="600px" />
            <button
              type="button"
              onClick={() => onSrcChange(null)}
              className="absolute right-2 top-2 rounded-md bg-page/80 px-2.5 py-1 text-xs text-ink-muted backdrop-blur hover:text-destructive"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-faint transition-colors hover:text-brand"
          >
            {uploading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <>
                <Upload className="size-6" />
                <span className="text-xs">Click to upload hero image</span>
              </>
            )}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <Field label="Alt text" required>
        <input
          type="text"
          value={alt}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Descriptive text for screen readers and SEO"
          className={inputCls}
        />
      </Field>
    </div>
  );
}

// Author editor

function AuthorEditor({
  author,
  onChange,
}: {
  author: BlogAuthor;
  onChange: (v: BlogAuthor) => void;
}) {
  function patch(p: Partial<BlogAuthor>) {
    onChange({ ...author, ...p });
  }

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          Quick fill
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(AUTHOR_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                author.name === preset.name
                  ? "border-brand-border bg-brand-dim text-brand"
                  : "border-line text-ink-muted hover:border-line-hi hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded border font-mono text-[9px] font-bold",
                  preset.dimBg,
                  preset.border,
                  preset.accent,
                )}
              >
                {preset.initials}
              </span>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual fields */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" required>
          <input
            type="text"
            value={author.name}
            onChange={(e) => patch({ name: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Role" required>
          <input
            type="text"
            value={author.role}
            onChange={(e) => patch({ role: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Initials">
          <input
            type="text"
            value={author.initials}
            onChange={(e) => patch({ initials: e.target.value.slice(0, 3).toUpperCase() })}
            maxLength={3}
            className={cn(inputCls, "font-mono uppercase")}
          />
        </Field>
        <Field label="Bio">
          <input
            type="text"
            value={author.bio}
            onChange={(e) => patch({ bio: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="LinkedIn URL">
          <input
            type="text"
            value={author.linkedin}
            onChange={(e) => patch({ linkedin: e.target.value })}
            placeholder="#"
            className={inputCls}
          />
        </Field>
        <Field label="Twitter / X URL">
          <input
            type="text"
            value={author.twitter}
            onChange={(e) => patch({ twitter: e.target.value })}
            placeholder="#"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Author accent classes */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Accent class">
          <input
            type="text"
            value={author.accent}
            onChange={(e) => patch({ accent: e.target.value })}
            placeholder="text-brand"
            className={cn(inputCls, "font-mono text-xs")}
          />
        </Field>
        <Field label="Dim bg class">
          <input
            type="text"
            value={author.dimBg}
            onChange={(e) => patch({ dimBg: e.target.value })}
            placeholder="bg-brand-dim"
            className={cn(inputCls, "font-mono text-xs")}
          />
        </Field>
        <Field label="Border class">
          <input
            type="text"
            value={author.border}
            onChange={(e) => patch({ border: e.target.value })}
            placeholder="border-brand-border"
            className={cn(inputCls, "font-mono text-xs")}
          />
        </Field>
      </div>
    </div>
  );
}

// Body block editor

type BlockType = ContentBlock["type"];

const BLOCK_LABELS: Record<BlockType, string> = {
  h2: "Heading 2",
  h3: "Heading 3",
  p: "Paragraph",
  ul: "Bullet list",
  ol: "Numbered list",
  code: "Code block",
  callout: "Callout",
  divider: "Divider",
};

const BLOCK_TYPE_OPTIONS: BlockType[] = ["h2", "h3", "p", "ul", "ol", "code", "callout", "divider"];

function slugifyText(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function emptyBlock(type: BlockType): ContentBlock {
  switch (type) {
    case "h2":      return { type: "h2", id: "", text: "" };
    case "h3":      return { type: "h3", id: "", text: "" };
    case "p":       return { type: "p", html: "" };
    case "ul":      return { type: "ul", items: [""] };
    case "ol":      return { type: "ol", items: [""] };
    case "code":    return { type: "code", lang: "tsx", code: "" };
    case "callout": return { type: "callout", variant: "info", html: "" };
    case "divider": return { type: "divider" };
  }
}

function BlockEditor({
  block,
  onUpdate,
  onRemove,
  onUp,
  onDown,
  canUp,
  canDown,
}: {
  block: ContentBlock;
  onUpdate: (b: ContentBlock) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  function changeType(type: BlockType) {
    onUpdate(emptyBlock(type));
  }

  return (
    <div className="rounded-lg border border-line bg-page">
      {/* Block header */}
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <select
          value={block.type}
          onChange={(e) => changeType(e.target.value as BlockType)}
          className="rounded border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-muted focus:outline-none"
        >
          {BLOCK_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{BLOCK_LABELS[t]}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={onUp}
            disabled={!canUp}
            className="rounded p-1 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onDown}
            disabled={!canDown}
            className="rounded p-1 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
          >
            <ChevronDown className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-ink-faint hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Block body */}
      <div className="p-3">
        {(block.type === "h2" || block.type === "h3") && (
          <input
            type="text"
            value={block.text}
            onChange={(e) => {
              const text = e.target.value;
              onUpdate({ ...block, text, id: slugifyText(text) } as ContentBlock);
            }}
            placeholder={`${block.type.toUpperCase()} heading text…`}
            className={cn(
              inputCls,
              block.type === "h2" ? "text-base font-bold" : "font-semibold",
            )}
          />
        )}

        {block.type === "p" && (
          <textarea
            value={block.html}
            onChange={(e) => onUpdate({ ...block, html: e.target.value })}
            placeholder="Paragraph HTML. Use <code>, <strong>, <em>, <a href=…> as needed."
            rows={4}
            className={textareaCls}
          />
        )}

        {(block.type === "ul" || block.type === "ol") && (
          <div className="space-y-2">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="shrink-0 font-mono text-[11px] text-ink-faint w-4 text-right">
                  {block.type === "ul" ? "•" : `${i + 1}.`}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...block.items];
                    next[i] = e.target.value;
                    onUpdate({ ...block, items: next } as ContentBlock);
                  }}
                  placeholder="List item HTML…"
                  className={cn(inputCls, "flex-1 text-xs")}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = block.items.filter((_, idx) => idx !== i);
                    onUpdate({ ...block, items: next.length ? next : [""] } as ContentBlock);
                  }}
                  className="shrink-0 text-ink-faint hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onUpdate({ ...block, items: [...block.items, ""] } as ContentBlock)}
              className="flex items-center gap-1.5 rounded-md border border-dashed border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-brand hover:text-brand"
            >
              <Plus className="size-3" /> Add item
            </button>
          </div>
        )}

        {block.type === "code" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={block.lang}
                onChange={(e) => onUpdate({ ...block, lang: e.target.value })}
                placeholder="tsx"
                className={cn(inputCls, "w-24 font-mono text-xs")}
              />
              <span className="text-xs text-ink-faint">language</span>
            </div>
            <textarea
              value={block.code}
              onChange={(e) => onUpdate({ ...block, code: e.target.value })}
              placeholder="Code content…"
              rows={8}
              className={cn(textareaCls, "font-mono text-xs")}
            />
          </div>
        )}

        {block.type === "callout" && (
          <div className="space-y-2">
            <select
              value={block.variant}
              onChange={(e) =>
                onUpdate({ ...block, variant: e.target.value as "info" | "warning" | "tip" })
              }
              className={cn(inputCls, "w-36")}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="tip">Tip</option>
            </select>
            <textarea
              value={block.html}
              onChange={(e) => onUpdate({ ...block, html: e.target.value })}
              placeholder="Callout HTML content…"
              rows={3}
              className={textareaCls}
            />
          </div>
        )}

        {block.type === "divider" && (
          <div className="flex items-center gap-2 py-1">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[10px] font-mono text-ink-faint">divider</span>
            <div className="h-px flex-1 bg-line" />
          </div>
        )}
      </div>
    </div>
  );
}

function BodyEditor({
  body,
  onChange,
}: {
  body: ContentBlock[];
  onChange: (v: ContentBlock[]) => void;
}) {
  function update(i: number, b: ContentBlock) {
    onChange(body.map((block, idx) => (idx === i ? b : block)));
  }

  function move(from: number, to: number) {
    const next = [...body];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {body.map((block, i) => (
        <BlockEditor
          key={i}
          block={block}
          onUpdate={(b) => update(i, b)}
          onRemove={() => onChange(body.filter((_, idx) => idx !== i))}
          onUp={() => move(i, i - 1)}
          onDown={() => move(i, i + 1)}
          canUp={i > 0}
          canDown={i < body.length - 1}
        />
      ))}
      {/* Add block row */}
      <div className="flex flex-wrap gap-2">
        {BLOCK_TYPE_OPTIONS.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange([...body, emptyBlock(type)])}
            className="flex items-center gap-1 rounded-md border border-dashed border-line px-2.5 py-1.5 text-[11px] text-ink-muted transition-colors hover:border-brand hover:text-brand"
          >
            <Plus className="size-3" /> {BLOCK_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

// TOC utilities

function buildTocFromBody(body: ContentBlock[]): TocEntry[] {
  return body
    .filter((b): b is Extract<ContentBlock, { type: "h2" | "h3" }> =>
      b.type === "h2" || b.type === "h3",
    )
    .map((b) => ({
      id: b.id || slugifyText(b.text),
      level: b.type === "h2" ? 2 : 3,
      text: b.text,
    }));
}

// Main form

export function BlogPostForm(props: BlogFormProps) {
  const router = useRouter();
  const [data, setData] = useState<BlogFormData>(
    props.mode === "edit" ? props.initialData : EMPTY,
  );
  const [slugManual, setSlugManual] = useState(props.mode === "edit");
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof BlogFormData>(key: K, value: BlogFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!slugManual) set("slug", slugifyText(title));
  }

  function handleSlugChange(slug: string) {
    setSlugManual(true);
    set("slug", slug);
  }

  function regenerateToc() {
    set("toc", buildTocFromBody(data.body));
    toast.success("TOC regenerated from headings");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const url =
        props.mode === "edit"
          ? `/api/admin/blog/${props.id}`
          : "/api/admin/blog";
      const method = props.mode === "edit" ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Save failed");
        toast.success(props.mode === "edit" ? "Post saved" : "Post created");
        router.push("/admin/blog");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  const pageTitle =
    props.mode === "edit" ? `Edit: ${data.title || "Untitled"}` : "New Post";

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
              ? "Update the post details below."
              : "Fill in the details to create a new blog post."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog"
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
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Publish post"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_272px]">
        {/* Main content */}
        <div className="space-y-5">

          {/* 1. Core info */}
          <SectionCard
            title="Core Info"
            description="The primary metadata shown in listings and SEO."
          >
            <div className="space-y-4">
              <Field label="Title" required>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Building Fast Web Apps for Low-Bandwidth Markets"
                  required
                  className={inputCls}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Slug" required>
                  <input
                    type="text"
                    value={data.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="next-js-performance-east-africa"
                    required
                    className={cn(inputCls, "font-mono text-xs")}
                  />
                </Field>
                <Field label="Category" required>
                  <input
                    type="text"
                    value={data.category}
                    onChange={(e) => set("category", e.target.value)}
                    placeholder="Engineering"
                    required
                    list="categories"
                    className={inputCls}
                  />
                  <datalist id="categories">
                    {["Engineering", "AI & Automation", "Design", "Marketing", "Product"].map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Published date" required>
                  <input
                    type="date"
                    value={data.publishedAt}
                    onChange={(e) => set("publishedAt", e.target.value)}
                    required
                    className={inputCls}
                  />
                </Field>
                <Field label="Read time" required>
                  <input
                    type="text"
                    value={data.readTime}
                    onChange={(e) => set("readTime", e.target.value)}
                    placeholder="9 min read"
                    required
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Excerpt" required>
                <textarea
                  value={data.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="2–3 sentence summary shown on listing cards and in meta description…"
                  rows={3}
                  required
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 2. Hero image */}
          <SectionCard
            title="Hero Image"
            description="Shown in the post header and on listing cards."
          >
            <HeroUploader
              src={data.heroSrc}
              alt={data.heroAlt}
              onSrcChange={(v) => set("heroSrc", v)}
              onAltChange={(v) => set("heroAlt", v)}
            />
          </SectionCard>

          {/* 3. Body */}
          <SectionCard
            title="Body"
            description="Add content blocks to build the article. Headings auto-populate the TOC."
          >
            <BodyEditor body={data.body} onChange={(v) => set("body", v)} />
          </SectionCard>

          {/* 4. Author */}
          <SectionCard
            title="Author"
            description="Shown in the post header and on listing cards."
          >
            <AuthorEditor
              author={data.author}
              onChange={(v) => set("author", v)}
            />
          </SectionCard>

          {/* 5. Tags & related */}
          <SectionCard title="Tags & Related Posts">
            <div className="space-y-4">
              <ChipEditor
                label="Tags"
                values={data.tags}
                onChange={(v) => set("tags", v)}
                placeholder="Next.js, Performance, React…"
              />
              <ChipEditor
                label="Related post slugs"
                values={data.relatedSlugs}
                onChange={(v) => set("relatedSlugs", v)}
                placeholder="next-js-performance-east-africa…"
              />
            </div>
          </SectionCard>

          {/* 6. Style classes */}
          <SectionCard
            title="Style Classes"
            description="Accent colour applied to the hero, cards, and category badges. Pick a preset or override manually."
          >
            <div className="space-y-4">
              {/* Preset swatches */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(CLASS_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set("classes", preset)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                      data.classes.accent === preset.accent
                        ? "border-brand-border bg-brand-dim text-brand"
                        : "border-line text-ink-muted hover:border-line-hi hover:text-ink",
                    )}
                  >
                    <span className={cn("size-2 rounded-full bg-current", preset.accent)} />
                    {key}
                  </button>
                ))}
              </div>
              {/* Manual override */}
              <div className="grid gap-3 sm:grid-cols-3">
                {(["accent", "dimBg", "border"] as const).map((key) => (
                  <Field key={key} label={key}>
                    <input
                      type="text"
                      value={data.classes[key]}
                      onChange={(e) => set("classes", { ...data.classes, [key]: e.target.value })}
                      placeholder={CLASS_PRESETS.brand[key]}
                      className={cn(inputCls, "font-mono text-xs")}
                    />
                  </Field>
                ))}
              </div>
              <button
                type="button"
                onClick={() => set("classes", CLASS_PRESETS.brand)}
                className="flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-brand"
              >
                <RotateCcw className="size-3" /> Reset to brand preset
              </button>
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
              {data.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>

          {/* TOC */}
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Table of contents
              </h3>
              <button
                type="button"
                onClick={regenerateToc}
                title="Regenerate from body headings"
                className="flex items-center gap-1 text-[10px] text-ink-faint transition-colors hover:text-brand"
              >
                <RefreshCw className="size-3" /> Sync
              </button>
            </div>
            {data.toc.length === 0 ? (
              <p className="text-xs text-ink-faint">
                Click Sync to generate from H2 / H3 headings in the body.
              </p>
            ) : (
              <ul className="space-y-1">
                {data.toc.map((entry, i) => (
                  <li
                    key={i}
                    className={cn(
                      "truncate text-xs text-ink-muted",
                      entry.level === 3 && "pl-3 text-ink-faint",
                    )}
                  >
                    {entry.level === 2 ? "— " : "↳ "}{entry.text}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Publish post"}
          </button>
        </div>
      </div>
    </form>
  );
}
