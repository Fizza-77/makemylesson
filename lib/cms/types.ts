/**
 * List/detail shapes align with Supabase `blogs` table (Studiely-compatible).
 */

export type SiteResolveResponse = {
  site_id?: string;
  id?: string;
};

export type BlogCategorySummary = {
  id: string;
  name: string;
  slug: string | null;
};

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  /** Direct URL from Supabase `blogs.cover_image_url` */
  cover_image_url?: string | null;
  /** Mapped from `display_date` (Supabase) or legacy APIs */
  published_at?: string | null;
  publishedAt?: string | null;
  /** FK to `blog_categories` when present */
  category_id?: string | null;
  category?: BlogCategorySummary | null;
};

/** Blog index page copy from `sites` (admin-managed). */
export type BlogPageCopy = {
  meta_title: string | null;
  meta_description: string | null;
  headline: string | null;
  subheadline: string | null;
  empty_state_message: string | null;
};

/** Shared category row (same table for all tenants). */
export type BlogCategory = {
  id: string;
  name: string;
  slug: string | null;
  sort_order: number | null;
};

export type BlogIndexPageData = {
  siteId: string | null;
  copy: BlogPageCopy | null;
  categories: BlogCategory[];
  posts: BlogPostListItem[];
};

export type BlogPostsListResponse = {
  posts?: BlogPostListItem[];
  data?: BlogPostListItem[];
};

export type BlogPostDetail = BlogPostListItem & {
  /** Primary HTML body from Supabase `blogs.content` */
  content?: string | null;
  content_html?: string | null;
  contentHtml?: string | null;
  body?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  description?: string | null;
};

export type BlogPostDetailResponse = {
  post?: BlogPostDetail;
  data?: BlogPostDetail;
};
