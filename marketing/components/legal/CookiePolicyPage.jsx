import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function CookiePolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">Cookie Policy</h1>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective: 10 September 2026</span>
            <span className="mt-1 block">Last Updated: 10 September 2026</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. What this policy covers</h2>
            <p className="mb-3">
              This Cookie Policy explains how Skyen Systems Pty Ltd (ACN 701 564 730), operating Make My Lesson, uses
              cookies and similar technologies on makemylesson.ai. It should be read together with our{' '}
              <Link href="/privacy-policy-web" className="text-mml-teal underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              Our iOS and Android apps do not use browser cookies. Where the apps use comparable device-level technology,
              it is limited to what section 3 below describes as strictly necessary.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. What are cookies</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They let a site remember
              information about your visit, such as whether you are signed in.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. Strictly necessary cookies</h2>
            <p className="mb-3">These keep the website working and cannot be switched off. We use them to:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Keep you signed in to your account</li>
              <li>Maintain your session while you move between lesson stages</li>
              <li>Remember security tokens that protect your account</li>
              <li>Balance load across our servers</li>
            </ul>
            <p>
              Without these cookies, you cannot sign in or use the platform. They do not require your consent under
              Australian or UK/EU law, but we list them here for transparency.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Analytics cookies</h2>
            <p className="mb-3">
              We use Firebase Analytics to understand how the platform is used — which features are used, where errors
              occur, and how we can improve reliability. This helps us build a better product; it does not build an
              advertising profile of you.
            </p>
            <p>
              Where your local law requires consent for analytics cookies, we ask for it through the cookie banner on
              your first visit, and you can withdraw it at any time through the cookie settings link in the site footer.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. What we do not use</h2>
            <p>
              We do not use advertising cookies, retargeting pixels, or third-party advertising trackers. We do not sell
              or share cookie data with advertisers.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Third-party cookies</h2>
            <p>
              If you choose to export or share your work to Google Classroom or Microsoft Teams, those services may set
              their own cookies once you reach their site. Those cookies are governed by their own policies, not this
              one.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. Managing cookies</h2>
            <p className="mb-3">
              You can control or delete cookies through your browser settings. Most browsers let you refuse all cookies,
              accept only first-party cookies, or delete cookies already stored. Blocking strictly necessary cookies will
              prevent you from signing in.
            </p>
            <p>
              You can change your analytics cookie preference at any time using the cookie settings link in the site
              footer.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The current version is always published on this page with the
              date it was last updated.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. Contact</h2>
            <p className="mb-1">Skyen Systems Pty Ltd · ACN 701 564 730</p>
            <p className="mb-3">Unit 18, 285–287 Derrimut Rd, Hoppers Crossing VIC 3029, Australia</p>
            <p>
              <a
                href="mailto:support@makemylesson.ai"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                support@makemylesson.ai
              </a>
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}
