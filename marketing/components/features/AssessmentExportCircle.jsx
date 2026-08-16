import { Printer } from 'lucide-react'

const EXPORTS = [
  { id: 'pdf', label: 'PDF', color: '#E11D48', letter: 'P' },
  { id: 'docx', label: 'DOCX / Word', color: '#2563EB', letter: 'W' },
  { id: 'gforms', label: 'Google Forms', color: '#7C3AED', letter: 'F' },
  { id: 'gclass', label: 'Google Classroom', color: '#EA580C', letter: 'C' },
  { id: 'teams', label: 'Microsoft Teams', color: '#5B5FC7', letter: 'T' },
  { id: 'print', label: 'Print', color: '#35BEBC', icon: 'print' },
]

const STAGES = [
  { stage: 'Stage 1', label: 'Lesson Plan' },
  { stage: 'Stage 2', label: 'Presentation' },
  { stage: 'Stage 3', label: 'Activity' },
]

function ExportPill({ item }) {
  return (
    <div className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
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
      <span className="text-[12px] font-semibold text-[#1A1E3A] sm:text-[13px]">{item.label}</span>
    </div>
  )
}

export default function AssessmentExportCircle() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20" aria-label="Export and pack coherence">
      <div className="fp-shell-md grid gap-4 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-5">
        <article className="flex min-h-[320px] w-full min-w-0 flex-col rounded-[32px] bg-[#1A1E3A] p-6 text-white sm:min-h-[340px] sm:rounded-[40px] sm:p-8">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35BEBC]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35BEBC]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            </span>
            Take it anywhere
          </p>
          <h2 className="max-w-[14ch] xl:max-w-none text-[clamp(1.5rem,2.8vw,2.15rem)] font-bold leading-[1.15] tracking-tight">
            Paper, digital, or auto-marked.
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white sm:text-[15px]">
            Export the assessment and mark scheme into the formats your classroom workflow already
            uses.
          </p>
          <div className="mt-auto flex flex-wrap gap-2.5 pt-8">
            {EXPORTS.map((item) => (
              <ExportPill key={item.id} item={item} />
            ))}
          </div>
        </article>

        <article className="flex min-h-[320px] w-full min-w-0 flex-col rounded-[32px] bg-[#35BEBC] p-6 text-[#1A1E3A] sm:min-h-[340px] sm:rounded-[40px] sm:p-8">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            The full circle
          </p>
          <h2 className="max-w-[14ch] xl:max-w-none text-[clamp(1.5rem,2.8vw,2.15rem)] font-bold leading-[1.15] tracking-tight">
            The test only asks what the pack taught.
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-black sm:text-[15px]">
            When all four stages belong to the same topic, assessment questions can reflect the
            objectives, presentation content and student practice already created.
          </p>
          <div className="mt-auto grid grid-cols-3 gap-2.5 pt-8">
            {STAGES.map((item) => (
              <div
                key={item.stage}
                className="rounded-2xl bg-[#1A1E3A] px-3 py-3.5 text-white sm:px-4 sm:py-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                  {item.stage}
                </p>
                <p className="mt-2 text-[13px] font-bold sm:text-[14px]">{item.label}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
