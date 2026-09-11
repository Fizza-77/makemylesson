import { APP_STORE_URL, GOOGLE_PLAY_URL, MML_APP } from '@marketing/lib/appUrls'
import { Reveal } from '../shared'

export const CTA_LINKS = {
  social: {
    facebook: 'https://www.facebook.com/MakeMyLesson',
    instagram: 'https://www.instagram.com/makemylesson',
    youtube: 'https://www.youtube.com/@MakeMyLesson',
    linkedin: 'https://www.linkedin.com/showcase/makemylesson/',
  },
  app: {
    appStore: APP_STORE_URL,
    googlePlay: GOOGLE_PLAY_URL,
  },
}

function SocialIcon({ className, children }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

function FacebookIcon({ className }) {
  return (
    <SocialIcon className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </SocialIcon>
  )
}

function InstagramIcon({ className }) {
  return (
    <SocialIcon className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </SocialIcon>
  )
}

function YoutubeIcon({ className }) {
  return (
    <SocialIcon className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </SocialIcon>
  )
}

function LinkedinIcon({ className }) {
  return (
    <SocialIcon className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </SocialIcon>
  )
}

function AppleIcon({ className }) {
  return (
    <svg className={className} width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function GooglePlayIcon({ className }) {
  return (
    <svg className={className} width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12 3.84 21.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.54.68.54 1.13s-.2.86-.54 1.13L17.69 15l-9.64-9.64L15.5 2.5" />
    </svg>
  )
}

const SOCIAL_ICONS = [
  { key: 'facebook', href: CTA_LINKS.social.facebook, label: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram', href: CTA_LINKS.social.instagram, label: 'Instagram', Icon: InstagramIcon },
  { key: 'youtube', href: CTA_LINKS.social.youtube, label: 'YouTube', Icon: YoutubeIcon },
  { key: 'linkedin', href: CTA_LINKS.social.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
]

export default function CtaBandSection() {
  return (
    <section className="final-cta">
      <div className="W final-cta-inner">
        <Reveal>
          <h2>Your Next Lesson. Ready in Minutes.</h2>
          <p className="final-cta-lead">
            Join teachers across Australia, the UK, Canada, and internationally who are spending less time preparing and
            more time teaching.
          </p>
          <a href={MML_APP.stage1} className="btn btn-teal btn-lg final-cta-btn final-cta-btn--primary">
            Build Your First Teaching Pack Free
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="final-cta-sub">10 free credits · No credit card required · Cancel anytime</p>

          <hr className="final-cta-rule" aria-hidden />

          <p className="final-cta-section-label">Follow Us</p>
          <div className="final-cta-socials">
            {SOCIAL_ICONS.map(({ key, href, label, Icon }) => (
              <a
                key={key}
                href={href}
                className="final-cta-social-link"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="final-cta-social-ico" aria-hidden />
              </a>
            ))}
          </div>

          <hr className="final-cta-rule" aria-hidden />

          <p className="final-cta-section-label">Teach Anywhere. Download the App.</p>
          <div className="final-cta-app-row">
            <a
              href={CTA_LINKS.app.appStore}
              className="final-cta-app-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppleIcon className="final-cta-app-ico" />
              App Store
            </a>
            <a
              href={CTA_LINKS.app.googlePlay}
              className="final-cta-app-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GooglePlayIcon className="final-cta-app-ico" />
              Google Play
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}


