import Image from 'next/image'
import SectionLink from '@marketing/components/SectionLink'
import { Label, Reveal } from '../shared'
import { MML_APP } from '@marketing/lib/appUrls'

const HERO_MOCKUPS = [
  {
    src: '/mockups/makemylesson-mockup.jpeg',
    className: 'hero-mockup-phone--primary',
    alt: 'Make My Lesson mobile app showing an AI-generated lesson plan',
  },
  {
    src: '/mockups/makemylesson-mockup2.jpeg',
    className: 'hero-mockup-phone--secondary',
    alt: 'Make My Lesson mobile app showing a classroom presentation',
  },
]

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-glow" />
      <div className="hero-grid-bg" />

      <div className="hero-shell W">
        <div className="hero-inner">
          
          {/* LEFT */}
          <div className="hero-left">
            <Label>AI lesson planner for teachers</Label>

            <h1 className="hero-title font-display font-bold not-italic text-slate-900">
              <span className="hero-title-line">The AI Lesson Planner</span>
              <span className="hero-title-line">and Lesson Plan Generator</span>
              <span className="hero-title-line hero-title-line--last">
                <span className="hero-title-accent not-italic">for Curriculum-Aligned Teaching Packs</span>
              </span>
            </h1>

            <p className="hero-sub hero-sub-lead">
              Your curriculum, your output. Select your route, enter your topic, and get a standards-based, classroom-ready
              pack with lesson plan, AI presentation, classroom activity, and summative assessment with mark scheme{' '}
              <strong>in minutes, not hours.</strong> Save 2–3 hours per lesson and cut lesson preparation time.
            </p>

            <div className="hero-ctas">
              <a href={MML_APP.stage1} className="btn btn-teal btn-lg">
                Build Your First Teaching Pack Free
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <SectionLink sectionId="how-it-works" href="/" className="btn btn-ghost btn-lg">
                See How It Works ↓
              </SectionLink>
            </div>
          </div>

          {/* RIGHT */}
          <Reveal delay={200} className="hero-right-wrap">
            <div className="hero-right hero-right-visual">
              <div className="hero-visual">
                <div className="hero-mockups" aria-hidden>
                  <div className="hero-mockups-glow" />
                  <div className="hero-mockups-ring" />
                  {HERO_MOCKUPS.map(({ src, className, alt }) => (
                    <div key={src} className={`hero-mockup-phone ${className}`}>
                      <div className="hero-mockup-notch" />
                      <div className="hero-mockup-screen">
                        <Image
                          src={src}
                          alt={alt}
                          width={390}
                          height={844}
                          className="hero-mockup-img"
                          sizes="(max-width: 960px) 42vw, 210px"
                          priority
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}

