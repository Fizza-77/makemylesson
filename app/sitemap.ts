import type { MetadataRoute } from "next";

import { APP_ORIGIN, ROUTES } from "@/lib/urls";

/** Public marketing URLs only — never login, signup, library, or stages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_ORIGIN;
  const paths = ["/", ROUTES.pricing] as const;
  return paths.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" || path === ROUTES.pricing ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === ROUTES.pricing ? 0.9 : 0.6,
  }));
}
