import { cache } from "react";
import type {
  BlogCategory,
  BlogCategorySummary,
  BlogIndexPageData,
  BlogPageCopy,
  BlogPostDetail,
  BlogPostListItem,
  BlogPostDetailResponse,
  BlogPostsListResponse,
} from "./types";
import { getCmsEnv, isSupabaseConfigured } from "./config";
import { getSiteId } from "./site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Columns needed for list cards + SEO (narrow from `select('*')`). */
const BLOG_SEO_FIELDS =
  "slug, title, description, meta_title, meta_description, cover_image_url, display_date, author_name, keywords, article_section, category_id";

const CATEGORY_SUMMARY_SELECT = "id, name, slug";

const BLOG_LIST_SELECT = `id, ${BLOG_SEO_FIELDS}, category:blog_categories (${CATEGORY_SUMMARY_SELECT})`;
const BLOG_DETAIL_SELECT = `id, content, ${BLOG_SEO_FIELDS}, category:blog_categories (${CATEGORY_SUMMARY_SELECT})`;

const SITE_BLOG_INDEX_SELECT =
  "blog_page_meta_title, blog_page_meta_description, blog_page_headline, blog_page_subheadline, blog_empty_state_message";

const CATEGORY_SELECT = "id, name, slug, sort_order";

function mapCategorySummary(value: unknown): BlogCategorySummary | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;
  const id = row.id != null ? String(row.id) : "";
  const name = String(row.name ?? "");

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    slug: (row.slug as string | null | undefined) ?? null,
  };
}

function getJoinedCategory(row: Record<string, unknown>): BlogCategorySummary | null {
  return mapCategorySummary(row.category ?? row.blog_categories ?? null);
}

function mapSupabaseListRow(row: Record<string, unknown>): BlogPostListItem {
  const id = row.id != null ? String(row.id) : String(row.slug ?? "");
  const cat = row.category_id;
  return {
    id,
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: (row.description as string | null | undefined) ?? null,
    cover_image_url: (row.cover_image_url as string | null | undefined)?.trim() || null,
    published_at: (row.display_date as string | null | undefined) ?? null,
    publishedAt: null,
    category_id: cat != null ? String(cat) : null,
    category: getJoinedCategory(row),
  };
}

function mapSupabaseDetailRow(row: Record<string, unknown>): BlogPostDetail {
  const base = mapSupabaseListRow(row);
  const content = (row.content as string | null | undefined) ?? null;
  return {
    ...base,
    content,
    content_html: content,
    description: (row.description as string | null | undefined) ?? null,
    meta_title: (row.meta_title as string | null | undefined) ?? null,
    meta_description: (row.meta_description as string | null | undefined) ?? null,
  };
}

