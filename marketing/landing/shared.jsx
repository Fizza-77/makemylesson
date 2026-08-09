import { useInView } from './hooks'

export function Reveal({ children, className = '', delay = 0, style: sx }) {
  const [ref, vis] = useInView()

  return (
    <div
      ref={ref}
      className={`lp-reveal ${vis ? 'lp-vis' : ''} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...sx }}
    >
      {children}
    </div>
  )
}

export function Label({ children, center }) {
  return <div className={`lp-label ${center ? 'lp-label-center' : ''}`}>{children}</div>
}

export function CheckItem({ children }) {
  return (
    <li className="feat-check">
      <span className="feat-check-icon">
        <svg viewBox="0 0 9 7" fill="none">
          <path
            d="M1 3.5l2.5 2.5 5-5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </li>
  )
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" className="check-circle-on" />
      <path
        d="M4 7l2 2 4-4"
        stroke="var(--teal)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" className="check-circle-off" />
      <path d="M4.5 9.5l5-5M9.5 9.5l-5-5" stroke="var(--border)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function ReviewCard({ q, n, r, col, tc }) {
  const initials = n
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="rev-card">
      <div className="rev-stars">★★★★★</div>
      <div className="rev-quote">"{q}"</div>
      <div className="rev-who">
        <div className="rev-av" style={{ background: col, color: tc }}>
          {initials}
        </div>
        <div>
          <div className="rev-name">{n}</div>
          <div className="rev-role">{r}</div>
        </div>
      </div>
    </div>
  )
}
