/** Canonical site URL for metadata, canonical links, and OG fallbacks. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://makemylesson.ai";

/** Path to default OG image (under /public). */
export const DEFAULT_OG_IMAGE_PATH = "/og-hero-banner.jpg";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = SITE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
