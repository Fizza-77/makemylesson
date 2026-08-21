import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_URL,
} from '@marketing/lib/siteUrl'
import {
  organizationRef,
  websiteRef,
} from '@marketing/lib/organizationSchema'

const ORIGIN = SITE_URL.replace(/\/$/, '')

export function buildBlogPostingJsonLd(blog) {
  const url = `${ORIGIN}/blog/${blog.slug}`
  const headline = blog.meta_title?.trim() || blog.title
  const description =
    blog.meta_description?.trim() || blog.description?.trim() || undefined

  const imageUrl = blog.cover_image_url?.trim() || `${ORIGIN}${DEFAULT_OG_IMAGE_PATH}`
  const imageObject = {
    '@type': 'ImageObject',
    '@id': `${url}#image`,
    url: imageUrl,
    contentUrl: imageUrl,
  }
  if (!blog.cover_image_url?.trim()) {
    imageObject.width = DEFAULT_OG_IMAGE_WIDTH
    imageObject.height = DEFAULT_OG_IMAGE_HEIGHT
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
    },
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    image: imageObject,
  }

  if (description) jsonLd.description = description

  if (blog.display_date) {
    jsonLd.datePublished = new Date(blog.display_date).toISOString()
  }

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
  } else {
    jsonLd.author = organizationRef()
  }

  return jsonLd
}

/** Home → Blog (hub) or Home → Blog → article. */
export function buildBreadcrumbSchema(currentName, currentPath) {
  const crumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${ORIGIN}/`,
    },
  ]

  const isHub = currentPath === '/blog'
  if (!isHub) {
    crumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${ORIGIN}/blog`,
    })
    crumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: currentName,
      item: `${ORIGIN}${currentPath}`,
    })
  } else {
    crumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: currentName,
      item: `${ORIGIN}${currentPath}`,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs,
  }
}

/**
 * Blog hub: Blog + ItemList (BreadcrumbList built separately).
 * @param {{ slug: string, title: string, description?: string }[]} posts
 */
export function buildBlogHubJsonLd(posts = []) {
  const blogUrl = `${ORIGIN}/blog`
  const listId = `${blogUrl}#itemlist`

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': listId,
    name: 'Make My Lesson Blog',
    url: blogUrl,
    numberOfItems: posts.length,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    itemListElement: posts.map((post, index) => {
      const itemUrl = `${ORIGIN}/blog/${post.slug}`
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: post.title,
        url: itemUrl,
        item: itemUrl,
      }
    }),
  }

  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${blogUrl}#blog`,
    name: 'Make My Lesson Blog',
    description:
      'Practical guides for teachers on lesson planning, teaching methods, classroom activities, assessment, education technology and workload.',
    url: blogUrl,
    inLanguage: 'en',
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    mainEntity: { '@id': listId },
  }

  return [blog, itemList]
}
