import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function WebPrivacyPolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
            <span>Web Platform Policy</span>
            <span className="text-teal-400/50">·</span>
            <Link
              href="/privacy-policy"
              className="text-white underline decoration-teal-400/60 underline-offset-2 hover:text-teal-200"
            >
              Switch to Mobile Applications Policy &rarr;
            </Link>
          </div>
          <h1 className="legal-article-title">
            Privacy Policy
          </h1>
          <p className="mt-1 text-base font-medium text-slate-300">Make My Lesson</p>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective: 10 September 2026 · Last updated: 10 September 2026</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. Who we are</h2>
            <p className="mb-3">
              Make My Lesson is an AI lesson-planning platform for teachers, operated by Skyen Systems Pty Ltd (ACN 701 564
              730 · ABN 19 701 564 730), a company registered in Victoria, Australia.
            </p>
            <p className="mb-3">
              Skyen Systems Pty Ltd is responsible for the personal information described in this policy. We handle personal
              information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles.
            </p>
            <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="font-semibold text-white">Skyen Systems Pty Ltd</p>
              <p className="text-slate-300">
                Unit 18, 285–287 Derrimut Rd
                <br />
                Hoppers Crossing VIC 3029
                <br />
                Australia
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <span className="text-slate-400">Privacy and data requests:</span>{' '}
                  <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                    support@makemylesson.ai
                  </a>
                </p>
                <p>
                  <span className="text-slate-400">General enquiries:</span>{' '}
                  <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                    hello@makemylesson.ai
                  </a>
                </p>
              </div>
            </div>
            <p>
              Our iOS and Android apps are published on the App Store and Google Play by Skyen Solutions, a trade name of
              Skyen Systems Pty Ltd. Regardless of whether you use the website or an app, and regardless of where you bought
              a subscription, Skyen Systems Pty Ltd operates the platform, holds your account and your lesson content, and is
              responsible for your personal information under this policy.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. What this policy covers</h2>
            <p className="mb-3">
              This policy applies to makemylesson.ai, the Make My Lesson iOS and Android applications, and any communication
              you have with us by email.
            </p>
            <p>
              It does not cover third-party services you choose to connect to or export into, such as Google Classroom or
              Microsoft Teams. Those services handle your information under their own privacy policies.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. What we collect</h2>
            <h3 className="legal-h3">Information you give us</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong className="font-medium text-white">Account details</strong> — your name, email address, and password
                (stored in encrypted form, never in plain text)
              </li>
              <li>
                <strong className="font-medium text-white">Teaching profile</strong> — the curriculum family and route you
                teach, year or grade levels, subjects, and any saved preferences
              </li>
              <li>
                <strong className="font-medium text-white">Lesson inputs</strong> — the topic, subject, grade, duration,
                teaching method and any other instructions or text you provide when generating a lesson
              </li>
              <li>
                <strong className="font-medium text-white">Refinement requests</strong> — the messages you send to Ayla, our
                teaching assistant
              </li>
              <li>
                <strong className="font-medium text-white">Institutional details</strong> — where you subscribe as part of a
                school or department plan, your school or organisation name and your role
              </li>
              <li>
                <strong className="font-medium text-white">Correspondence</strong> — the content of emails and support
                requests you send us
              </li>
            </ul>

            <h3 className="legal-h3">Information created by your use of the platform</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong className="font-medium text-white">Generated content</strong> — the lesson plans, presentations,
                slide images, classroom activities, worksheets, answer keys, assessments and mark schemes produced for you
              </li>
              <li>
                <strong className="font-medium text-white">Account activity</strong> — your generation history, favourites,
                saved packs, credit balance and credit usage
              </li>
              <li>
                <strong className="font-medium text-white">Subscription records</strong> — which plan you are on, when it
                started and renews, and whether you bought on the web or through an app store
              </li>
            </ul>

            <h3 className="legal-h3">Information collected automatically</h3>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong className="font-medium text-white">Technical information</strong> — IP address, browser type and
                version, operating system, device type, and time zone
              </li>
              <li>
                <strong className="font-medium text-white">Usage information</strong> — pages and screens visited, features
                used, and dates and times of access
              </li>
              <li>
                <strong className="font-medium text-white">Consent records</strong> — where you subscribe on our website, we
                record the date, time, IP address, plan, price and the version of the policies you accepted
              </li>
            </ul>

            <h3 className="legal-h3">What we do not collect</h3>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                We do not collect or store your full card number. Payments on our website are handled entirely by Stripe.
                Payments in our apps are handled entirely by Apple or Google.
              </li>
              <li>We do not create student accounts and do not knowingly collect information directly from children.</li>
              <li>We do not buy personal information from data brokers or third-party lists.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. How we collect it</h2>
            <p className="mb-3">
              We collect personal information directly from you — when you create an account, complete your teaching profile,
              generate lessons, contact Ayla, subscribe, or email us.
            </p>
            <p className="mb-3">
              We collect technical and usage information automatically when you use the website or apps.
            </p>
            <p>
              Where you subscribe through the App Store or Google Play, we receive confirmation of your subscription status
              from Apple or Google so that we can apply your credits. We do not receive your payment details from them.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Why we use it</h2>
            <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full border-collapse text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="p-3 sm:p-4 font-semibold text-white">Purpose</th>
                    <th className="p-3 sm:p-4 font-semibold text-white">What that involves</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Providing the service</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Creating and maintaining your account, generating your teaching packs, saving your history and
                      favourites, and letting you export and share your work
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Personalising output</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Applying your curriculum route, year level and teaching preferences so generated material fits your
                      classroom
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Managing credits and plans</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Tracking and enforcing the credit allowance attached to your plan, and applying credits from app store
                      subscriptions
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Billing</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Taking payment, issuing receipts, sending renewal reminders, and handling failed payments, refunds and
                      disputes
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Support</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Responding to your questions and investigating problems you report
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Improving the platform</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Understanding which features are used, diagnosing errors, and improving reliability and quality
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Security</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Detecting and preventing fraud, abuse, and unauthorised access
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Legal obligations</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Meeting our tax, accounting and record-keeping obligations, and responding to lawful requests
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mb-3">
              We do not sell personal information. We do not use your lesson content or your correspondence to send you
              marketing about unrelated products.
            </p>
            <p>
              We may send you service messages you cannot opt out of while you hold an account — receipts, renewal
              reminders, failed payment notices, security alerts and material changes to these terms. Any marketing email we
              send will include an unsubscribe link, and unsubscribing will not affect your access to the service.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. How AI processing works</h2>
            <p className="mb-3">
              Make My Lesson generates teaching material using artificial intelligence. When you request a generation, the
              inputs you provide — your topic, subject, grade, duration, teaching method and any instructions — are sent to
              third-party AI model providers to produce the output. These providers are located in the United States.
            </p>
            <p className="mb-3">
              We instruct our AI providers not to use your inputs or outputs to train their models. We do not send your name,
              email address or account identifiers to AI providers alongside your lesson inputs.
            </p>
            <p className="mb-3">
              Slide images are generated by AI image models on the same basis.
            </p>
            <p>
              AI-generated material can contain errors. You remain responsible for reviewing and approving everything before
              classroom use, as set out in our Terms of Service. That is a quality point rather than a privacy one, but it
              matters, so we repeat it here.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. Lesson content and student information</h2>
            <p className="mb-3">
              Make My Lesson is built for teachers and institutions. It is not designed for students, and we do not create
              student accounts.
            </p>
            <p className="mb-3">
              Please do not enter student names or other information identifying individual students into lesson topics,
              instructions or refinement requests. The platform does not need it, and generated material works just as well
              without it.
            </p>
            <p className="mb-3">
              If you do include student information, you are responsible for ensuring you have the right to do so under your
              school&apos;s policies and the privacy law that applies to you. We will treat it as your content, will not use
              it for any purpose other than delivering your generation, and will delete it when you delete the associated
              pack or your account.
            </p>
            <p>
              Your generated content belongs to you. We do not publish it, share it with other users, or use it to train AI
              models.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Who we share it with</h2>
            <p className="mb-3">
              We share personal information only where it is necessary to run the platform, and only with the following
              categories of recipient:
            </p>
            <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full border-collapse text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="p-3 sm:p-4 font-semibold text-white">Recipient</th>
                    <th className="p-3 sm:p-4 font-semibold text-white">What they receive and why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Google Firebase</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Authentication, database storage, file storage and analytics. Holds account details, teaching profile,
                      generated content and usage data.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">AI model providers</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Your lesson inputs and refinement requests, in order to generate output. See section 6.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Stripe Payments Australia Pty Ltd</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Payment processing for website subscriptions. Receives your email address and payment details, which it
                      handles under its own privacy policy.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Apple and Google</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Payment processing and subscription management for purchases made inside our apps, under their own
                      privacy policies.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Google Classroom and Microsoft Teams</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Only the specific material you choose to export or share, at the moment you choose to share it.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Hosting and email providers</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Operating the website and sending transactional email.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Skyen Solutions (Skyen Systems Pty Ltd.)</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Our group companies provide engineering, design and support services. Staff access is limited to what is
                      needed to build, maintain and support the platform.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Professional advisers</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Our accountants and lawyers, where necessary and under a duty of confidence.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Authorities</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Where we are required to disclose information by law, or to protect our rights, the safety of users, or
                      the integrity of the platform.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              If Skyen Systems Pty Ltd is ever sold, merged, or transfers this business to another entity, personal information
              may be transferred as part of that transaction. We will notify you by email before any such transfer takes
              effect, and the receiving entity will be bound by a privacy policy no less protective than this one.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. Overseas disclosure</h2>
            <p className="mb-3">
              Australian Privacy Principle 8 requires us to tell you where your personal information may go. We may disclose
              personal information to service providers located outside Australia, including in:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong className="font-medium text-white">United States</strong> — Google Firebase, AI model providers,
                Google Classroom, Microsoft Teams, Apple, Google
              </li>
              <li>
                <strong className="font-medium text-white">Ireland and the European Union</strong> — certain Stripe and
                hosting operations
              </li>
              <li>
                <strong className="font-medium text-white">Pakistan and Bahrain</strong> — our group engineering, design and
                support teams
              </li>
            </ul>
            <p>
              Where we disclose personal information overseas, we take reasonable steps to ensure the recipient handles it in
              a way consistent with the Australian Privacy Principles, including through written agreements and access
              controls.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. Cookies and analytics</h2>
            <p className="mb-3">
              We use cookies and similar technologies that are necessary for the platform to work — keeping you signed in,
              remembering your session, and maintaining security.
            </p>
            <p className="mb-3">
              We also use analytics tools, including Firebase Analytics, to understand how the platform is used and where it can
              be improved. This tells us which features are used and where errors occur. It is not used to build advertising
              profiles, and we do not run advertising cookies or third-party advertising trackers.
            </p>
            <p>
              You can control cookies through your browser settings. Blocking necessary cookies will prevent you from signing
              in. For full details, see our{' '}
              <Link href="/cookie-policy" className="text-mml-teal underline-offset-2 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">11. Security</h2>
            <p className="mb-3">
              We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised
              access, modification or disclosure. These include encryption of data in transit, encrypted password storage,
              access controls limiting staff access to what their role requires, and regular review of who holds access.
            </p>
            <p>
              No system is completely secure and we cannot guarantee absolute security. If a data breach occurs that is likely
              to result in serious harm, we will notify affected users and the Office of the Australian Information
              Commissioner as required by the Notifiable Data Breaches scheme.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">12. How long we keep it</h2>
            <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full border-collapse text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="p-3 sm:p-4 font-semibold text-white">Information</th>
                    <th className="p-3 sm:p-4 font-semibold text-white">Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Account details and teaching profile</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      While your account is open, then deleted within 30 days of account deletion
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Generated packs, history and favourites</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      While your account is open, or until you delete them, then deleted within 30 days of account deletion
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Lesson inputs sent to AI providers</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Not retained by us beyond generation; retained briefly by providers under their own policies for abuse
                      monitoring
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Billing and transaction records</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Seven years from the transaction, as required by Australian tax and corporate record-keeping law
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Consent records for subscriptions</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Seven years, for dispute and chargeback evidence
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Support correspondence</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Two years from the last message
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Analytics and technical logs</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Up to 24 months, in aggregated or de-identified form where possible
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Where we are required to keep records after you delete your account — billing records in particular — we retain
              only what the law requires and nothing else.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">13. Your rights</h2>
            <p className="mb-3">You may:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Access the personal information we hold about you</li>
              <li>Correct anything that is inaccurate or out of date — most of this you can do yourself in your account settings</li>
              <li>Delete your account and the personal information associated with it</li>
              <li>Export your generated packs at any time, using the PDF, PowerPoint and ZIP download options built into the platform</li>
              <li>Object or restrict — ask us to stop or limit a particular use of your information</li>
            </ul>
            <p className="mb-3">
              Email{' '}
              <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                support@makemylesson.ai
              </a>
              . We will respond within 30 days. We may need to verify your identity first. If we cannot action a request in full
              — for example where we must keep billing records by law — we will tell you why.
            </p>
            <p className="mb-3">
              Deleting your account does not automatically cancel a subscription bought through the App Store or Google Play.
              Cancel those in your Apple or Google account settings.
            </p>
            <p>
              There is no charge for making a request. If a request is manifestly unfounded or excessive, particularly if
              repetitive, we may charge a reasonable fee or decline to act, and will explain our reasons.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">14. If you are in the UK or European Economic Area</h2>
            <p className="mb-3">
              Where the UK GDPR or EU GDPR applies to you, Skyen Systems Pty Ltd is the data controller, and we rely on the
              following legal bases:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <strong className="font-medium text-white">Performance of a contract</strong> — providing the platform,
                generating your material, managing your subscription and providing support
              </li>
              <li>
                <strong className="font-medium text-white">Legitimate interests</strong> — improving and securing the platform,
                preventing fraud and abuse, and defending legal claims. We have balanced these against your rights and consider
                them proportionate.
              </li>
              <li>
                <strong className="font-medium text-white">Legal obligation</strong> — tax, accounting and record-keeping
                requirements
              </li>
              <li>
                <strong className="font-medium text-white">Consent</strong> — for optional analytics where required by your
                local law, and for any marketing email. You can withdraw consent at any time.
              </li>
            </ul>
            <p className="mb-3">
              You also have the right to data portability, and the right to lodge a complaint with your local supervisory
              authority — in the UK, the Information Commissioner&apos;s Office at{' '}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                ico.org.uk
              </a>
              .
            </p>
            <p>
              Where we transfer personal information out of the UK or EEA, we rely on Standard Contractual Clauses or an
              equivalent lawful transfer mechanism.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">15. Children</h2>
            <p className="mb-3">
              Make My Lesson is intended for teachers, schools and institutions. It is not directed at children, and you must
              be at least 18 years old to hold an account.
            </p>
            <p>
              We do not knowingly collect personal information from children. If you believe a child has provided us with
              personal information, email{' '}
              <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                support@makemylesson.ai
              </a>{' '}
              and we will delete it.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">16. Changes to this policy</h2>
            <p className="mb-3">
              We may update this policy from time to time. The current version is always published on this page with the date
              it was last updated.
            </p>
            <p>
              Where a change materially affects how we handle your personal information, we will notify you by email at least
              30 days before it takes effect.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">17. Complaints</h2>
            <p className="mb-3">
              If you believe we have mishandled your personal information, contact us first at{' '}
              <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                support@makemylesson.ai
              </a>
              . We will acknowledge your complaint within 5 business days and give you a substantive response within 30 days.
            </p>
            <p className="mb-3">
              If you are not satisfied with our response, you may complain to the Office of the Australian Information
              Commissioner (OAIC):
            </p>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300 space-y-1">
              <p>
                <span className="text-slate-400">Website:</span>{' '}
                <a
                  href="https://www.oaic.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mml-teal underline-offset-2 hover:underline"
                >
                  oaic.gov.au
                </a>
              </p>
              <p>
                <span className="text-slate-400">Phone:</span> 1300 363 992
              </p>
              <p>
                <span className="text-slate-400">Post:</span> GPO Box 5218, Sydney NSW 2001, Australia
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">18. Contact us</h2>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300 space-y-2">
              <p className="font-semibold text-white">Skyen Systems Pty Ltd</p>
              <p>ACN 701 564 730 · ABN 19 701 564 730</p>
              <p>
                Unit 18, 285–287 Derrimut Rd
                <br />
                Hoppers Crossing VIC 3029
                <br />
                Australia
              </p>
              <div className="pt-2 border-t border-white/10 space-y-1">
                <p>
                  <span className="text-slate-400">Privacy and data requests:</span>{' '}
                  <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                    support@makemylesson.ai
                  </a>
                </p>
                <p>
                  <span className="text-slate-400">General enquiries:</span>{' '}
                  <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                    hello@makemylesson.ai
                  </a>
                </p>
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              Make My Lesson · Privacy Policy · Skyen Systems Pty Ltd (ACN 701 564 730)
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}