function mapRowToListItem(row: Record<string, unknown>): BlogPostListItem {
  return {
    id: String(row.id ?? row.slug ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: (row.excerpt as string | null | undefined) ?? (row.description as string | null | undefined) ?? null,
    cover_image_url: (row.cover_image_url as string | null | undefined)?.trim() || null,
    published_at: (row.published_at as string | null | undefined) ?? (row.display_date as string | null | undefined) ?? null,
    publishedAt: (row.publishedAt as string | null | undefined) ?? null,
    category_id: (row.category_id as string | null | undefined) ?? null,
    category: getJoinedCategory(row),
  };
}

function mapRowToDetail(row: Record<string, unknown>): BlogPostDetail {
  const base = mapRowToListItem(row);
  return {
    ...base,
    content:
      (row.content as string | null | undefined) ??
      (row.content_html as string | null | undefined) ??
      (row.contentHtml as string | null | undefined) ??
      null,
    content_html:
      (row.content_html as string | null | undefined) ??
      (row.contentHtml as string | null | undefined) ??
      (row.content as string | null | undefined) ??
      null,
    contentHtml: (row.contentHtml as string | null | undefined) ?? null,
    body: (row.body as string | null | undefined) ?? null,
    meta_title: (row.meta_title as string | null | undefined) ?? null,
    meta_description: (row.meta_description as string | null | undefined) ?? null,
    description: (row.description as string | null | undefined) ?? null,
  };
}

/**
 * Load all blogs for a resolved `site_id` from Supabase.
 * Throws on PostgREST error — callers that need a soft UI should catch.
 */
export async function getBlogsForSite(siteId: string, categoryId?: string | null): Promise<BlogPostListItem[]> {
  const env = getCmsEnv();
  if (!isSupabaseConfigured()) {
    throw new Error(
      "getBlogsForSite requires Supabase (NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, and SITE_KEY or SITE_ID)",
    );
  }

  const supabase = createSupabaseServerClient();
  let query = supabase
    .from(env.postsTable)
    .select(BLOG_LIST_SELECT)
    .eq("site_id", siteId)
    .order("display_date", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((row) => mapSupabaseListRow(row));
}

/**
 * Load one blog by slug for a `site_id`. Returns `null` if not found; throws on query error.
 */
export async function getBlogBySlugForSite(siteId: string, slug: string): Promise<BlogPostDetail | null> {
  const env = getCmsEnv();
  if (!isSupabaseConfigured()) {
    throw new Error("getBlogBySlugForSite requires Supabase");
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(env.postsTable)
    .select(BLOG_DETAIL_SELECT)
    .eq("site_id", siteId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }
  return mapSupabaseDetailRow(data as Record<string, unknown>);
}

/**
 * List posts for a resolved `site_id` — Supabase via {@link getBlogsForSite}, or legacy REST.
 * Never throws; returns `[]` on failure so pages can degrade gracefully.
 */
export async function getBlogPosts(siteId: string, categoryId?: string | null): Promise<BlogPostListItem[]> {
  if (isSupabaseConfigured()) {
    try {
      return await getBlogsForSite(siteId, categoryId);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[cms] getBlogPosts:", e);
      }
      return [];
    }
  }

  const { baseUrl, apiKey } = getCmsEnv();
  if (!baseUrl) {
    return [];
  }

  const url = `${baseUrl}/api/public/v1/sites/${encodeURIComponent(siteId)}/posts`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as BlogPostsListResponse;
    const list = json.posts ?? json.data ?? [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Single post by slug — Supabase via {@link getBlogBySlugForSite}, or legacy REST.
 */
export async function getBlogPostBySlug(siteId: string, slug: string): Promise<BlogPostDetail | null> {
  if (isSupabaseConfigured()) {
    try {
      return await getBlogBySlugForSite(siteId, slug);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[cms] getBlogPostBySlug:", e);
      }
      return null;
    }
  }

  const { baseUrl, apiKey } = getCmsEnv();
  if (!baseUrl) {
    return null;
  }

  const url = `${baseUrl}/api/public/v1/sites/${encodeURIComponent(siteId)}/posts/by-slug/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as BlogPostDetailResponse;
    const post = json.post ?? json.data ?? null;
    if (!post) {
      return null;
    }
    return mapRowToDetail(post as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

/**
 * Blog index copy for this tenant from `sites` (hero, meta, empty state).
 * Returns `null` if columns are missing, RLS blocks, or the query fails.
 */
export async function getBlogPageCopyForSite(siteId: string): Promise<BlogPageCopy | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const env = getCmsEnv();
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(env.sitesTable)
      .select(SITE_BLOG_INDEX_SELECT)
      .eq("id", siteId)
      .maybeSingle();

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[cms] blog page copy:", error.message);
      }
      return null;
    }
    if (!data) {
      return null;
    }
    const row = data as Record<string, unknown>;
    return {
      meta_title: (row.blog_page_meta_title as string | null | undefined)?.trim() || null,
      meta_description: (row.blog_page_meta_description as string | null | undefined)?.trim() || null,
      headline: (row.blog_page_headline as string | null | undefined)?.trim() || null,
      subheadline: (row.blog_page_subheadline as string | null | undefined)?.trim() || null,
      empty_state_message: (row.blog_empty_state_message as string | null | undefined)?.trim() || null,
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[cms] getBlogPageCopyForSite:", e);
    }
    return null;
  }
}

/**
 * Site-scoped category list. Labels on posts use `blogs.category_id` + this table.
 */
export async function getBlogCategories(siteId: string): Promise<BlogCategory[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const env = getCmsEnv();
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(env.blogCategoriesTable)
      .select(CATEGORY_SELECT)
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true });

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[cms] blog_categories:", error.message);
      }
      return [];
    }

    const rows = (data ?? []) as Record<string, unknown>[];
    return rows.map((row) => ({
      id: String(row.id ?? ""),
      name: String(row.name ?? ""),
      slug: (row.slug as string | null | undefined) ?? null,
      sort_order: typeof row.sort_order === "number" ? row.sort_order : null,
    }));
  } catch {
    return [];
  }
}

/**
 * One request for the blog index: resolved `site_id`, index copy, categories, and posts.
 * Wrapped in React `cache()` so `generateMetadata` and the page share one load per request.
 */
export const getBlogIndexPageData = cache(async (): Promise<BlogIndexPageData> => {
  const siteId = await getSiteId();
  if (!siteId) {
    return { siteId: null, copy: null, categories: [], posts: [] };
  }

  const [copy, categories, posts] = await Promise.all([
    getBlogPageCopyForSite(siteId),
    getBlogCategories(siteId),
    getBlogPosts(siteId),
  ]);

  return { siteId, copy, categories, posts };
});
