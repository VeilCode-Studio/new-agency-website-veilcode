"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type JobFormData = {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  published: boolean;
};

export type JobFormProps =
  | { mode: "create" }
  | { mode: "edit"; id: number; initialData: JobFormData };

const EMPTY: JobFormData = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  experience: "",
  description: "",
  responsibilities: [],
  published: true,
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

const DEPARTMENT_SUGGESTIONS = [
  "Web Solutions",
  "Mobile Apps",
  "Data Analytics",
  "Social Media",
  "AI Automation",
  "Design",
  "Marketing",
  "Operations",
];

const LOCATION_SUGGESTIONS = [
  "Kampala, Uganda (On-site)",
  "Kampala, Uganda (Hybrid)",
  "Remote (East Africa)",
  "Remote (Worldwide)",
];

const EXPERIENCE_SUGGESTIONS = [
  "Entry level",
  "1–2 years",
  "3–4 years",
  "5+ years",
  "Senior (7+ years)",
  "Lead / Principal",
];

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

// Responsibilities list editor

function ResponsibilitiesEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (v: string[]) => void;
}) {
  function patch(i: number, val: string) {
    onChange(items.map((item, idx) => (idx === i ? val : item)));
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="shrink-0 text-brand mt-px">→</span>
          <input
            type="text"
            value={item}
            onChange={(e) => patch(i, e.target.value)}
            placeholder="Responsibility or expectation…"
            className={cn(inputCls, "flex-1")}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="shrink-0 text-ink-faint hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 rounded-md border border-dashed border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="size-3.5" /> Add responsibility
      </button>
    </div>
  );
}

// Main form

export function JobForm(props: JobFormProps) {
  const router = useRouter();
  const [data, setData] = useState<JobFormData>(
    props.mode === "edit" ? props.initialData : EMPTY,
  );
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const url =
        props.mode === "edit"
          ? `/api/admin/careers/${props.id}`
          : "/api/admin/careers";
      const method = props.mode === "edit" ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Save failed");
        toast.success(props.mode === "edit" ? "Opening saved" : "Opening created");
        router.push("/admin/careers");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  const pageTitle =
    props.mode === "edit" ? `Edit: ${data.title || "Untitled"}` : "New Job Opening";

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
              ? "Update the job opening details below."
              : "Fill in the details to post a new job opening."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/careers"
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
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Post opening"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_272px]">
        {/* Main content */}
        <div className="space-y-5">

          {/* 1. Role details */}
          <SectionCard
            title="Role Details"
            description="The core information shown on the public careers page."
          >
            <div className="space-y-4">
              <Field label="Job title" required>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Senior Full-Stack Engineer"
                  required
                  className={inputCls}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Department" required>
                  <input
                    type="text"
                    value={data.department}
                    onChange={(e) => set("department", e.target.value)}
                    placeholder="Web Solutions"
                    required
                    list="dept-suggestions"
                    className={inputCls}
                  />
                  <datalist id="dept-suggestions">
                    {DEPARTMENT_SUGGESTIONS.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </Field>

                <Field label="Location" required>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Kampala, Uganda (Hybrid)"
                    required
                    list="location-suggestions"
                    className={inputCls}
                  />
                  <datalist id="location-suggestions">
                    {LOCATION_SUGGESTIONS.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                </Field>

                <Field label="Employment type" required>
                  <select
                    value={data.type}
                    onChange={(e) => set("type", e.target.value)}
                    required
                    className={inputCls}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Experience level" required>
                  <input
                    type="text"
                    value={data.experience}
                    onChange={(e) => set("experience", e.target.value)}
                    placeholder="5+ years"
                    required
                    list="exp-suggestions"
                    className={inputCls}
                  />
                  <datalist id="exp-suggestions">
                    {EXPERIENCE_SUGGESTIONS.map((e) => (
                      <option key={e} value={e} />
                    ))}
                  </datalist>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* 2. Description */}
          <SectionCard
            title="Description"
            description="A compelling overview of the role shown on the public listing."
          >
            <Field label="Role description" required>
              <textarea
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Lead the architecture and development of premium, high-performance web platforms for our enterprise clients…"
                rows={5}
                required
                className={textareaCls}
              />
            </Field>
          </SectionCard>

          {/* 3. Responsibilities */}
          <SectionCard
            title="Responsibilities"
            description="What the successful candidate will do day-to-day."
          >
            <ResponsibilitiesEditor
              items={data.responsibilities}
              onChange={(v) => set("responsibilities", v)}
            />
          </SectionCard>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Published status */}
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Visibility
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
              <span>{data.published ? "Live on site" : "Hidden (draft)"}</span>
              {data.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
            <p className="mt-2 text-[11px] text-ink-faint">
              Live openings appear immediately on the public careers page.
            </p>
          </div>

          {/* Preview card */}
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Preview
            </h3>
            <div className="rounded-lg border border-line bg-page p-3 space-y-1.5">
              <p className="text-sm font-medium text-ink truncate">
                {data.title || <span className="text-ink-faint">Job title</span>}
              </p>
              <p className="text-xs text-ink-muted">
                {data.department || "Department"}{data.department && data.location ? " · " : ""}{data.location || ""}
              </p>
              {data.type && (
                <span className="inline-block rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                  {data.type}
                </span>
              )}
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Saving…" : props.mode === "edit" ? "Save changes" : "Post opening"}
          </button>
        </div>
      </div>
    </form>
  );
}
