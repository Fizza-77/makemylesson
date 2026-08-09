import Link from 'next/link'
import Container, { PageShell } from '@marketing/components/layout/Container'
import { getBlogIndexDataForMakeMyLesson } from '@marketing/lib/blogs'
import { buildBreadcrumbSchema } from '@marketing/lib/blogJsonLd'
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_URL,
} from '@marketing/lib/siteUrl'

export async function generateMetadata() {
  let indexData
  try {
    indexData = await getBlogIndexDataForMakeMyLesson()
  } catch {
    indexData = { seo: null }
  }
  const seo = indexData?.seo
  const title = seo?.title || 'Blog — Make My Lesson'
  const description =
    seo?.description ||
    'Teaching ideas, lesson planning tips, and product updates from Make My Lesson — AI lesson planner for teachers.'

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog`,
      siteName: 'Make My Lesson',
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE_PATH,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE_PATH,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ],
    },
  }
}

function categoryPillClass(active) {
  return active
    ? 'border-mml-teal text-mml-teal'
    : 'border-white/20 text-white/80 hover:border-white/40 hover:text-white'
}

export default async function BlogPage({ searchParams }) {
  let indexData
  try {
    indexData = await getBlogIndexDataForMakeMyLesson()
  } catch {
    indexData = {
      site_id: '',
      seo: {
        title: 'Blog — Make My Lesson',
        description: '',
        headline: 'Make My Lesson Blog',
        subheadline: 'Teaching ideas and product updates.',
        empty_state_message: 'Blog posts will appear here once they are published.',
      },
      categories: [],
      posts: [],
    }
  }

  const { posts, categories, seo } = indexData
  const breadcrumbSchema = buildBreadcrumbSchema('Blog', '/blog')

  const activeCategory = searchParams?.category?.trim() || ''
  const hasActiveCategory = categories.some((cat) => cat.slug === activeCategory)
  const visiblePosts = hasActiveCategory
    ? posts.filter((post) => post.category?.slug === activeCategory)
    : posts

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <PageShell contentClassName="pb-24">
        <header className="border-b border-white/10 pb-10 text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[2px] text-mml-teal">Blog</p>
          <h1 className="mt-3 font-display text-[clamp(24px,4vw,36px)] font-normal text-white">{seo.headline}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-white/85">{seo.subheadline}</p>
        </header>

        <Container variant="wide" className="mt-10">
          {categories.length > 0 && (
            <nav
              aria-label="Filter posts by category"
              className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
            >
              <Link
                href="/blog"
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${categoryPillClass(!hasActiveCategory)}`}
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog?category=${encodeURIComponent(category.slug)}`}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${categoryPillClass(activeCategory === category.slug)}`}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          )}

          <section aria-label="Blog articles" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.length === 0 ? (
              <p className="text-center text-[14px] text-white/70 md:col-span-2 lg:col-span-3">{seo.empty_state_message}</p>
            ) : (
              visiblePosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  aria-label={`Read article: ${post.title}`}
                  className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm transition-all duration-200 hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mml-teal"
                >
                  {post.cover_image_url && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image_url}
                        alt=""
                        className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <div>
                    {post.category && (
                      <p className="mb-3 inline-flex items-center rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">
                        {post.category.name}
                      </p>
                    )}
                    <h2 className="mb-2 font-display text-[18px] font-normal leading-snug text-white group-hover:text-mml-teal">
                      {post.title}
                    </h2>
                    <p className="mb-4 text-[13px] leading-relaxed text-white/75">
                      {post.description || 'Read the full article to learn more.'}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-[13px] font-semibold text-mml-teal underline-offset-2 transition-colors group-hover:text-white group-hover:underline">
                    Read More
                    <span className="ml-1 text-[14px]" aria-hidden>
                      →
                    </span>
                  </span>
                </Link>
              ))
            )}
          </section>
        </Container>
      </PageShell>
    </>
  )
}
