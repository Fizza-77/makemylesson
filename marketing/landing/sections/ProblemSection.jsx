import { ClipboardList, Clock, FileCheck, PencilLine, Presentation } from 'lucide-react'
import { Reveal } from '../shared'

const PAIN_ITEMS = [
  {
    Icon: ClipboardList,
    title: 'Lesson plan in Word/Google Docs',
    highlight: false,
  },
  {
    Icon: Presentation,
    title: 'Presentation in PowerPoint/Google Slides',
    highlight: false,
  },
  {
    Icon: PencilLine,
    title: 'Worksheet from scratch or Teachers Pay Teachers',
    highlight: false,
  },
  {
    Icon: FileCheck,
    title: 'Assessment paper + mark scheme',
    highlight: false,
  },
  {
    Icon: Clock,
    title: 'Total: 2.5 – 5 hours per complete lesson',
    highlight: true,
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="problem-section" aria-labelledby="problem-heading">
      <div className="W">
        <span className="section-eyebrow problem-eyebrow">The problem</span>
        <div className="problem-cols">
          <Reveal className="problem-side">
            <h2 id="problem-heading">
              You Became a Teacher to Teach.
              <br />
              Not to Spend Hours Every Week Building Resources.
            </h2>
            <p>
              Teachers average 49 hours a week, 10 hours above contract. Make My Lesson cuts workload on lesson plans,
              slide decks, worksheets, and assessments.
            </p>
            <p>
              One 45-minute lesson can take <strong>2 hours to prepare fully</strong>: four documents across four tools,
              each needing to match your curriculum route, not a generic standard.
            </p>
            <p>
              Make My Lesson handles the structural generation work so your time goes into refining and adapting, not
              replacing your professional judgement.
            </p>
          </Reveal>

          <Reveal delay={90} className="problem-cards">
            <ul className="pain-list">
              {PAIN_ITEMS.map((item) => (
                <li key={item.title} className={`pain-item${item.highlight ? ' pain-item--highlight' : ''}`}>
                  <div className="pain-icon" aria-hidden>
                    <item.Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="pain-text">
                    <strong>{item.title}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
