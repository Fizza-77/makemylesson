/**
 * Shared Supabase schema (same pattern as Studiely / admin dashboard):
 *
 * sites
 *   - id (uuid, PK)
 *   - site_key (text, unique) — matches SITE_KEY
 *   - blog_page_meta_title, blog_page_meta_description, blog_page_headline,
 *     blog_page_subheadline, blog_empty_state_message (optional blog index copy)
 *
 * blogs
 *   - id (uuid, PK)
 *   - site_id (uuid, FK → sites.id)
 *   - category_id (optional, FK → blog_categories.id)
 *   - slug, title, description, content
 *   - meta_title, meta_description, cover_image_url, display_date
 *   - author_name, keywords, article_section
 *
 * Override with SUPABASE_BLOG_POSTS_TABLE only if your table name differs.
 */

export const DEFAULT_SITES_TABLE = "sites";
/** Default matches Studiely: `blogs`, not `blog_posts`. */
export const DEFAULT_BLOG_POSTS_TABLE = "blogs";
/** Site-scoped blog categories. Filter with `site_id` for public sites. */
export const DEFAULT_BLOG_CATEGORIES_TABLE = "blog_categories";
