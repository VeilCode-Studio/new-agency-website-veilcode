/**
 * Bound the source downloaded by next/image before its responsive resize.
 * CMS originals stay untouched; local, signed and pre-transformed URLs pass through.
 * This avoids fetching multi-megabyte PNG originals for small public previews.
 */
export function publicImageSource(src: string): string {
  try {
    const url = new URL(src);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "res.cloudinary.com" ||
      url.search ||
      !/^\/[^/]+\/image\/upload\/v\d+\//.test(url.pathname)
    )
      return src;
    url.pathname = url.pathname.replace(
      "/image/upload/",
      "/image/upload/f_auto,q_auto:good,c_limit,w_2400/",
    );
    return url.toString();
  } catch {
    return src;
  }
}
