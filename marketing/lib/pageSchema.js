import {
  SITE_ORIGIN,
  organizationRef,
  softwareRef,
  websiteRef,
} from '@marketing/lib/organizationSchema'

/**
 * @param {{ name: string, path: string }[]} crumbs
 *   `path` is an absolute site path, e.g. `/` or `/pricing`
 */
export function buildBreadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${crumb.path}`,
    })),
  }
}

/**
 * Page-level WebPage schema. Does NOT redefine Organization / Brand / WebSite /
 * SoftwareApplication — those live in the shared core graph via @id refs.
 *
 * @param {{
 *   name: string,
 *   description: string,
 *   path: string,
 *   type?: string,
 *   aboutSoftware?: boolean,
 *   mainEntityOrganization?: boolean,
 * }} opts
 */
export function buildWebPageSchema({
  name,
  description,
  path,
  type = 'WebPage',
  aboutSoftware = false,
  mainEntityOrganization = false,
}) {
  const url = `${SITE_ORIGIN}${path}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    name,
    description,
    url,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
  }

  if (aboutSoftware) {
    schema.about = softwareRef()
  }

  if (mainEntityOrganization) {
    schema.mainEntity = organizationRef()
  }

  return schema
}

/** Convenience: breadcrumb + webpage as a JSON-LD array (no duplicated entities). */
export function buildPageJsonLd({
  name,
  description,
  path,
  crumbs,
  type,
  aboutSoftware,
  mainEntityOrganization,
}) {
  const breadcrumb = buildBreadcrumbSchema(
    crumbs ?? [
      { name: 'Home', path: '/' },
      { name, path },
    ],
  )
  const webpage = buildWebPageSchema({
    name,
    description,
    path,
    type,
    aboutSoftware,
    mainEntityOrganization,
  })
  return [breadcrumb, webpage]
}
