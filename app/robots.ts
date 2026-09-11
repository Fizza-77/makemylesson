import type { MetadataRoute } from "next";

import { APP_ORIGIN } from "@/lib/urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/signup",
        "/forgot-password",
        "/verify-email",
        "/reset-password",
        "/complete-profile",
        "/auth/",
        "/library",
        "/stage1",
        "/stage2",
        "/stage3",
        "/stage4",
        "/lesson/",
        "/profile",
        "/notifications",
        "/organization-dashboard",
        "/home",
      ],
    },
    sitemap: `${APP_ORIGIN}/sitemap.xml`,
  };
}


