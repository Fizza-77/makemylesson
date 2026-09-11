import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function FAQPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">Frequently Asked Questions</h1>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective: 10 September 2026</span>
            <span className="mt-1 block">Last Updated: 10 September 2026</span>
          </p>
        </header>
        <div className="legal-article-body">
          {/* Placeholder FAQ sections – replace with real content when available */}
          <section className="legal-section">
            <h2 className="legal-h2">General Questions</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong>What is Make My Lesson?</strong> – An AI‑powered lesson‑planning platform that helps teachers create lesson plans, presentations, activities and assessments.
              </li>
              <li>
                <strong>Who operates the service?</strong> – Skyen Systems Pty Ltd (ACN 701 564 730).
              </li>
            </ul>
          </section>
          <section className="legal-section">
            <h2 className="legal-h2">Privacy & Data</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong>How can I delete my account?</strong> – See the <Link href="/account-data-deletion" className="text-mml-teal underline-offset-2 hover:underline">Account & Data Deletion</Link> page.
              </li>
              <li>
                <strong>Where can I read the full privacy policy?</strong> – Visit the <Link href="/privacy-policy-web" className="text-mml-teal underline-offset-2 hover:underline">Privacy Policy</Link>.
              </li>
            </ul>
          </section>
          <section className="legal-section">
            <h2 className="legal-h2">Technical Support</h2>
            <p>If you encounter any issues, please contact us at <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">support@makemylesson.ai</a>.</p>
          </section>
          <section className="legal-section">
            <h2 className="legal-h2">Contact</h2>
            <p className="mb-3">For any further questions, reach out to:</p>
            <ul className="list-none space-y-1">
              <li><a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">hello@makemylesson.ai</a></li>
              <li><a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">support@makemylesson.ai</a></li>
            </ul>
            <p className="mt-6 text-sm text-white">
              Operated by Skyen Systems Pty Ltd<br />
              Unit 18, 285–287 Derrumat Rd, Hoppers Crossing VIC 3029, Australia
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}


