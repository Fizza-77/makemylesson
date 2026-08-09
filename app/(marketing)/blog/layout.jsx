/**
 * Blog segment: always server-render on each request with live Supabase data.
 * No static pages, no ISR, no default fetch cache for this subtree.
 */
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function BlogLayout({ children }) {
  return children
}
