export const SITE_URL = "https://www.veilcode.studio";
export const SITE_NAME = "VeilCode";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function canonicalPath(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath === "/" ? "/" : normalizedPath.replace(/\/+$/, "");
}
