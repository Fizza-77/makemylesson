/** Canonical site origin for metadata (Open Graph, etc.). Override with NEXT_PUBLIC_SITE_URL in env. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://makemylesson.ai'

/** Default OG / Twitter card image (`public/publicog-img.jpg`). */
export const DEFAULT_OG_IMAGE_PATH = '/publicog-img.jpg'
export const DEFAULT_OG_IMAGE_WIDTH = 2250
export const DEFAULT_OG_IMAGE_HEIGHT = 1181
export const DEFAULT_OG_IMAGE_ALT =
  'Make My Lesson — AI Lesson Planner. Generate complete teaching packs in minutes. 71 curriculum routes.'
