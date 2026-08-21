import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@marketing/lib/appUrls'
import { SITE_URL } from '@marketing/lib/siteUrl'

/** Canonical origin without trailing slash. */
export const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')

/**
 * Shared Schema.org @id anchors — use these refs everywhere so entities
 * resolve to one consistent Organization / Brand / WebSite / SoftwareApplication.
 */
export const SCHEMA_IDS = {
  organization: `${SITE_ORIGIN}/#organization`,
  brand: `${SITE_ORIGIN}/#brand`,
  website: `${SITE_ORIGIN}/#website`,
  software: `${SITE_ORIGIN}/#software`,
  logo: `${SITE_ORIGIN}/#logo`,
}

export const organizationRef = () => ({ '@id': SCHEMA_IDS.organization })
export const brandRef = () => ({ '@id': SCHEMA_IDS.brand })
export const websiteRef = () => ({ '@id': SCHEMA_IDS.website })
export const softwareRef = () => ({ '@id': SCHEMA_IDS.software })
export const logoRef = () => ({ '@id': SCHEMA_IDS.logo })

const LOGO_URL = `${SITE_ORIGIN}/logo.png`

const SOFTWARE_DESCRIPTION =
  'AI-powered lesson planning platform that creates curriculum-aligned lesson plans, presentations, classroom activities and assessments for teachers.'

/** Legal publisher: Qismat Ventures W.L.L.; trade name: Skyen Solutions. */
export function buildOrganizationNode() {
  return {
    '@type': 'Organization',
    '@id': SCHEMA_IDS.organization,
    name: 'Qismat Ventures W.L.L.',
    alternateName: 'Skyen Solutions',
    url: `${SITE_ORIGIN}/`,
    email: 'support@makemylesson.ai',
    logo: {
      '@type': 'ImageObject',
      '@id': SCHEMA_IDS.logo,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 512,
      height: 512,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office 501, Building 1025, Road 3621, Block 436',
      addressLocality: 'Al Seef',
      addressCountry: 'BH',
    },
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'Bahrain Commercial Registration',
      value: '190698-1',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@makemylesson.ai',
    },
    brand: brandRef(),
  }
}

/** Product brand: Make My Lesson. */
export function buildBrandNode() {
  return {
    '@type': 'Brand',
    '@id': SCHEMA_IDS.brand,
    name: 'Make My Lesson',
    url: `${SITE_ORIGIN}/`,
    logo: logoRef(),
  }
}

export function buildWebsiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    name: 'Make My Lesson',
    url: `${SITE_ORIGIN}/`,
    inLanguage: 'en',
    publisher: organizationRef(),
    about: softwareRef(),
  }
}

export function buildSoftwareNode() {
  return {
    '@type': 'SoftwareApplication',
    '@id': SCHEMA_IDS.software,
    name: 'Make My Lesson',
    url: `${SITE_ORIGIN}/`,
    description: SOFTWARE_DESCRIPTION,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    brand: brandRef(),
    publisher: organizationRef(),
    offers: {
      '@type': 'Offer',
      '@id': `${SITE_ORIGIN}/#offer-free`,
      name: 'Free plan',
      price: '0',
      priceCurrency: 'USD',
      url: `${SITE_ORIGIN}/pricing`,
      description: 'Five free generation credits on signup.',
    },
    installUrl: [GOOGLE_PLAY_URL, APP_STORE_URL],
  }
}

/**
 * Core entity graph for every marketing page.
 * Pages should reference these nodes by @id instead of redefining them.
 */
export function buildCoreOrganizationGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(),
      buildBrandNode(),
      buildWebsiteNode(),
      buildSoftwareNode(),
    ],
  }
}
