import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function AccountDataDeletionPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">
            Account &amp; Data Deletion Request
          </h1>
          <p className="legal-article-operator">Operated by Qismat Ventures W.L.L</p>
          <p className="legal-article-meta">
            <span className="block">Last Updated: [To be set]</span>
          </p>
        </header>

        <div className="legal-article-body">
          <p>
            This document explains how users of Make My Lesson can request the deletion of their account and associated
            personal data from our platform.
          </p>

          <section className="legal-section">
            <h2 className="legal-h2">
              How to Request Deletion of Your Account &amp; Data
            </h2>
            <p className="mb-4">
              To permanently delete your Make My Lesson account and all associated data, please follow these steps:
            </p>

            <h3 className="legal-h3">Step 1: Send an Email Request</h3>
            <p className="mb-3">Send an email to:</p>
            <ul className="mb-6 list-none space-y-1">
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
              </li>
              <li>
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
              </li>
            </ul>

            <h3 className="legal-h3">Step 2: Use the Subject Line</h3>
            <p className="mb-6 font-medium text-white">Account Deletion Request</p>

            <h3 className="legal-h3">Step 3: Include the Following Information</h3>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Your registered email address</li>
              <li>Your full name (if provided in the platform)</li>
              <li>A clear statement requesting deletion of your account and all associated data</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">Verification Process</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>We will verify your identity using your registered email address</li>
              <li>Additional verification may be required for security purposes</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">Processing Timeline</h2>
            <p className="mb-3">Once verified:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>We will confirm receipt of your request within 48 hours</li>
              <li>Full account and data deletion will be completed within 30 days</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">What Data Will Be Deleted</h2>
            <p className="mb-4">Upon successful processing, we will permanently delete:</p>

            <h3 className="legal-h3">1. Account Information</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Email address</li>
              <li>Firebase UID (unique identifier)</li>
              <li>User role (e.g., Teacher, Institution)</li>
            </ul>

            <h3 className="legal-h3">2. Generated &amp; Stored Content</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Lesson plans</li>
              <li>Presentations</li>
              <li>Classroom activities</li>
              <li>Assessments and mark schemes</li>
              <li>Saved library content</li>
              <li>Curriculum selections and preferences</li>
              <li>User settings and configurations</li>
            </ul>

            <h3 className="legal-h3">3. Usage &amp; Analytics Data (Linked to Account)</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Platform usage data linked to your account</li>
              <li>Feature interaction history</li>
            </ul>

            <h3 className="legal-h3">4. Other Identifiers</h3>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Any additional personal identifiers associated with your account</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">
              Data We May Retain (Legal &amp; Operational Reasons)
            </h2>
            <p className="mb-4">
              In certain cases, we may retain limited data even after deletion, as required by law or legitimate business
              purposes. This retained data will not be linked to your identity.
            </p>

            <h3 className="legal-h3">1. Aggregated / Anonymised Data</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Retained indefinitely</li>
              <li>Used for platform improvement</li>
              <li>Not personally identifiable</li>
            </ul>

            <h3 className="legal-h3">2. Legal, Security &amp; Compliance Records</h3>
            <p className="mb-2">Retained up to 7 years (or as required by law)</p>
            <p className="mb-2">Used for:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Legal obligations</li>
              <li>Fraud prevention</li>
              <li>Dispute resolution</li>
            </ul>

            <h3 className="legal-h3">3. Subscription &amp; Financial Records</h3>
            <p className="mb-2">Retained for 5–7 years</p>
            <p className="mb-2">Required for:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Accounting</li>
              <li>Tax compliance</li>
              <li>Financial auditing</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">Important Notes</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Once deletion is completed, your account cannot be restored</li>
              <li>All generated content and data will be permanently removed</li>
              <li>
                Active subscriptions should be cancelled separately through:
                <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-mml-teal">
                  <li>Apple App Store</li>
                  <li>Google Play Store</li>
                  <li>Web payment provider (if applicable)</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">Additional Information</h2>
            <p>
              For full details on how we collect, use, and protect your data, please refer to our{' '}
              <Link href="/privacy-policy-web" className="text-mml-teal underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">Need Help?</h2>
            <p className="mb-3">If you have any questions or need assistance with your request, contact:</p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
              </li>
              <li>
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">Company Information</h2>
            <p className="text-sm text-white">
              Qismat Ventures W.L.L
              <br />
              Office 501, Building 1025, Road 3621, Block 436, Al-Seef
              <br />
              Kingdom of Bahrain
              <br />
              Registration Number: 190698-1
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}
