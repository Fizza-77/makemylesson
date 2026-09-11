import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
            <span>Mobile Applications Policy</span>
            <span className="text-teal-400/50">·</span>
            <Link
              href="/privacy-policy-web"
              className="text-white underline decoration-teal-400/60 underline-offset-2 hover:text-teal-200"
            >
              Switch to Web Platform Policy &rarr;
            </Link>
          </div>
          <h1 className="legal-article-title">
            Privacy Policy
          </h1>
          <p className="mt-1 text-base font-medium text-slate-300">Make My Lesson</p>
          <p className="legal-article-operator">Operated by: Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective Date: September 10, 2026</span>
            <span className="mt-1 block">Last Updated: September 10, 2026</span>
            <span className="mt-1 block">Version: 1.1</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">Introduction</h2>
            <p className="mb-3">
              Make My Lesson is an educational technology platform operated by Skyen Systems Pty Ltd (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;).
            </p>
            <p className="mb-3">
              We are committed to protecting the privacy, safety, and rights of all users, including teachers, educators,
              institutions, and administrators.
            </p>
            <p className="mb-3">
              This Privacy Policy explains what information we collect, how we use it, how it is shared, how long it is
              retained, and the rights you have regarding your personal data. It covers Make My Lesson accessed through our
              website and web-based services, and it also covers the advertising practices that apply in our mobile
              applications, as described in Section 14.
            </p>
            <p>
              Make My Lesson is designed for professional educational use and is not intended for children or student
              accounts.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">1. Company Information</h2>
            <ul className="mb-4 list-none space-y-2">
              <li>
                <span className="font-medium text-white">Company Name:</span> Skyen Systems Pty Ltd
              </li>
              <li>
                <span className="font-medium text-white">Registered Address:</span> Office 501, Building 1025, Road 3621,
                Block 436, Al-Seef, Australia
              </li>
              <li>
                <span className="font-medium text-white">Registration Number:</span> 190698-1
              </li>
            </ul>
            <p className="mb-2 font-medium text-white">Contact:</p>
            <ul className="list-none space-y-1">
              <li>
                •{' '}
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
              </li>
              <li>
                •{' '}
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. Scope &amp; Compliance</h2>
            <p className="mb-3">This Privacy Policy complies with:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>General Data Protection Regulation (GDPR &amp; UK GDPR)</li>
              <li>UK Age-Appropriate Design Code (where applicable)</li>
              <li>FERPA-aligned principles (where applicable)</li>
              <li>Other applicable international data protection laws</li>
            </ul>
            <p>Make My Lesson does not target children and does not provide accounts for student use.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. Third-Party Services &amp; Firebase Disclosure</h2>
            <p className="mb-3">Make My Lesson uses the following Google services:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Firebase Authentication</li>
              <li>Cloud Firestore</li>
              <li>Firebase Analytics (for platform improvement only)</li>
              <li>Firebase Crashlytics</li>
              <li>Firebase Remote Config</li>
              <li>Google AdMob (third-party advertising in our mobile applications)</li>
            </ul>
            <p className="mb-3">
              Firebase acts as a data processor, and Make My Lesson acts as the data controller.
            </p>
            <p className="mb-3">
              Google AdMob is a separate advertising service provided by Google LLC. In relation to advertising data, Google
              acts as an independent controller and processes that data under its own privacy policy. AdMob is described
              in full in Section 14 (Advertising).
            </p>
            <p className="mb-2">
              Firebase Privacy Policy:{' '}
              <a
                href="https://firebase.google.com/policies/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                https://firebase.google.com/policies/privacy
              </a>
            </p>
            <p className="mb-2">
              Google Privacy Policy (AdMob):{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                https://policies.google.com/privacy
              </a>
            </p>
            <p className="mb-4">
              How Google uses information from sites and apps that use its services:{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                https://policies.google.com/technologies/partner-sites
              </a>
            </p>
            <p className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-4 text-sm text-teal-100">
              <strong className="font-semibold text-white">Important:</strong> No Firebase service is used for advertising.
              Your lesson plans, presentations, assessments, and other generated teaching materials are never shared with
              advertisers or used for behavioural profiling.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Data We Collect</h2>
            <p className="mb-6">
              We collect only the data necessary for platform functionality, improvement, and the delivery of advertising
              where it appears.
            </p>

            <h3 className="legal-h3">4.1 Account &amp; Identifiers</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Email address</li>
              <li>Firebase UID</li>
              <li>User role (e.g., Teacher, Institution)</li>
            </ul>

            <h3 className="legal-h3">4.2 Educational &amp; Generated Content</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Lesson plans</li>
              <li>Presentations</li>
              <li>Classroom activities</li>
              <li>Assessments and mark schemes</li>
              <li>Curriculum selections and preferences</li>
              <li>Saved content and library data</li>
              <li>User preferences and settings</li>
            </ul>

            <h3 className="legal-h3">4.3 Analytics Data</h3>
            <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Page views and navigation patterns</li>
              <li>Feature usage metrics</li>
              <li>Approximate location (country/region only)</li>
            </ul>
            <p className="mb-2 font-medium text-white">Important:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>No precise location data is collected</li>
              <li>No behavioural profiling is carried out by us</li>
              <li>Data is anonymised or aggregated where possible</li>
            </ul>

            <h3 className="legal-h3">4.4 Technical &amp; Device Data</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Browser and device information</li>
              <li>Session identifiers</li>
              <li>Crash logs and diagnostics</li>
            </ul>

            <h3 className="legal-h3">4.5 Subscription &amp; Payment Data (Web)</h3>
            <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Subscription plan and status</li>
              <li>Transaction identifiers</li>
              <li>Subscription start and end dates</li>
              <li>Payment platform used (e.g., Stripe or equivalent)</li>
            </ul>
            <p className="mb-2 font-medium text-white">Important:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Make My Lesson does not store payment card details.</li>
              <li>Payments are processed securely by third-party providers.</li>
            </ul>

            <h3 className="legal-h3">4.6 Advertising Data (via Google AdMob)</h3>
            <p className="mb-3">
              This section applies where advertising is displayed. When an ad is requested or displayed, Google AdMob and
              its ad partners may collect:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                Your device advertising identifier (Google Advertising ID on Android; Identifier for Advertisers (IDFA) on
                iOS, only where you have permitted tracking)
              </li>
              <li>Approximate location derived from IP address (country/region level only)</li>
              <li>
                Device and app information required to render an ad (device model, operating system version, app version,
                screen size, language)
              </li>
              <li>Ad interaction data, such as impressions, clicks, and whether an ad was dismissed</li>
              <li>Limited signals used for frequency capping, ad measurement, and fraud prevention</li>
            </ul>
            <p className="mb-6">
              This data is collected and processed by Google under its own privacy policy. We do not receive your advertising
              identifier, and we do not combine advertising data with your lesson content or saved library materials.
            </p>

            <h3 className="legal-h3">4.7 Data We Do Not Collect</h3>
            <p className="mb-3">We do not collect:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Precise location data</li>
              <li>Phone numbers</li>
              <li>Biometric or sensitive personal data</li>
              <li>Advertising identifiers used to build profiles from your teaching content</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Children &amp; Age Policy</h2>
            <p className="mb-3">Make My Lesson is not intended for children under 13.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>We do not knowingly collect data from children</li>
              <li>We do not provide student accounts</li>
              <li>Advertising is not directed to children and we do not knowingly serve ads to children</li>
              <li>Institutions are responsible for ensuring appropriate use</li>
              <li>If we become aware that data from a child has been collected, we will delete it.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Cookies &amp; Similar Technologies</h2>
            <p className="mb-3">Make My Lesson may use cookies or similar technologies for:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Authentication and session management</li>
              <li>Saving user preferences</li>
              <li>Analytics and performance improvement</li>
              <li>Delivering and measuring advertising, where advertising is shown</li>
            </ul>
            <p className="mb-3">
              Google AdMob and its ad partners may use cookies, mobile advertising identifiers, tracking pixels, or similar
              technologies to deliver and measure advertising, as described in Section 14.
            </p>
            <p className="mb-3">
              Users can control cookies through browser settings and can control advertising identifiers through device
              settings.
            </p>
            <p>
              For full details, please refer to our{' '}
              <Link href="/cookie-policy" className="text-mml-teal underline-offset-2 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. How We Use Your Data</h2>
            <p className="mb-3">We use data to:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Provide and maintain platform functionality</li>
              <li>Generate and manage teaching materials</li>
              <li>Authenticate users</li>
              <li>Improve platform performance</li>
              <li>Manage subscriptions</li>
              <li>Serve and measure third-party advertising where it appears</li>
              <li>Detect and resolve technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>We do not use your lesson plans, presentations, assessments, or other generated teaching content for advertising or marketing.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Data Sharing</h2>
            <p className="mb-3">We do not sell personal data.</p>
            <p className="mb-3">Data is shared only:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>With service providers (e.g., Firebase, payment processors)</li>
              <li>With Google AdMob and its ad partners, limited to the advertising data described in Section 4.6</li>
              <li>When legally required</li>
              <li>During business restructuring (with safeguards)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. International Transfers &amp; Data Storage</h2>
            <p className="mb-3">
              Data may be stored on servers outside your country, including the United States. Advertising data is processed
              by Google on its global infrastructure.
            </p>
            <p className="mb-3">We use:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Industry-standard security practices</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. Data Retention</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong className="font-medium text-white">Active accounts:</strong> Retained while in use
              </li>
              <li>
                <strong className="font-medium text-white">Inactive accounts:</strong> Deleted after 2 years
              </li>
              <li>
                <strong className="font-medium text-white">Legal and financial records:</strong> Retained as required by law
              </li>
              <li>
                <strong className="font-medium text-white">Advertising data:</strong> Retained by Google in line with its own
                retention policies
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">11. User Rights</h2>
            <p className="mb-3">You may request:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Access to your data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Data portability</li>
              <li>Withdrawal of consent to personalised advertising at any time</li>
            </ul>
            <p className="mb-2 font-medium text-white">Requests can be made via:</p>
            <ul className="list-none space-y-1">
              <li>
                •{' '}
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
              </li>
              <li>
                •{' '}
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">12. Account Deletion</h2>
            <p className="mb-3">You may request deletion by:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Using in-app settings (if available), or</li>
              <li>Contacting us via email</li>
            </ul>
            <p className="mb-3">We will:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Verify your identity</li>
              <li>Process deletion within 30 days</li>
              <li>Retain only legally required data</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">13. Analytics Controls</h2>
            <p className="mb-3">You may opt out of non-essential analytics by:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Adjusting browser or device settings</li>
              <li>Contacting support</li>
            </ul>
            <p>Declining analytics does not affect platform functionality.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">14. Advertising</h2>
            <p className="mb-4">
              Make My Lesson displays third-party advertisements through Google AdMob, a service provided by Google LLC.
              Advertising allows us to keep the free tier of Make My Lesson available at no cost. Advertising is not shown
              to paid subscribers where their plan removes ads.
            </p>

            <h3 className="legal-h3">Advertising and rewarded ads</h3>
            <p className="mb-4">
              On our Free plan, you may choose to watch a short video advertisement, served by{' '}
              <strong className="font-semibold text-white">Google AdMob</strong>, to unlock one additional generation credit.
              This is optional — declining never restricts access to credits already earned or purchased. Standard AdMob ad
              serving applies, which may include personalised advertising based on your device&apos;s advertising identifier.
              You can reset or limit ad personalisation through your device&apos;s settings.
            </p>

            <h3 className="legal-h3">14.1 Who Serves the Ads</h3>
            <p className="mb-4">
              Ads are served by Google AdMob and its authorised ad partners. In relation to advertising, Google acts as an
              independent data controller and processes data under its own privacy policy. We do not control which specific
              ads are shown to you, and we do not receive your advertising identifier.
            </p>

            <h3 className="legal-h3">14.2 What Advertising Data Is Collected</h3>
            <p className="mb-4">
              The advertising data collected is set out in Section 4.6. In summary: a device advertising identifier,
              approximate (country/region) location derived from IP address, basic device and app information needed to render
              an ad, and ad interaction data such as impressions and clicks.
            </p>

            <h3 className="legal-h3">14.3 Personalised and Non-Personalised Ads</h3>
            <p className="mb-3">
              Where required by law — including in the European Economic Area, the United Kingdom, and Switzerland — we
              present a consent prompt using Google&apos;s User Messaging Platform (UMP) before any ads are loaded.
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                If you decline, only non-personalised ads are served. Non-personalised ads are based on contextual signals
                such as the general content of the screen and approximate location, together with a limited identifier used
                for frequency capping, ad measurement, and fraud prevention.
              </li>
              <li>
                If you consent, ads may be personalised using information Google holds about you across its services and
                partner apps.
              </li>
            </ul>
            <p className="mb-4">
              You may change or withdraw your choice at any time through the privacy options available in the app or website
              settings, or by contacting{' '}
              <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                support@makemylesson.ai
              </a>
              .
            </p>

            <h3 className="legal-h3">14.4 Your Device and Browser Controls</h3>
            <p className="mb-3">You can limit ad personalisation directly:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong className="font-medium text-white">Android:</strong> Settings → Privacy → Ads → Delete or reset your
                advertising ID
              </li>
              <li>
                <strong className="font-medium text-white">iOS:</strong> Settings → Privacy &amp; Security → Tracking → turn off
                &quot;Allow Apps to Request to Track&quot;
              </li>
              <li>
                <strong className="font-medium text-white">Web:</strong> control cookies through your browser settings
              </li>
            </ul>

            <h3 className="legal-h3">14.5 What We Do Not Do</h3>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>We do not share your lesson plans, presentations, assessments, or saved library content with advertisers</li>
              <li>We do not sell your personal data</li>
              <li>We do not direct advertising to children</li>
              <li>We do not use sensitive personal data for advertising</li>
            </ul>
            <p className="mb-4">
              For more information, see Google&apos;s Privacy Policy at{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                https://policies.google.com/privacy
              </a>{' '}
              and how Google uses information from sites and apps that use its services at{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                https://policies.google.com/technologies/partner-sites
              </a>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">15. Changes to This Policy</h2>
            <p className="mb-3">We may update this Privacy Policy periodically.</p>
            <p className="mb-3">Material changes may be communicated via the platform or email.</p>
            <p>Continued use constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">16. Contact</h2>
            <p className="mb-3">For privacy-related questions or requests:</p>
            <ul className="list-none space-y-1">
              <li>
                •{' '}
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
              </li>
              <li>
                •{' '}
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-slate-300">
              Operated by Skyen Systems Pty Ltd — Australia
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}


