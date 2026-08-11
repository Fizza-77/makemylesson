import Link from 'next/link'
import { BookOpen, Folder, Library, Users } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'

export default function PricingPlanFloatCards() {
  return (
    <div className="mml-pricing-float">
      <article className="mml-pricing-float-card mml-pricing-float-card--school">
        <p className="mml-pricing-float-eyebrow">School</p>
        <p className="mml-pricing-float-title">Pooled</p>
        <p className="mml-pricing-float-desc">Shared credits for whole teaching teams.</p>
        <div className="mml-pricing-float-meter mml-pricing-float-meter--light">
          <p className="mml-pricing-float-meter-row">
            <span className="mml-pricing-float-meter-value">∞</span>
            <span className="mml-pricing-float-meter-label">flexible allocation</span>
          </p>
          <div className="mml-pricing-float-track">
            <div
              className="mml-pricing-float-fill"
              style={{
                width: '95%',
                background: 'linear-gradient(90deg, #1e9a98 0%, #35bebc 50%, #74fffd 100%)',
              }}
            />
          </div>
        </div>
        <ul className="mml-pricing-float-list">
          <li>
            <span className="mml-pricing-float-icon">
              <Users className="mml-pricing-float-icon-svg" aria-hidden />
            </span>
            Shared team credits
          </li>
          <li>
            <span className="mml-pricing-float-icon">
              <Library className="mml-pricing-float-icon-svg" aria-hidden />
            </span>
            School admin controls
          </li>
        </ul>
        <div className="mml-pricing-float-foot">
          <span className="mml-pricing-float-meta">For schools</span>
          <Link href="/contact" className="mml-pricing-float-btn mml-pricing-float-btn--navy">
            Contact us
          </Link>
        </div>
      </article>

      <article className="mml-pricing-float-card mml-pricing-float-card--free">
        <p className="mml-pricing-float-eyebrow mml-pricing-float-eyebrow--light">Free</p>
        <p className="mml-pricing-float-title">10 Credits</p>
        <p className="mml-pricing-float-desc mml-pricing-float-desc--light">
          Explore every stage before upgrading.
        </p>
        <div className="mml-pricing-float-meter mml-pricing-float-meter--dark">
          <p className="mml-pricing-float-meter-row mml-pricing-float-meter-row--light">
            <span className="mml-pricing-float-meter-value mml-pricing-float-meter-value--light">
              10
            </span>
            <span className="mml-pricing-float-meter-label">credits included</span>
          </p>
          <div className="mml-pricing-float-track mml-pricing-float-track--dark">
            <div className="mml-pricing-float-fill" style={{ width: '32%', background: '#35BEBC' }} />
          </div>
        </div>
        <ul className="mml-pricing-float-list mml-pricing-float-list--light">
          <li>
            <span className="mml-pricing-float-icon">
              <Folder className="mml-pricing-float-icon-svg" aria-hidden />
            </span>
            Complete teaching packs
          </li>
          <li>
            <span className="mml-pricing-float-icon">
              <BookOpen className="mml-pricing-float-icon-svg" aria-hidden />
            </span>
            All creation tools
          </li>
        </ul>
        <div className="mml-pricing-float-foot">
          <span className="mml-pricing-float-meta mml-pricing-float-meta--light">No card required</span>
          <Link
            href={MML_APP.signUp || MML_APP.stage1}
            className="mml-pricing-float-btn mml-pricing-float-btn--teal"
          >
            Start free
          </Link>
        </div>
      </article>

      <article className="mml-pricing-float-card mml-pricing-float-card--individual">
        <p className="mml-pricing-float-eyebrow mml-pricing-float-eyebrow--light">Individual</p>
        <p className="mml-pricing-float-title">
          60
          <span className="mml-pricing-float-title-suffix">/ month</span>
        </p>
        <p className="mml-pricing-float-desc mml-pricing-float-desc--light">
          Built for teachers creating every week.
        </p>
        <div className="mml-pricing-float-meter mml-pricing-float-meter--dark">
          <p className="mml-pricing-float-meter-row mml-pricing-float-meter-row--light">
            <span className="mml-pricing-float-meter-value mml-pricing-float-meter-value--light">
              60
            </span>
            <span className="mml-pricing-float-meter-label">monthly credits</span>
          </p>
          <div className="mml-pricing-float-track mml-pricing-float-track--dark">
            <div className="mml-pricing-float-fill" style={{ width: '75%', background: '#35BEBC' }} />
          </div>
        </div>
        <ul className="mml-pricing-float-list mml-pricing-float-list--light">
          <li>
            <span className="mml-pricing-float-icon">
              <Folder className="mml-pricing-float-icon-svg" aria-hidden />
            </span>
            Up to 15 complete packs
          </li>
          <li>
            <span className="mml-pricing-float-icon">
              <Library className="mml-pricing-float-icon-svg" aria-hidden />
            </span>
            Personal resource library
          </li>
        </ul>
        <div className="mml-pricing-float-foot">
          <span className="mml-pricing-float-meta mml-pricing-float-meta--light">For one teacher</span>
          <span className="mml-pricing-float-badge">Most popular</span>
        </div>
      </article>
    </div>
  )
}
