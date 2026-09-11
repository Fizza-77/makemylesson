/**
 * Blog segment: always server-render on each request with live Supabase data.
 * CSS is imported per route (hub vs article) to avoid unused render-blocking sheets.
 */
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function BlogLayout({ children }) {
  return children
}


