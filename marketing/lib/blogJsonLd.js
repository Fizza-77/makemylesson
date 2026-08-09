import { DEFAULT_OG_IMAGE_PATH, SITE_URL } from '@marketing/lib/siteUrl'

export function buildBlogPostingJsonLd(blog) {
  const url = `${SITE_URL}/blog/${blog.slug}`
  const headline = blog.meta_title?.trim() || blog.title
  const description =
    blog.meta_description?.trim() || blog.description?.trim() || undefined

  const image = blog.cover_image_url?.trim() || `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  if (description) jsonLd.description = description

  if (blog.display_date) {
    jsonLd.datePublished = new Date(blog.display_date).toISOString()
  }

  if (image) jsonLd.image = image

  const kw = blog.keywords?.trim()
  if (kw) jsonLd.keywords = kw

  const section = blog.article_section?.trim()
  if (section) jsonLd.articleSection = section

  const author = blog.author_name?.trim()
  if (author) {
    jsonLd.author = {
      '@type': 'Person',
      name: author,
    }
  }

  return jsonLd
}

export function buildBreadcrumbSchema(currentName, currentPath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: currentName,
        item: `${SITE_URL}${currentPath}`,
      },
    ],
  }
}
