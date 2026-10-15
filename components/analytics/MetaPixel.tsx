import { getMetaPixelId } from "@/lib/analytics/meta-pixel";
import { MetaPixelClient } from "./MetaPixelClient";

export function MetaPixel() {
  const id = getMetaPixelId(
    process.env.NEXT_PUBLIC_ENABLE_META_PIXEL,
    process.env.NEXT_PUBLIC_META_PIXEL_ID,
  );
  return id ? <MetaPixelClient pixelId={id} /> : null;
}
