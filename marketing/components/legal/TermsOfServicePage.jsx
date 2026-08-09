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
          <p className="legal-article-operator">Operated by Qismat Ventures W.L.L</p>
          <p className="legal-article-meta">
            <span className="block">Effective Date: [To be set]</span>
            <span className="mt-1 block">Last Updated: [To be set]</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. Introduction</h2>
            <p className="mb-3">
              Welcome to Make My Lesson, an educational technology platform operated by Qismat Ventures W.L.L
              (&quot;Make My Lesson,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>
            <p className="mb-3">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of Make My Lesson across all
              platforms, including web applications, mobile applications, and any future services.
            </p>
            <p className="mb-3">By accessing or using Make My Lesson, you agree to be bound by these Terms.</p>
            <p className="mb-3">
              If you are using Make My Lesson on behalf of a school, institution, or organisation, you confirm that you
              have the authority to bind that entity to these Terms.
            </p>
            <p className="mb-3">Contact:</p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
              </li>
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
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
              All platform content, design, technology, and branding are owned by or licensed to Qismat Ventures W.L.L.
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
            <h2 className="legal-h2">8. Credits, Payments &amp; Subscriptions</h2>
            <p className="mb-3">Make My Lesson operates on a credit-based system:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Each AI generation consumes 1 credit</li>
              <li>A full 4-stage teaching pack consumes 4 credits</li>
              <li>Manual editing does not consume credits</li>
              <li>Regeneration counts as a new generation</li>
            </ul>
            <p className="mb-3">New users receive:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>5 free credits (no payment required)</li>
            </ul>
            <p className="mb-3">Paid subscriptions include:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>30 credits per month</li>
              <li>Credits are deducted only after successful generation and save.</li>
            </ul>
            <p className="mb-3">At 0 credits, generation is restricted until credits are renewed or purchased.</p>
            <p className="mb-3">Payments and subscriptions:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>May be billed monthly or annually</li>
              <li>May be processed via third-party platforms (e.g., app stores or payment providers)</li>
              <li>
                Are subject to our{' '}
                <Link href="/refund-payments-policy" className="text-mml-teal underline-offset-2 hover:underline">
                  Refund &amp; Payments Policy
                </Link>
              </li>
            </ul>
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
            <p>Use of the platform is at your own risk, to the extent permitted by law.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">13. Limitation of Liability</h2>
            <p className="mb-3">To the maximum extent permitted by law:</p>
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
            <p className="mb-3">You agree to indemnify and hold harmless Qismat Ventures W.L.L from claims arising from:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Your use of the platform</li>
              <li>Misuse of generated content</li>
              <li>Violation of these Terms</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">15. Governing Law</h2>
            <p>These Terms are governed by the laws of the Kingdom of Bahrain.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">16. Changes to These Terms</h2>
            <p className="mb-3">We may update these Terms periodically.</p>
            <p>Continued use of Make My Lesson after changes constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">17. Contact Information</h2>
            <p className="mb-3">For any questions or concerns:</p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
              </li>
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-white">
              Operated by Qismat Ventures W.L.L
              <br />
              Office 501, Building 1025, Road 3621, Block 436, Al-Seef, Kingdom of Bahrain
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}
