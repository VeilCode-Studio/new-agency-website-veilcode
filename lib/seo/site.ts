export const SITE_URL = "https://www.veilcode.studio";
export const SITE_NAME = "VeilCode Studio";
export const FOUNDER_NAME = "Tamale Junior Frank";

// Suffix the root title template appends. Page titles that already contain
// the brand are emitted as absolute titles so it is never doubled.
export const TITLE_SUFFIX = " | VeilCode";

export const SITE_DESCRIPTION =
  "VeilCode Studio builds web platforms, mobile apps and AI automation. Founder-led studio in Kampala working with clients worldwide.";

// Site-wide share image, used by the root layout and pages without their own.
export const DEFAULT_OG_IMAGE = "/assets/nexus-project/image-client-1.jpg";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function canonicalPath(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath === "/" ? "/" : normalizedPath.replace(/\/+$/, "");
}

/**
 * The one absolute URL for a page. Canonical tags, og:url and the sitemap all
 * use this, so they always match exactly. The homepage is the bare origin
 * with no trailing slash, which is how Next.js renders it in <link> and <meta>.
 */
export function pageUrl(path = "/") {
  const canonical = canonicalPath(path);
  return canonical === "/" ? SITE_URL : absoluteUrl(canonical);
}
