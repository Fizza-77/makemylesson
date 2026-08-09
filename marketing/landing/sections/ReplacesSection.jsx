import { CheckCircle2, XCircle } from 'lucide-react'

import { Reveal } from '../shared'

/** SECTION 7 — Before / With comparison (two columns). */
const ROWS = [
  {
    before: 'Lesson plan: 30–60 minutes in Word/Google Docs',
    after: 'Lesson plan: Generated in minutes, aligned to your exact curriculum route',
  },
  {
    before: 'Presentation: 45–90 minutes in PowerPoint/Google Slides',
    after: 'Presentation: Generated automatically from your lesson plan, with AI images',
  },
  {
    before: 'Worksheet: 30–60 minutes on a worksheet builder or Teachers Pay Teachers',
    after:
      'Classroom activity: Two documents — student sheet and teacher answer key — generated together',
  },
  {
    before: 'Assessment: 60–90 minutes designing questions and mark scheme',
    after: 'Assessment: Paper and mark scheme, Bloom-balanced, curriculum-aligned, generated together',
  },
  {
    before: 'Total: 2.5–5 hours per complete lesson',
    after: 'Total: Under 10 minutes per complete teaching pack',
    total: true,
  },
  {
    before: 'Across 5 tools that don’t talk to each other',
    after: 'One platform, one selection, complete coherence',
    total: true,
  },
]

export default function ReplacesSection() {
  return (
    <section id="what-it-replaces" className="replaces-section">
      <div className="W">
        <Reveal className="replaces-intro">
          <span className="section-eyebrow">What it replaces</span>
          <h2 className="replaces-headline">One Platform. Everything You Used to Need Five Tools For.</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="replaces-table-wrap">
            <table className="replaces-table">
              <thead>
                <tr>
                  <th className="replaces-th replaces-th--before" scope="col">
                    <span className="replaces-th-inner">
                      <span className="replaces-th-badge replaces-th-badge--before">Old Way</span>
                      Before Make My Lesson
                    </span>
                  </th>
                  <th className="replaces-th replaces-th--after" scope="col">
                    <span className="replaces-th-inner">
                      <span className="replaces-th-badge replaces-th-badge--after">With MML</span>
                      With Make My Lesson
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={i} className={row.total ? 'replaces-total-row' : undefined}>
                    <td className="before-col">
                      <span className="replaces-cell">
                        {!row.total && (
                          <span className="replaces-cell-icon replaces-cell-icon--before" aria-hidden>
                            <XCircle className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                          </span>
                        )}
                        <span className="replaces-cell-text">{row.before}</span>
                      </span>
                    </td>
                    <td className="after-col">
                      <span className="replaces-cell">
                        {!row.total && (
                          <span className="replaces-cell-icon replaces-cell-icon--after" aria-hidden>
                            <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                          </span>
                        )}
                        <span className="replaces-cell-text">{row.after}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
