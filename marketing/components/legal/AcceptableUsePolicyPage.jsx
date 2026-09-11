import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function AcceptableUsePolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">Acceptable Use Policy</h1>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective: 10 September 2026</span>
            <span className="mt-1 block">Last Updated: 10 September 2026</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. Purpose</h2>
            <p>
              This Acceptable Use Policy sets out what you may and may not do on Make My Lesson. It forms part of our{' '}
              <Link href="/terms-of-service" className="text-mml-teal underline-offset-2 hover:underline">
                Terms of Service
              </Link>{' '}
              and applies to everyone who uses the website or apps, whether on a free, paid, or institutional account.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. Using the platform lawfully and appropriately</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Use the platform for any unlawful purpose, or in a way that breaches any applicable law or regulation</li>
              <li>
                Generate or attempt to generate content that is abusive, discriminatory, harassing, sexually explicit, or
                otherwise inappropriate for a school environment
              </li>
              <li>
                Enter personal information identifying individual students into lesson topics, instructions or refinement
                requests — see section 7 of our{' '}
                <Link href="/privacy-policy-web" className="text-mml-teal underline-offset-2 hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>Use the platform to bully, harass, or target any person or group</li>
              <li>Upload or generate content that infringes someone else&apos;s intellectual property or other rights</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. Protecting the platform</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Attempt to gain unauthorised access to any account, system or data</li>
              <li>Interfere with or disrupt the platform, its servers, or the networks connected to it</li>
              <li>
                Use automated systems, scripts, or bots to access the platform or generate content at scale, except where
                we have agreed this with you in writing
              </li>
              <li>Attempt to reverse engineer, decompile, or extract the underlying models or systems behind the platform</li>
              <li>Probe, scan or test the vulnerability of our systems without our prior written permission</li>
              <li>Circumvent or attempt to circumvent credit limits, plan restrictions, or account controls</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Account and licence use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Share your account login with another person</li>
              <li>Create multiple free accounts to obtain more free credits than intended for one person</li>
              <li>Use a school or department seat that was not allocated to you</li>
              <li>Impersonate another person or misrepresent your affiliation with a school or institution</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Generated content</h2>
            <p className="mb-3">
              You are responsible for reviewing all AI-generated material before using it in a classroom, in line with
              section 4 of our{' '}
              <Link href="/terms-of-service" className="text-mml-teal underline-offset-2 hover:underline">
                Terms of Service
              </Link>
              . You must not present AI-generated content as independently verified against a specific exam board or
              curriculum authority without checking it yourself.
            </p>
            <p>You must not use the platform to mass-produce content for resale as a competing product or service.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Reporting a concern</h2>
            <p>
              If you believe another user is misusing the platform, or you have found a security issue, email{' '}
              <a
                href="mailto:support@makemylesson.ai"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                support@makemylesson.ai
              </a>
              . We take reports seriously and will investigate.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. What happens if this policy is breached</h2>
            <p>
              Depending on the nature and seriousness of the breach, we may issue a warning, restrict features, suspend
              your account, or terminate it, as set out in section 10 of our{' '}
              <Link href="/terms-of-service" className="text-mml-teal underline-offset-2 hover:underline">
                Terms of Service
              </Link>
              . Where a subscription was purchased through the App Store or Google Play, any refund following termination
              is subject to that platform&apos;s policies, not ours.
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
