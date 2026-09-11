import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function CookiePolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">
            Cookie Policy
          </h1>
          <p className="legal-article-operator">Operated by Qismat Ventures W.L.L</p>
          <p className="legal-article-meta">
            <span className="block">Effective Date: [To be set]</span>
            <span className="mt-1 block">Last Updated: [To be set]</span>
          </p>
        </header>

        <div className="legal-article-body">
          <p>
            This Cookie Policy explains what cookies and similar technologies are, how Make My Lesson uses them across its
            website and web-based services, and what controls you have over them. It should be read alongside our{' '}
            <Link href="/privacy-policy-web" className="text-mml-teal underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            Make My Lesson is operated by Qismat Ventures W.L.L, a company registered in the Kingdom of Bahrain (Registration
            No. 190698-1).
          </p>

          <section className="legal-section">
            <h2 className="legal-h2">1. What Are Cookies?</h2>
            <p className="mb-3">
              Cookies are small text files placed on your device (computer, tablet, or phone) when you visit a website.
            </p>
            <p className="mb-3">They allow the platform to:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Recognise your device</li>
              <li>Maintain your session</li>
              <li>Remember preferences</li>
              <li>Improve performance and usability</li>
            </ul>
            <p className="mb-3">Similar technologies include:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Local storage</li>
              <li>Session identifiers</li>
              <li>Persistent identifiers (e.g., Firebase UID)</li>
            </ul>
            <p className="mt-3">For simplicity, we refer to all of these as &quot;cookies.&quot;</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. How Make My Lesson Uses Cookies</h2>
            <p className="mb-3">We use cookies only for essential functionality and platform improvement.</p>
            <p className="mb-4">We do not use cookies for advertising, behavioural tracking, or profiling.</p>

            <h3 className="legal-h3">2.1 Strictly Necessary Cookies</h3>
            <p className="mb-3">These cookies are essential for the platform to function.</p>
            <p className="mb-3">Examples:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Authentication (keeping you logged in via Firebase Authentication)</li>
              <li>Security (preventing misuse and fraud)</li>
              <li>Session management (maintaining platform stability)</li>
            </ul>
            <p className="mb-6">These cookies cannot be disabled without affecting core functionality.</p>

            <h3 className="legal-h3">2.2 Functional Cookies</h3>
            <p className="mb-3">These cookies improve user experience by remembering preferences.</p>
            <p className="mb-3">Examples:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Curriculum and subject selections</li>
              <li>Preferred settings and configurations</li>
              <li>Saved user preferences</li>
            </ul>
            <p className="mb-6">Where required by law, we request consent before enabling these cookies.</p>

            <h3 className="legal-h3">2.3 Analytics Cookies</h3>
            <p className="mb-3">We use Firebase Analytics to understand how users interact with the platform.</p>
            <p className="mb-3">Data collected may include:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Page views and navigation patterns</li>
              <li>Feature usage (e.g., lesson generation stages)</li>
              <li>Engagement with platform tools</li>
              <li>Approximate location (country/region only)</li>
            </ul>
            <p className="mb-2 font-semibold text-white">Important:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Data is anonymised or aggregated where possible</li>
              <li>No advertising or profiling use</li>
              <li>No precise location tracking</li>
            </ul>
            <p>Analytics cookies are used only to improve platform performance.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. Third-Party Cookies</h2>
            <p className="mb-3">
              Make My Lesson uses Google Firebase, which may set or read cookies as part of its services.
            </p>
            <p className="mb-3">
              Firebase Privacy Policy:{' '}
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                https://firebase.google.com/support/privacy
              </a>
            </p>
            <p className="mb-3">These cookies are used solely for:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Authentication</li>
              <li>Analytics</li>
              <li>Platform performance</li>
            </ul>
            <p className="mb-3">We do not allow:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Advertising networks</li>
              <li>Social media tracking</li>
              <li>Data brokers</li>
            </ul>
            <p className="mt-3">to place cookies on our platform.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Subscription &amp; Payment Cookies</h2>
            <p className="mb-3">For web-based payments (e.g., via Paddle or equivalent providers):</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Payment providers may set necessary cookies for secure transactions</li>
              <li>These cookies are limited strictly to payment functionality</li>
              <li>No marketing or tracking use is involved</li>
            </ul>
            <p className="mt-3">App store purchases (Apple/Google) are handled externally and do not involve website cookies.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Cookie Duration</h2>
            <p className="mb-4">Cookies fall into two categories:</p>

            <h3 className="legal-h3">Session Cookies</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Temporary</li>
              <li>Expire when you close your browser</li>
              <li>Used for login and session management</li>
            </ul>

            <h3 className="legal-h3">Persistent Cookies</h3>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Remain for a defined period</li>
              <li>Used for analytics and preferences</li>
              <li>Retained only as long as necessary</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Your Cookie Choices &amp; Controls</h2>
            <p className="mb-4">You can control cookies in several ways:</p>

            <h3 className="legal-h3">6.1 Browser Settings</h3>
            <p className="mb-3">You can:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Block all cookies</li>
              <li>Delete existing cookies</li>
              <li>Restrict specific cookie types</li>
            </ul>
            <p className="mb-6">Note: Disabling essential cookies may affect platform functionality.</p>

            <h3 className="legal-h3">6.2 Analytics Opt-Out</h3>
            <p className="mb-3">You may opt out of analytics by:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Adjusting browser or device privacy settings</li>
              <li>Contacting us directly</li>
            </ul>
            <p className="mb-6">Declining analytics cookies does not affect access to platform features.</p>

            <h3 className="legal-h3">6.3 Device-Level Controls (Mobile)</h3>
            <p className="mb-3">On mobile devices, similar tracking technologies may be controlled via:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>iOS: Settings → Privacy &amp; Security</li>
              <li>Android: Settings → Privacy</li>
            </ul>
            <p className="mt-3">Refer to platform privacy settings for more control.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. Children&apos;s Cookie Use</h2>
            <p className="mb-3">Make My Lesson is not intended for children.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>We do not use cookies for children&apos;s profiling</li>
              <li>We do not allow advertising cookies</li>
              <li>We do not knowingly collect data from children</li>
            </ul>
            <p className="mt-3">If such data is identified, it will be deleted.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Legal Basis for Cookie Use</h2>
            <p className="mb-3">Where applicable under GDPR and similar laws:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Strictly necessary cookies → Legitimate interest (required for service)</li>
              <li>Functional and analytics cookies → Consent-based</li>
            </ul>
            <p>We provide clear mechanisms for users to manage consent.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. Changes to This Cookie Policy</h2>
            <p className="mb-3">We may update this Cookie Policy from time to time.</p>
            <p className="mb-3">Material changes will be communicated via the platform or email.</p>
            <p>Continued use constitutes acceptance of updates.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. Contact</h2>
            <p className="mb-3">For questions about cookies:</p>
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
