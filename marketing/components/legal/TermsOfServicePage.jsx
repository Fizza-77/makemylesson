import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function TermsOfServicePage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">
            Terms of Service
          </h1>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective Date: 11 September 2026</span>
            <span className="mt-1 block">Last Updated: 11 September 2026</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. Introduction</h2>
            <p className="mb-3">
              Make My Lesson is an educational technology platform operated by Skyen Systems Pty Ltd (ACN 701 564 730), a
              company registered in Victoria, Australia (&quot;Skyen Systems&quot;, &quot;we&quot;, &quot;us&quot;,
              &quot;our&quot;).
            </p>
            <p className="mb-3">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of Make My Lesson across all
              platforms, including our website, mobile applications, and any future services.
            </p>
            <p className="mb-3">
              Who you are contracting with for a paid subscription depends on where you buy it:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Subscriptions purchased on makemylesson.ai are sold by Skyen Systems Pty Ltd.</li>
              <li>
                Subscriptions purchased inside our iOS or Android apps are sold through the Apple App Store or Google Play
                and are subject to those platforms&apos; terms. Our apps are published by Skyen Solutions, a trade name of
                Qismat Ventures W.L.L.
              </li>
            </ul>
            <p className="mb-3">
              In both cases, Skyen Systems Pty Ltd operates the platform, holds your account and lesson data, and provides
              support.
            </p>
            <p className="mb-3">
              By accessing or using Make My Lesson, you agree to be bound by these Terms. If you are using Make My Lesson
              on behalf of a school, institution or organisation, you confirm that you have the authority to bind that
              entity to these Terms.
            </p>
            <p className="mb-3">Contact:</p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
                {' '}
                — general enquiries, sales, school quotes
              </li>
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
                {' '}
                — billing, subscriptions, account and data requests, bugs
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. Eligibility &amp; Users</h2>
            <p className="mb-3">Make My Lesson is designed primarily for:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Teachers and educators</li>
              <li>Schools and institutions</li>
              <li>Curriculum designers and academic professionals</li>
            </ul>
            <p className="mb-3">You represent that:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>You are using the platform for legitimate educational purposes</li>
              <li>All information you provide is accurate</li>
              <li>You have the authority to act on behalf of any institution you represent</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. Account Registration &amp; Responsibility</h2>
            <p className="mb-3">To access certain features, you must create an account.</p>
            <p className="mb-3">You are responsible for:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activity under your account</li>
              <li>Ensuring your use complies with these Terms</li>
            </ul>
            <p className="mb-3">We may suspend or terminate accounts that:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Violate these Terms or policies</li>
              <li>Provide false or misleading information</li>
              <li>Pose a risk to platform integrity or other users</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Educational Purpose &amp; AI Disclaimer</h2>
            <p className="mb-3">
              Make My Lesson is designed to assist teachers in planning lessons, creating presentations, classroom
              activities, and assessments.
            </p>
            <p className="mb-3">It does not replace:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Professional teaching judgment</li>
              <li>Curriculum requirements</li>
              <li>Institutional policies</li>
            </ul>
            <p className="mb-3">AI-generated outputs (including lesson plans, slides, activities, and assessments):</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>May contain errors or inaccuracies</li>
              <li>Must be reviewed and validated by the teacher before classroom use</li>
              <li>Are provided &quot;as-is&quot; for educational assistance only</li>
            </ul>
            <p>
              Make My Lesson does not guarantee alignment with any specific curriculum, exam board, or academic standard.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Use the platform for unlawful or harmful purposes</li>
              <li>Upload or generate abusive, discriminatory, or inappropriate content</li>
              <li>Attempt to bypass security systems or misuse the platform</li>
              <li>Use AI-generated content without appropriate academic responsibility</li>
              <li>Share account access or misuse institutional licenses</li>
            </ul>
            <p>
              Additional rules are detailed in the{' '}
              <Link href="/acceptable-use-policy" className="text-mml-teal underline-offset-2 hover:underline">
                Acceptable Use Policy
              </Link>
              , which forms part of these Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Generated Content &amp; Responsibility</h2>
            <p className="mb-3">Make My Lesson generates educational materials based on user input.</p>
            <p className="mb-3">You acknowledge and agree that:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>You are fully responsible for reviewing, editing, and approving all generated content</li>
              <li>You are responsible for how content is used in classrooms or assessments</li>
              <li>You must ensure compliance with your curriculum, school, or governing body</li>
            </ul>
            <p className="mb-3">Make My Lesson is not responsible for:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Errors in generated lesson plans or assessments</li>
              <li>Misuse of generated content</li>
              <li>Outcomes resulting from classroom implementation</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. Intellectual Property</h2>
            <p className="mb-3">
              All platform content, design, technology and branding are owned by or licensed to Skyen Systems Pty Ltd.
            </p>
            <p className="mb-3">You may not:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Copy, reproduce, or distribute platform materials</li>
              <li>Reverse engineer or exploit the platform</li>
              <li>Use branding without permission</li>
            </ul>
            <p className="mb-3">You retain ownership of content you create or input.</p>
            <p>
              By using the platform, you grant us a limited, non-exclusive license to process and store content for platform
              functionality.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Credits, payments and subscriptions</h2>
            <p className="mb-3">Make My Lesson operates on a credit system:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Each AI generation consumes 1 credit</li>
              <li>A full 4-stage teaching pack consumes 4 credits</li>
              <li>Manual editing does not consume credits</li>
              <li>Refinements with Ayla do not consume credits</li>
              <li>Regeneration counts as a new generation</li>
              <li>Credits are deducted only after a successful generation and save</li>
            </ul>
            <p className="mb-3">New accounts receive 5 free credits on signup. No payment method is required.</p>
            <p className="mb-3">
              Paid plans include the following credit allowances, available throughout the plan period:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Monthly — 30 credits</li>
              <li>3 Months — 90 credits</li>
              <li>6 Months — 180 credits</li>
              <li>Annual — 360 credits</li>
            </ul>
            <p className="mb-3">
              Credits are pooled for the period rather than released monthly. You may use them at any time within your plan
              period. Credits do not carry over — any unused credits expire when the period ends. At 0 credits, generation
              is restricted until your plan renews or you purchase a new plan.
            </p>
            <p className="mb-3">
              On the Free plan, you may optionally watch a short video advertisement, served by Google AdMob, to unlock one
              additional generation credit. This feature is provided at our discretion; we do not guarantee ad availability at
              all times, and may modify or discontinue it.
            </p>
            <p className="mb-3">
              Subscriptions renew automatically at the end of each billing cycle unless cancelled before renewal. Payment
              is taken in advance. Full billing, cancellation and refund terms are set out in our{' '}
              <Link href="/refund-payments-policy" className="text-mml-teal underline-offset-2 hover:underline">
                Refund &amp; Payments Policy
              </Link>
              , which forms part of these Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. Institutional &amp; School Use</h2>
            <p className="mb-3">For school or department plans:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Each teacher receives an individual account and separate credits</li>
              <li>Shared logins are not permitted</li>
              <li>Administrators are responsible for managing access and usage</li>
              <li>Institutional terms may be governed by separate agreements where applicable.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. Suspension &amp; Termination</h2>
            <p className="mb-3">We may suspend or terminate access:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>For violations of these Terms or policies</li>
              <li>To protect platform integrity or users</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mb-3">You may stop using the platform at any time.</p>
            <p>Certain obligations (e.g., payment, liability, legal terms) survive termination.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">11. Third-Party Services</h2>
            <p className="mb-3">Make My Lesson may integrate with third-party services, including:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Google Firebase (authentication, storage, analytics)</li>
              <li>Export platforms (e.g., Google Classroom, Microsoft Teams)</li>
              <li>Payment providers</li>
            </ul>
            <p>We are not responsible for third-party services or their terms.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">12. Disclaimer of Warranties</h2>
            <p className="mb-3">Make My Lesson is provided &quot;as is&quot; and &quot;as available.&quot;</p>
            <p className="mb-3">We do not guarantee:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Error-free or uninterrupted service</li>
              <li>Accuracy of AI-generated content</li>
              <li>Specific teaching or learning outcomes</li>
            </ul>
            <p className="mb-3">Use of the platform is at your own risk, to the extent permitted by law.</p>
            <p>
              Nothing in this section excludes, restricts or modifies any guarantee, condition, warranty, right or remedy
              that you have under the Australian Consumer Law or any other law that cannot lawfully be excluded,
              restricted or modified.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">13. Limitation of Liability</h2>
            <p className="mb-3">
              Our services come with guarantees that cannot be excluded under the Australian Consumer Law. For major
              failures with the service, you are entitled to cancel your service contract with us and to a refund for the
              unused portion, or to compensation for its reduced value. You are also entitled to be compensated for any
              other reasonably foreseeable loss or damage. If the failure does not amount to a major failure, you are
              entitled to have problems with the service rectified in a reasonable time and, if this is not done, to cancel
              your contract and obtain a refund for the unused portion.
            </p>
            <p className="mb-3">Subject to the paragraph above and to the maximum extent permitted by law:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>We are not responsible for classroom or assessment outcomes</li>
              <li>
                Total liability shall not exceed the amount paid by you in the preceding 12 months, or USD 100 (whichever
                is greater)
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">14. Indemnification</h2>
            <p className="mb-3">You agree to indemnify and hold harmless Skyen Systems Pty Ltd from claims arising from:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Your use of the platform</li>
              <li>Misuse of generated content</li>
              <li>Violation of these Terms</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">15. Governing law and disputes</h2>
            <p className="mb-3">
              These Terms are governed by the laws of the State of Victoria, Australia, without regard to conflict-of-law
              principles. Any dispute arising from these Terms or the Service is subject to the non-exclusive jurisdiction
              of the courts of Victoria, Australia, except where mandatory consumer-protection law in your country of
              residence entitles you to bring a claim in your local courts, in which case that right is not affected by
              this clause.
            </p>
            <p>
              This clause addresses contract disputes only. It does not override the Australian Privacy Act 1988 (Cth) as
              it applies to us, nor any mandatory rights available to you under the law of your own country, including the
              UK GDPR and EU GDPR where those apply to you.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">16. Changes to These Terms</h2>
            <p className="mb-3">We may update these Terms periodically.</p>
            <p>Continued use of Make My Lesson after changes constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">17. Contact Information</h2>
            <p className="mb-3">
              Skyen Systems Pty Ltd (ACN 701 564 730), Unit 18, 285–287 Derrimut Rd, Hoppers Crossing VIC 3029, Australia.
            </p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
                {' '}
                — general enquiries, sales, school quotes
              </li>
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
                {' '}
                — billing, subscriptions, account and data requests, bugs
              </li>
            </ul>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}


