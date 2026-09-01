import { getFeaturePath } from '@marketing/data/features'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@marketing/lib/appUrls'

export const FOOTER_TEAL = '#159F9B'

export const FOOTER_SITEMAP_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/features/lesson-plan-generator', label: 'Features' },
  { href: '/teaching-methods', label: 'Teaching Methods' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: getFeaturePath('lesson-plan-generator'), label: 'Teaching Pack' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
]

export const FOOTER_LEGAL_DOCS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/acceptable-use-policy', label: 'Acceptable Use Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/refund-payments-policy', label: 'Refund & Payments Policy' },
  { href: '/account-data-deletion', label: 'Account & Data Deletion' },
]

export const FOOTER_SOCIAL_LINKS = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/showcase/makemylesson/',
    label: 'LinkedIn',
  },
  {
    key: 'youtube',
    href: 'https://www.youtube.com/@MakeMyLesson',
    label: 'YouTube',
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/makemylesson',
    label: 'Instagram',
  },
  {
    key: 'facebook',
    href: 'https://www.facebook.com/MakeMyLesson',
    label: 'Facebook',
  },
]

export const FOOTER_SISTER_LINKS = [
  { href: 'https://studiely.com', label: 'Studiely' },
  { href: 'https://linguatude.com', label: 'Linguatude' },
  { href: 'https://worksheeta.com', label: 'Worksheeta' },
]

export { APP_STORE_URL, GOOGLE_PLAY_URL }
