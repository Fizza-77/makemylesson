import Link from 'next/link'
import { PageShell } from '@marketing/components/layout/Container'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { notFound } from 'next/navigation'
import { getBlogBySlugForMakeMyLesson } from '@marketing/lib/blogs'
import { buildBlogFaqJsonLd } from '@marketing/lib/blogFaqSchema'
import { buildBlogPostingJsonLd, buildBreadcrumbSchema } from '@marketing/lib/blogJsonLd'
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_URL,
} from '@marketing/lib/siteUrl'

async function loadPost(slug) {
  const blog = await getBlogBySlugForMakeMyLesson(slug)
  if (!blog) return null
  return { blog }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  if (!slug) return { title: 'Blog Post' }

  const result = await loadPost(slug)
  if (!result) return { title: 'Blog Post' }

  const { blog } = result
  const title = blog.meta_title || blog.title
  const description =
    blog.meta_description ||
    blog.description ||
    'A Make My Lesson article for teachers — lesson planning, curriculum, and product updates.'

  const canonical = `${SITE_URL}/blog/${blog.slug}`
  const ogImage = blog.cover_image_url
    ? [{ url: blog.cover_image_url, alt: blog.title }]
    : [
        {
          url: DEFAULT_OG_IMAGE_PATH,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ]

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      siteName: 'Make My Lesson',
      locale: 'en_US',
      publishedTime: blog.display_date ? new Date(blog.display_date).toISOString() : undefined,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage.map((i) => i.url),
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  if (!slug) notFound()

  const result = await loadPost(slug)
  if (!result) {
    if (slug !== 'coming-soon') notFound()
    const breadcrumbSchema = buildBreadcrumbSchema('Coming soon', '/blog/coming-soon')
    return (
      <>
        <MarketingPageJsonLd data={breadcrumbSchema} />
        <PageShell
          variant="blogArticle"
          className="!bg-white border-t-transparent text-[#1A1E3A]"
          contentClassName="pb-24 !pt-2"
        >
          <header className="blog-article-header text-center">
            <p className="blog-article-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" aria-hidden />
              Blog
            </p>
            <h1 className="blog-article-title">Coming Soon</h1>
            <p className="blog-article-deck">
              New articles will appear here once they are published in Supabase for this site.
            </p>
          </header>
          <div className="blog-article-card">
            <p className="text-[15px] text-[#1A1E3A]/75">
              We&apos;re working on new content. Check back soon.
            </p>
            <p className="mt-4">
              <Link
                href="/blog"
                className="text-[14px] font-bold text-[#35BEBC] hover:text-[#1A1E3A]"
              >
                View All Articles
              </Link>
            </p>
          </div>
        </PageShell>
      </>
    )
  }

  const { blog } = result
  const canonical = `${SITE_URL}/blog/${blog.slug}`
  const jsonLd = buildBlogPostingJsonLd(blog)
  const breadcrumbSchema = buildBreadcrumbSchema(blog.title, `/blog/${blog.slug}`)
  const faqJsonLd = buildBlogFaqJsonLd(blog.faq_schema, canonical)

  return (
    <>
      <MarketingPageJsonLd data={[breadcrumbSchema, jsonLd, faqJsonLd].filter(Boolean)} />
      <PageShell
        variant="blogArticle"
        className="!bg-white border-t-transparent text-[#1A1E3A]"
        contentClassName="pb-24 pt-4 sm:pt-6"
      >
        <header className="blog-article-header">
          <p className="blog-article-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" aria-hidden />
            {blog.category?.name ? `Blog · ${blog.category.name}` : 'Blog'}
          </p>
          <h1 className="blog-article-title">{blog.title}</h1>
          {blog.display_date && (
            <p className="blog-article-meta">
              {new Date(blog.display_date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {blog.author_name ? ` · ${blog.author_name}` : ''}
            </p>
          )}
          {(blog.description || blog.meta_description) && (
            <p className="blog-article-deck">{blog.description || blog.meta_description}</p>
          )}
        </header>

        <article className="blog-article-card">
          {blog.cover_image_url && (
            <div className="mb-8 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.cover_image_url}
                alt={blog.title || 'Blog article cover image'}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
          {blog.category && (
            <p className="mb-6 inline-flex items-center rounded-full border border-[#35BEBC]/35 bg-[#EAF5F6] px-2.5 py-1 text-[11px] font-semibold text-[#1A1E3A]">
              {blog.category.name}
            </p>
          )}
          {blog.content ? (
            <div className="blog-html" dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <p className="text-[13px] text-[#1A1E3A]/55">
              Content for this article has not been added yet.
            </p>
          )}
          <nav className="mt-10 border-t border-[#1A1E3A]/10 pt-8" aria-label="Related pages">
            <Link
              href="/blog"
              className="text-[14px] font-bold text-[#35BEBC] hover:text-[#1A1E3A]"
            >
              ← All Articles
            </Link>
          </nav>
        </article>
      </PageShell>
    </>
  )
}
