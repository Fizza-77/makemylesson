/**
 * Connected marketing site — public blog fetch pattern.
 *
 * Each deployment is its own repo with the same Supabase project as the admin.
 * Set `SITE_KEY` to the row’s `sites.site_key`, or set `SITE_ID` / `NEXT_PUBLIC_SITE_ID`
 * to that row’s UUID to skip the `sites` lookup.
 *
 * For a new project you can copy `lib/cms/` (or this barrel) and wire
 * `getBlogIndexPageData` to your `/blog` route, and `getBlogPostBySlug` + `getSiteId`
 * to `/blog/[slug]`.
 *
 * @see docs/site-key-integration.md
 */
export {
  getBlogIndexPageData,
  getBlogPosts,
  getBlogsForSite,
  getBlogPostBySlug,
  getBlogBySlugForSite,
  getBlogPageCopyForSite,
  getBlogCategories,
  getSiteId,
  getSiteIdByKey,
} from "@/lib/cms";

export type {
  BlogIndexPageData,
  BlogPageCopy,
  BlogCategory,
  BlogCategorySummary,
  BlogPostListItem,
  BlogPostDetail,
} from "@/lib/cms";
