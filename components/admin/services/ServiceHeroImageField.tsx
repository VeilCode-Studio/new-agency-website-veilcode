"use client";

import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";
import { getServiceHeroImage, isServiceImageSource, type ServiceHeroImage } from "@/lib/service-images";
import { publicImageSource } from "@/lib/public-image";
import { SectionCard } from "../forms/SectionCard";
import { Field } from "../forms/Field";

const inputClass = "w-full rounded-md border border-line bg-page px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none";

export function ServiceHeroImageField({ value, onChange, uploading, onUploadingChange, disabled }: {
  value: ServiceHeroImage & { id: string; title: string };
  onChange: (image: ServiceHeroImage) => void;
  uploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
  disabled: boolean;
}) {
  const uploadInProgress = useRef(false);
  const image = getServiceHeroImage(value);
  const locked = disabled || uploading;

  async function upload(file: File) {
    if (uploadInProgress.current || disabled) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      toast.error("Choose a JPEG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("The image must be 10 MB or smaller.");
      return;
    }
    uploadInProgress.current = true;
    onUploadingChange(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "services");
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Image upload failed.");
      if (typeof result.url !== "string" || !isServiceImageSource(result.url)) throw new Error("The uploader returned an unsupported image URL.");
      onChange({ heroSrc: result.url, heroAlt: "", heroTitle: value.title });
      toast.success("Image uploaded. Add descriptive alt text, then save the service.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      uploadInProgress.current = false;
      onUploadingChange(false);
    }
  }

  return (
    <SectionCard title="Service hero image" description="Upload a replacement for this service page. A landscape image in a 3:2 ratio works best. Save the service to publish changes.">
      <div className="space-y-4" aria-busy={uploading}>
        {image?.heroSrc && (
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-line bg-page">
            <Image src={publicImageSource(image.heroSrc)} alt={image.heroAlt || "Service image preview"} title={image.heroTitle || value.title} fill sizes="(max-width: 700px) 90vw, 550px" className="object-cover" />
          </div>
        )}
        <Field label="Upload service image" htmlFor="service-hero-file">
          <input id="service-hero-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={locked} className={inputClass}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file) void upload(file);
            }} />
          <p className="text-xs text-ink-muted">JPEG, PNG, WebP or AVIF, up to 10 MB. {value.heroSrc ? "Custom image selected." : image ? "Using the generated default for this service." : "No default image for this service."}</p>
        </Field>
        <p role="status" className="text-xs text-ink-muted">{uploading ? "Uploading image..." : ""}</p>
        {value.heroSrc && (
          <>
            <Field label="Image alt text" htmlFor="service-hero-alt" required>
              <textarea id="service-hero-alt" value={value.heroAlt || ""} required maxLength={500} disabled={locked} rows={2} className={inputClass}
                onChange={(event) => onChange({ heroSrc: value.heroSrc, heroAlt: event.target.value, heroTitle: value.heroTitle })} />
              <p className="text-xs text-ink-muted">Describe what is visible in the replacement image.</p>
            </Field>
            <Field label="Image title (optional)" htmlFor="service-hero-title">
              <input id="service-hero-title" value={value.heroTitle || ""} maxLength={200} disabled={locked} className={inputClass}
                onChange={(event) => onChange({ heroSrc: value.heroSrc, heroAlt: value.heroAlt, heroTitle: event.target.value })} />
            </Field>
            <button type="button" disabled={locked} onClick={() => onChange({ heroSrc: null, heroAlt: null, heroTitle: null })}
              className="rounded-md border border-line px-3 py-2 text-sm text-ink-muted hover:text-ink disabled:opacity-60">
              {getServiceHeroImage({ id: value.id, title: value.title }) ? "Restore generated default" : "Remove image"}
            </button>
          </>
        )}
      </div>
    </SectionCard>
  );
}
