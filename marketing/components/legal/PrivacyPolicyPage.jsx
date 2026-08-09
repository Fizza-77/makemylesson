import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">
            Privacy Policy (Web Version)
          </h1>
          <p className="legal-article-operator">Operated by Qismat Ventures W.L.L</p>
          <p className="legal-article-meta">
            <span className="block">Effective Date: [To be set]</span>
            <span className="mt-1 block">Last Updated: [To be set]</span>
            <span className="mt-1 block">Version: 1.0 (Web Version)</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">Introduction</h2>
            <p className="mb-3">
              Make My Lesson is an educational technology platform operated by Qismat Ventures W.L.L (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;).
            </p>
            <p className="mb-3">
              We are committed to protecting the privacy, safety, and rights of all users, including teachers, educators,
              institutions, and administrators.
            </p>
            <p className="mb-3">
              This Privacy Policy applies to users who access and use Make My Lesson through our website and web-based
              services. It explains what information we collect, how we use it, how it is shared, how long it is retained,
              and the rights you have regarding your personal data.
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
                <span className="font-medium text-white">Company Name:</span> Qismat Ventures W.L.L
              </li>
              <li>
                <span className="font-medium text-white">Registered Address:</span> Office 501, Building 1025, Road 3621,
                Block 436, Al-Seef, Kingdom of Bahrain
              </li>
              <li>
                <span className="font-medium text-white">Registration Number:</span> 190698-1
              </li>
            </ul>
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
            <p className="mb-3">Make My Lesson uses the following Google Firebase services:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Firebase Authentication</li>
              <li>Cloud Firestore</li>
              <li>Firebase Analytics (for platform improvement only)</li>
              <li>Firebase Crashlytics</li>
              <li>Firebase Remote Config</li>
            </ul>
            <p className="mb-3">Firebase acts as a data processor, and Make My Lesson acts as the data controller.</p>
            <p className="mb-3">
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
            <p>No data is used for advertising or behavioural profiling.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Data We Collect</h2>
            <p className="mb-6">We collect only the data necessary for platform functionality and improvement.</p>

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
              <li>No advertising or behavioural tracking</li>
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
              <li>Payment platform used (e.g., Paddle or equivalent)</li>
            </ul>
            <p className="mb-2 font-medium text-white">Important:</p>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Make My Lesson does not store payment card details.</li>
              <li>Payments are processed securely by third-party providers.</li>
            </ul>

            <h3 className="legal-h3">4.6 Data We Do NOT Collect</h3>
            <p className="mb-3">We do not collect:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Precise location data</li>
              <li>Phone numbers</li>
              <li>Advertising identifiers</li>
              <li>Biometric or sensitive personal data</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Children &amp; Age Policy</h2>
            <p className="mb-3">Make My Lesson is not intended for children under 13.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>We do not knowingly collect data from children</li>
              <li>We do not provide student accounts</li>
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
            </ul>
            <p className="mb-3">Users can control cookies through browser settings.</p>
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
            <p className="mb-3">We use data only to:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Provide and maintain platform functionality</li>
              <li>Generate and manage teaching materials</li>
              <li>Authenticate users</li>
              <li>Improve platform performance</li>
              <li>Manage subscriptions</li>
              <li>Detect and resolve technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>We do not use data for advertising or marketing.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Data Sharing</h2>
            <p className="mb-3">We do not sell personal data.</p>
            <p className="mb-3">Data is shared only:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>With service providers (e.g., Firebase, payment processors)</li>
              <li>When legally required</li>
              <li>During business restructuring (with safeguards)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. International Transfers &amp; Data Storage</h2>
            <p className="mb-3">Data may be stored on servers outside your country, including the United States.</p>
            <p className="mb-3">We use:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Industry-standard security practices</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. Data Retention</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Active accounts → retained while in use</li>
              <li>Inactive accounts → deleted after 2 years</li>
              <li>Legal and financial records → retained as required by law</li>
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
            </ul>
            <p className="mb-3">Requests can be made via:</p>
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
            <h2 className="legal-h2">14. Changes to This Policy</h2>
            <p className="mb-3">We may update this Privacy Policy periodically.</p>
            <p className="mb-3">Material changes may be communicated via the platform or email.</p>
            <p>Continued use constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">15. Contact</h2>
            <p className="mb-3">For privacy-related questions or requests:</p>
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
              Kingdom of Bahrain
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}
