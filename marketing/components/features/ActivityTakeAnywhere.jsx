import { Printer } from 'lucide-react'

const EXPORTS = [
  { id: 'pdf', label: 'PDF (sheet + key)', color: '#E11D48', letter: 'P' },
  { id: 'docx', label: 'DOCX / Word', color: '#2563EB', letter: 'W' },
  { id: 'gdocs', label: 'Google Docs', color: '#16A34A', letter: 'G' },
  { id: 'gclass', label: 'Google Classroom', color: '#EA580C', letter: 'C' },
  { id: 'teams', label: 'Microsoft Teams', color: '#7C3AED', letter: 'T' },
  { id: 'print', label: 'Print', color: '#35BEBC', icon: 'print' },
]

function ExportPill({ item }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-transparent px-3.5 py-2.5">
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-bold text-white"
        style={{ backgroundColor: item.color }}
        aria-hidden
      >
        {item.icon === 'print' ? (
          <Printer className="h-3.5 w-3.5" strokeWidth={2.25} />
        ) : (
          item.letter
        )}
      </span>
      <span className="text-[13px] font-semibold text-white sm:text-[14px]">{item.label}</span>
    </div>
  )
}

export default function ActivityTakeAnywhere() {
  return (
    <section
      className="bg-[#1A1E3A] py-14 sm:py-16 lg:py-20"
      aria-labelledby="activity-take-anywhere-heading"
    >
      <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-10 px-4 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="max-w-md shrink-0">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
            Take it anywhere
          </p>
          <h2
            id="activity-take-anywhere-heading"
            className="text-[clamp(1.75rem,3.4vw,2.6rem)] font-bold leading-[1.12] tracking-tight text-white"
          >
            Photocopier-ready in{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              one click.
            </span>
          </h2>
        </div>

        <div className="flex w-full max-w-2xl flex-wrap gap-2.5 lg:justify-end">
          {EXPORTS.map((item) => (
            <ExportPill key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
