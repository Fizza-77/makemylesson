import Image from 'next/image'

import { Reveal } from '../shared'

const REGIONS = [
  {
    key: 'us',
    flagSrc: '/US.png',
    heading: 'United States: 4 Curriculum Frameworks',
    body: [
      'Elementary (Grades 1–5, CCSS/NGSS), Middle School (Grades 6–8), High School Standard (Grades 9–12), and Advanced Placement / AP Pathway (Grades 9–12, College Board CED aligned). Pre-AP handling for Grades 9–10 and full AP framing for Grades 11–12.',
    ],
    tags: ['Common Core', 'NGSS', 'AP / Advanced Placement', 'College Board CED', 'Pre-AP', 'Middle School', 'High School'],
    wide: true,
  },
  {
    key: 'au',
    flagSrc: '/australia.png',
    heading: 'Australia: 23 Curriculum Routes',
    body: [
      'NSW, Victoria, Queensland, Western Australia, South Australia, Tasmania, ACT and Northern Territory, across Primary (Years 1–6), Secondary (Years 7–10), and Senior Certificate levels. Every state and territory covered, including HSC, VCE, QCE, WACE, SACE, TCE, ACT Senior Secondary, and NTCET.',
    ],
    tags: ['HSC', 'VCE', 'QCE', 'WACE', 'SACE', 'TCE', 'NESA', 'VCAA', 'QCAA', 'SCSA', 'NTCET'],
  },
  {
    key: 'uk',
    flagSrc: '/UK.png',
    heading: 'United Kingdom: 14 Curriculum Routes',
    body: [
      'UK National Curriculum (DfE) across KS1/KS2, KS3, KS4/GCSE and KS5/A Level. Cambridge International (CAIE) from Primary through to AS and A Level. Pearson Edexcel across KS1 through KS5. All outputs are aligned to the specific board: AQA, OCR, Edexcel and WJEC terminology, command words and assessment objectives are applied to every generation.',
    ],
    tags: ['GCSE', 'A Level', 'CAIE', 'Edexcel', 'KS1–KS5', 'AQA', 'OCR', 'WJEC', 'IGCSE'],
  },
  {
    key: 'ca',
    flagSrc: '/canada.png',
    heading: 'Canada: 24 Curriculum Routes',
    body: [
      'Eight province and territory groups across three levels: Elementary (Grades 1–6), Grades 7–10, and Senior (Grades 11–12). Ontario OSSD, British Columbia Dogwood Diploma, Alberta Diploma, Quebec QEP/MEES, Manitoba, Saskatchewan, Atlantic Canada (APEF framework), and Northern Territories.',
    ],
    tags: ['Ontario OSSD', 'BC Dogwood', 'Alberta Diploma', 'Quebec QEP', 'Manitoba', 'Saskatchewan', 'APEF'],
  },
  {
    key: 'ib',
    flagSrc: '/US.png',
    heading: 'International Baccalaureate: 3 Programmes',
    body: [
      'Primary Years Programme (PYP), Middle Years Programme (MYP), and Diploma Programme (DP) across all subject groups. IB pedagogy, including inquiry-based learning, conceptual understanding, ATL skills, global contexts, and criterion-referenced assessment, is embedded throughout, not just labelled.',
    ],
    tags: ['PYP', 'MYP', 'Diploma DP', 'ATL Skills', 'HL / SL', 'Criterion-referenced'],
    wide: true,
  },
]

export default function CurriculumSection() {
  return (
    <section className="cur cur-alt" id="curriculum">
      <div className="W">
        <Reveal className="curriculum-intro">
          <span className="section-eyebrow">Curriculum coverage</span>
          <h2 className="cur-head-title">Your Curriculum. Your Route. Your Output. Not a Generic Template.</h2>
        </Reveal>

        <div className="curriculum-grid">
          {REGIONS.map((r, i) => (
            <Reveal
              key={r.key}
              delay={i * 55}
              className={`curr-card curr-${r.key}${r.wide ? ' curr-wide' : ''}`}
            >
              <span className="curr-flag" aria-hidden>
                <Image
                  src={r.flagSrc}
                  alt=""
                  width={44}
                  height={30}
                  className="curr-flag-img"
                  loading="lazy"
                />
              </span>
              <h3>{r.heading}</h3>
              <div className="curr-body">
                {r.body.map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
              <div className="curr-tags">
                {r.tags.map((t) => (
                  <span key={t} className="curr-tag">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
