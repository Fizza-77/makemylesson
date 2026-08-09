import {
  DEFAULT_BLOG_CATEGORIES_TABLE,
  DEFAULT_BLOG_POSTS_TABLE,
  DEFAULT_SITES_TABLE,
} from "@/lib/supabase/tables";

export type CmsEnv = {
  baseUrl: string | undefined;
  apiKey: string;
  /** From NEXT_PUBLIC_SITE_KEY or SITE_KEY */
  siteKey: string | undefined;
  /** Optional: `sites.id` UUID — skips reading `sites` by `site_key` */
  siteId: string | undefined;
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  sitesTable: string;
  postsTable: string;
  blogCategoriesTable: string;
};

export function getCmsEnv(): CmsEnv {
  return {
    baseUrl: process.env.CMS_API_BASE_URL?.replace(/\/$/, ""),
    apiKey: process.env.CMS_API_KEY ?? "",
    siteKey: process.env.NEXT_PUBLIC_SITE_KEY ?? process.env.SITE_KEY,
    siteId: process.env.NEXT_PUBLIC_SITE_ID ?? process.env.SITE_ID,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, ""),
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    sitesTable: process.env.SUPABASE_SITES_TABLE ?? DEFAULT_SITES_TABLE,
    postsTable: process.env.SUPABASE_BLOG_POSTS_TABLE ?? DEFAULT_BLOG_POSTS_TABLE,
    blogCategoriesTable: process.env.SUPABASE_BLOG_CATEGORIES_TABLE ?? DEFAULT_BLOG_CATEGORIES_TABLE,
  };
}

/** Supabase (URL + anon + site key or site id) or legacy REST (CMS_API_BASE_URL + site key). */
export function isCmsConfigured(): boolean {
  const e = getCmsEnv();
  const supabaseOk = Boolean(
    e.supabaseUrl && e.supabaseAnonKey && (e.siteKey || e.siteId?.trim()),
  );
  const restOk = Boolean(e.baseUrl && e.siteKey);
  return supabaseOk || restOk;
}

export function isSupabaseConfigured(): boolean {
  const e = getCmsEnv();
  return Boolean(e.supabaseUrl && e.supabaseAnonKey && (e.siteKey || e.siteId?.trim()));
}
