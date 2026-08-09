import { Printer } from 'lucide-react'

const EXPORTS = [
  { id: 'pdf', label: 'PDF', color: '#E11D48', letter: 'P' },
  { id: 'print', label: 'Print', color: '#1A1E3A', icon: 'print' },
  { id: 'docx', label: 'DOCX / Word', color: '#2563EB', letter: 'W' },
  { id: 'gdocs', label: 'Google Docs', color: '#16A34A', letter: 'G' },
  { id: 'gclass', label: 'Google Classroom', color: '#EA580C', letter: 'C' },
]

function ExportPill({ item }) {
  return (
    <div className="inline-flex shrink-0 items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(26,30,58,0.08)]">
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
      <span className="text-[13px] font-semibold text-[#1A1E3A] sm:text-[14px]">{item.label}</span>
    </div>
  )
}

export default function LessonPlanTakeAnywhere() {
  return (
    <section
      className="bg-[#ade5df] py-14 sm:py-16 lg:py-20"
      aria-labelledby="take-anywhere-heading"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-4 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-sm shrink-0 lg:max-w-xs">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1E9A98]">
            Take it anywhere
          </p>
          <h2
            id="take-anywhere-heading"
            className="text-[clamp(1.75rem,3.4vw,2.6rem)] font-bold leading-[1.12] tracking-tight text-[#1A1E3A]"
          >
            Yours to edit, print, and{' '}
            <span className="pricing-hero-underline relative inline-block whitespace-nowrap">
              share.
            </span>
          </h2>
        </div>

        <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-nowrap lg:justify-end">
          {EXPORTS.map((item) => (
            <ExportPill key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
