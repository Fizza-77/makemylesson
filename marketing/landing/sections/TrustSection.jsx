import { Reveal } from '../shared'

export default function TrustSection() {
  return (
    <section id="trust" className="trust-section">
      <div className="W">
        <div className="trust-inner">
          <Reveal className="trust-intro">
            <span className="section-eyebrow">Editorial integrity</span>
            <h2 className="trust-headline">Built to Respect Your Professional Judgement.</h2>
            <p className="trust-intro-lead">
              Make My Lesson is built for educators who review, adapt, and own every document before it reaches their
              classroom.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="trust-box">
              <div className="trust-box-item">
                <h3 className="trust-box-title">AI Is a Starting Point, Not a Final Product</h3>
                <blockquote className="trust-box-callout">
                  <p>
                    &ldquo;Content generated aligns with [curriculum name and route]. Always verify against current
                    official documentation and adapt to your learners&apos; needs.&rdquo;
                  </p>
                </blockquote>
              </div>

              <div className="trust-box-item">
                <h3 className="trust-box-title">Professional Expertise Remains Essential</h3>
                <p>
                  Your knowledge of your students, your classroom, and your school context is what turns generated content
                  into a lesson that works in practice.
                </p>
              </div>

              <div className="trust-box-item">
                <h3 className="trust-box-title">Honest About Limitations</h3>
                <p>
                  Make My Lesson supports professional preparation. It does not replace your judgement or sign-off.
                </p>
                <ul className="trust-box-list">
                  <li>Not official exam papers</li>
                  <li>Not guaranteed syllabus alignment without your review</li>
                  <li>Teachers remain responsible for verification before classroom use</li>
                </ul>
              </div>

              <div className="trust-box-item">
                <h3 className="trust-box-title">Handles the Repetitive Work</h3>
                <p>
                  So your preparation time goes into quality, adaptation, and your learners rather than admin.
                </p>
                <ul className="trust-box-list">
                  <li>Learning objectives</li>
                  <li>Formatting</li>
                  <li>Slide generation</li>
                  <li>Mark schemes</li>
                  <li>Administrative preparation</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
