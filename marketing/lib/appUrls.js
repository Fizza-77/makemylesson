/**
 * Web app entry points from marketing CTAs (same host as marketing).
 * Combined project: teacher PWA routes live at site root (not /app/*).
 */
export const MML_APP = {
  pricing: '/pricing',
  stage1: '/stage1',
  stage2: '/stage2',
  stage3: '/stage3',
  stage4: '/stage4',
  /** No dedicated Ayla screen — send into the app workspace. */
  ayla: '/stage1',
  signIn: '/login',
  signUp: '/signup',
}

export const APP_STORE_URL = 'https://apps.apple.com/app/id6762620632'

export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.skyensolutions.makemylesson.make_my_lesson'
