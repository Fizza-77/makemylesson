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
  const title = 'Lesson Planning Blog for Teachers | Make My Lesson'
  const description =
    'Explore practical guides for teachers on lesson planning, teaching methods, classroom activities, assessment, education technology and workload.'

  return {
    title: { absolute: title },
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
    ? 'border-[#35BEBC] bg-[#35BEBC] text-[#eaf8f7]'
    : 'border-[#35BEBC] bg-[#eaf8f7] text-[#35BEBC] hover:bg-[#d8f3ef] hover:text-[#1E9A98]'
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

  const params = await searchParams
  const rawCategory = params?.category
  const activeCategory = (
    Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
  )?.trim() || ''

  const activeCat = categories.find(
    (cat) =>
      cat.slug === activeCategory ||
      cat.slug?.toLowerCase() === activeCategory.toLowerCase() ||
      cat.name?.toLowerCase() === activeCategory.toLowerCase(),
  )
  const hasActiveCategory = Boolean(activeCat)
  const activeSlug = activeCat?.slug || activeCategory
  const activeName = activeCat?.name?.toLowerCase() || ''

  const visiblePosts = hasActiveCategory
    ? posts.filter((post) => {
        const slug = post.category?.slug
        const name = post.category?.name?.toLowerCase()
        return (
          slug === activeSlug ||
          slug?.toLowerCase() === activeSlug.toLowerCase() ||
          (activeName && name === activeName)
        )
      })
    : posts

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <PageShell
        className="!bg-white border-t-transparent text-[#1A1E3A]"
        contentClassName="pb-24 !pt-2"
      >
        <header className="relative overflow-hidden rounded-[28px] bg-[#aae4e3] px-5 py-10 text-center sm:rounded-[36px] sm:px-8 sm:py-12">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#35BEBC]/45"
            aria-hidden
          />
          <div className="relative z-[1]">
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" aria-hidden />
              Blog
            </p>
            <h1 className="font-[family-name:var(--font-manrope)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[#1A1E3A]">
              {seo.headline}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#1A1E3A]/75 sm:text-base">
              {seo.subheadline}
            </p>
          </div>
        </header>

        <Container variant="wide" className="mt-10 !px-0">
          {categories.length > 0 && (
            <nav
              aria-label="Filter posts by category"
              className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
            >
              <Link
                href="/blog"
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${categoryPillClass(!hasActiveCategory)}`}
              >
                All
              </Link>
              {categories.map((category) => {
                const isActive = activeCat?.slug === category.slug
                return (
                  <Link
                    key={category.id}
                    href={
                      isActive
                        ? '/blog'
                        : `/blog?category=${encodeURIComponent(category.slug)}`
                    }
                    className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${categoryPillClass(isActive)}`}
                    aria-pressed={isActive}
                  >
                    {category.name}
                  </Link>
                )
              })}
            </nav>
          )}

          <section
            aria-label="Blog articles"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {visiblePosts.length === 0 ? (
              <p className="text-center text-[14px] text-[#1A1E3A]/55 md:col-span-2 lg:col-span-3">
                {seo.empty_state_message}
              </p>
            ) : (
              visiblePosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  aria-label={`Read article: ${post.title}`}
                  className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#aae4e3] hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35BEBC]"
                >
                  <span
                    className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 translate-x-[40%] translate-y-[45%] rounded-full bg-[#eaf8f7] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden
                  />
                  {post.cover_image_url && (
                    <div className="relative z-[1] mb-4 overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image_url}
                        alt=""
                        className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <div className="relative z-[1]">
                    {post.category && (
                      <p className="mb-3 inline-flex items-center rounded-full border border-[#35BEBC]/35 bg-[#EAF5F6] px-2.5 py-1 text-[11px] font-semibold text-[#1A1E3A] transition-colors group-hover:border-[#1A1E3A]/20 group-hover:bg-white/70">
                        {post.category.name}
                      </p>
                    )}
                    <h2 className="mb-2 font-[family-name:var(--font-manrope)] text-[18px] font-bold leading-snug text-[#1A1E3A]">
                      {post.title}
                    </h2>
                    <p className="mb-4 text-[13px] leading-relaxed text-[#1A1E3A]/65 group-hover:text-[#1A1E3A]/80">
                      {post.description || 'Read the full article to learn more.'}
                    </p>
                  </div>
                  <span className="relative z-[1] inline-flex items-center text-[13px] font-bold text-[#35BEBC] transition-colors group-hover:text-[#1A1E3A]">
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
