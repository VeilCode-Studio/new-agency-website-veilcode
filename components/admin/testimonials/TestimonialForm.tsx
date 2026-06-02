"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Loader2,
  MessageSquareQuote,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Field } from "@/components/admin/forms/Field";
import { SectionCard } from "@/components/admin/forms/SectionCard";
import { createAvatarUploadFormData } from "@/lib/testimonials/avatarUpload";

export type TestimonialFormData = {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string | null;
};

type TestimonialFormProps =
  | { mode: "create" }
  | { mode: "edit"; id: number; initialData: TestimonialFormData };

const EMPTY: TestimonialFormData = {
  name: "",
  role: "",
  company: "",
  quote: "",
  avatar: null,
};

const inputCls =
  "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

const textareaCls =
  "w-full resize-y rounded-md border border-line bg-page px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none";

export function TestimonialForm(props: TestimonialFormProps) {
  const router = useRouter();
  const [data, setData] = useState<TestimonialFormData>(
    props.mode === "edit" ? props.initialData : EMPTY,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof TestimonialFormData>(
    key: K,
    value: TestimonialFormData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const url =
        props.mode === "edit"
          ? `/api/admin/testimonials/${props.id}`
          : "/api/admin/testimonials";
      const method = props.mode === "edit" ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Save failed");

        toast.success(
          props.mode === "edit" ? "Testimonial saved" : "Testimonial created",
        );
        router.push("/admin/testimonials");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: createAvatarUploadFormData(file),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");

      set("avatar", json.url);
      toast.success("Avatar uploaded to Cloudinary");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const pageTitle =
    props.mode === "edit" ? `Edit: ${data.name || "Untitled"}` : "New Testimonial";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {pageTitle}
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {props.mode === "edit"
              ? "Update the client story shown on the landing page."
              : "Create a client story for the landing page carousel."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/testimonials"
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
            {isPending
              ? "Saving..."
              : props.mode === "edit"
                ? "Save changes"
                : "Create testimonial"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <SectionCard
            title="Client Details"
            description="Who gave the testimonial and how they should be attributed."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" required>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Sarah Okonkwo"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Role" required>
                <input
                  type="text"
                  value={data.role}
                  onChange={(e) => set("role", e.target.value)}
                  placeholder="CEO"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Company" required>
                <input
                  type="text"
                  value={data.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Nexus Commerce"
                  required
                  className={inputCls}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Avatar"
            description="Upload a premium client profile image. Files are stored in the Cloudinary avatars folder."
          >
            <div className="grid gap-4 md:grid-cols-[112px_minmax(0,1fr)]">
              <div className="relative size-28 overflow-hidden rounded-2xl border border-line bg-surface">
                {data.avatar ? (
                  <div
                    className="size-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.avatar})` }}
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 text-ink-faint">
                    <ImageIcon className="size-7" />
                    <span className="text-[10px] uppercase tracking-widest">Avatar</span>
                  </div>
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 grid place-items-center bg-page/75 text-brand">
                    <Loader2 className="size-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center rounded-xl border border-line bg-page p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="inline-flex items-center gap-2 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <UploadCloud className="size-4" />
                    )}
                    {isUploadingAvatar ? "Uploading..." : "Upload image"}
                  </button>
                  {data.avatar && (
                    <button
                      type="button"
                      onClick={() => set("avatar", null)}
                      disabled={isUploadingAvatar}
                      className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-60"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                  Use a square headshot where possible. Uploads are saved under
                  the configured Cloudinary root folder plus{" "}
                  <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
                    avatars
                  </code>
                  .
                </p>
                {data.avatar && (
                  <input
                    type="url"
                    value={data.avatar}
                    onChange={(e) => set("avatar", e.target.value || null)}
                    className="mt-3 w-full rounded-md border border-line bg-surface px-3 py-2 font-mono text-[11px] text-ink-muted focus:border-brand focus:outline-none"
                    aria-label="Avatar URL"
                  />
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Quote"
            description="Keep it specific, outcome-oriented, and short enough for the carousel."
          >
            <Field label="Client quote" required>
              <textarea
                value={data.quote}
                onChange={(e) => set("quote", e.target.value)}
                placeholder="VeilCode did not just build us a website..."
                rows={7}
                required
                className={textareaCls}
              />
            </Field>
          </SectionCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h2 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Preview
            </h2>
            <div className="rounded-lg border border-line bg-page p-4">
              <MessageSquareQuote className="mb-3 size-5 text-brand" />
              <p className="line-clamp-5 text-sm leading-6 text-ink-muted">
                {data.quote || "Client quote preview appears here."}
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                <div className="grid size-10 overflow-hidden rounded-full border border-brand-border bg-brand-dim text-brand">
                  {data.avatar ? (
                    <div
                      className="size-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${data.avatar})` }}
                    />
                  ) : (
                    <ImageIcon className="m-auto size-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink">
                    {data.name || "Client name"}
                  </div>
                  <div className="truncate text-xs text-ink-muted">
                    {data.role || "Role"}
                    {data.company ? `, ${data.company}` : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending
              ? "Saving..."
              : props.mode === "edit"
                ? "Save changes"
                : "Create testimonial"}
          </button>
        </aside>
      </div>
    </form>
  );
}
