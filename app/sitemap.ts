import type { MetadataRoute } from "next";

import { APP_ORIGIN, ROUTES } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_ORIGIN;
  const paths = [
    "/",
    ROUTES.pricing,
    ROUTES.signIn,
    ROUTES.signUp,
    ROUTES.library,
    ROUTES.stage1,
    ROUTES.stage2,
    ROUTES.stage3,
    ROUTES.stage4,
  ] as const;
  return paths.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" || path === ROUTES.pricing ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === ROUTES.pricing ? 0.9 : 0.6,
  }));
}
