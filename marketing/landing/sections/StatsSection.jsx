import { useCounter } from '../hooks'
import { Reveal } from '../shared'

const STATS = [
  {
    end: 49,
    suffix: 'h',
    label: 'per week the average teacher works, 10 hours above their contracted hours',
  },
  {
    end: 3,
    start: 2,
    suffix: 'h',
    range: true,
    label: 'saved per complete teaching pack vs. building across 5 separate tools',
  },
  {
    end: 71,
    suffix: '',
    label: 'curriculum routes across Australia, UK, Canada, IB and US. Every route dedicated, never generic.',
  },
  {
    end: 16,
    suffix: '',
    label: 'teaching methods genuinely embedded throughout every stage, not just labelled',
  },
]

function StatNumber({ end, start = 0, suffix = '', range = false }) {
  const ref = useCounter(end, { start: range ? start : 0, suffix, range })
  const initial = range ? `${start}–${start}${suffix}` : `0${suffix}`

  return (
    <span ref={ref} className="stat-num">
      {initial}
    </span>
  )
}

export default function StatsSection() {
  return (
    <div className="stats stats-bar">
      <div className="W">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <Reveal key={`stat-${i}`} delay={i * 70} className="stat stat-item">
              <StatNumber end={s.end} start={s.start} suffix={s.suffix} range={s.range} />
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
