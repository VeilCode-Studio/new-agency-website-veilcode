import { isServiceImageSource, type ServiceHeroImage } from "@/lib/service-images";

type ImageInputResult =
  | { success: true; data: Partial<ServiceHeroImage> }
  | { success: false; error: string };

/** Omitted image fields preserve existing values for older admin clients. */
export function parseServiceImageInput(body: Record<string, unknown>): ImageInputResult {
  const fields = ["heroSrc", "heroAlt", "heroTitle"] as const;
  if (!fields.some((key) => Object.hasOwn(body, key))) return { success: true, data: {} };
  for (const key of fields) {
    if (body[key] != null && typeof body[key] !== "string") {
      return { success: false, error: "Image fields must be text." };
    }
  }
  if (!Object.hasOwn(body, "heroSrc")) return { success: false, error: "Include the image source when editing image details." };
  const heroSrc = (body.heroSrc as string | null | undefined)?.trim() || null;
  const heroAlt = (body.heroAlt as string | null | undefined)?.trim() || null;
  const heroTitle = (body.heroTitle as string | null | undefined)?.trim() || null;
  if (heroSrc && (heroSrc.length > 2048 || !isServiceImageSource(heroSrc))) {
    return { success: false, error: "Use an uploaded Cloudinary image or a local service image." };
  }
  if (heroSrc && !heroAlt) return { success: false, error: "Describe the uploaded image in the alt text field." };
  if ((heroAlt?.length ?? 0) > 500 || (heroTitle?.length ?? 0) > 200) {
    return { success: false, error: "Use at most 500 characters for alt text and 200 for the image title." };
  }
  return { success: true, data: { heroSrc, heroAlt: heroSrc ? heroAlt : null, heroTitle: heroSrc ? heroTitle : null } };
}
