import { cache } from "react";
import type { SiteResolveResponse } from "./types";
import { getCmsEnv, isSupabaseConfigured } from "./config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Resolve `sites.id` for `site_key` without throwing (0 rows, RLS deny, or PostgREST error → `null`).
 * Prefer this for {@link getSiteId}; use {@link getSiteIdByKey} when a missing site must fail fast.
 */
async function fetchSiteIdByKey(siteKey: string): Promise<string | null> {
  const env = getCmsEnv();
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  const { data: site, error } = await supabase
    .from(env.sitesTable)
    .select("id")
    .eq("site_key", siteKey)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[cms] sites lookup failed:", error.message);
    }
    return null;
  }
  if (!site?.id) {
    return null;
  }
  return String(site.id);
}

/**
 * Resolve `sites.id` for a fixed `site_key` (stable id per website app — not domain).
 * Throws if no row, RLS blocks the read, or Supabase is misconfigured.
 *
 * Call from server code only. Pair with React `cache()` or build-time memoization
 * so you don’t hit `sites` on every request unnecessarily.
 */
export async function getSiteIdByKey(siteKey: string): Promise<string> {
  const env = getCmsEnv();
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase URL and anon key are required for getSiteIdByKey");
  }

  const id = await fetchSiteIdByKey(siteKey);
  if (!id) {
    throw new Error(`Site not found for key: ${siteKey}`);
  }
  return id;
}

/**
 * Cached `site_id` for the current app using `SITE_KEY` / `NEXT_PUBLIC_SITE_KEY`.
 * Returns `null` on failure so pages can show setup hints (does not throw).
 */
export const getSiteId = cache(async (): Promise<string | null> => {
  const env = getCmsEnv();

  if (isSupabaseConfigured() && env.siteId?.trim()) {
    return env.siteId.trim();
  }

  if (isSupabaseConfigured() && env.siteKey) {
    const id = await fetchSiteIdByKey(env.siteKey);
    if (!id && process.env.NODE_ENV === "development") {
      console.warn(
        `[cms] No site row for site_key="${env.siteKey}". Add it in Supabase sites.site_key or fix SITE_KEY.`,
      );
    }
    return id;
  }

  const { baseUrl, apiKey, siteKey } = env;
  if (!baseUrl || !siteKey) {
    return null;
  }

  const url = new URL(`${baseUrl}/api/public/v1/sites/resolve`);
  url.searchParams.set("site_key", siteKey);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as SiteResolveResponse;
    return data.site_id ?? data.id ?? null;
  } catch {
    return null;
  }
});
