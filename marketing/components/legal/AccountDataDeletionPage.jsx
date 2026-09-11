import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function AccountDataDeletionPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">Account &amp; Data Deletion</h1>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective: 10 September 2026</span>
            <span className="mt-1 block">Last Updated: 10 September 2026</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. How to delete your account</h2>
            <p className="mb-3">
              You can request deletion of your Make My Lesson account and the personal information associated with it at
              any time, in either of these ways:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <span className="font-medium text-white">In the app or website</span> — go to Account Settings → Delete
                Account, and confirm
              </li>
              <li>
                <span className="font-medium text-white">By email</span> — send a request from the email address on your
                account to{' '}
                <a
                  href="mailto:support@makemylesson.ai?subject=Delete%20my%20account"
                  className="text-mml-teal underline-offset-2 hover:underline"
                >
                  support@makemylesson.ai
                </a>{' '}
                with the subject line &quot;Delete my account&quot;
              </li>
            </ul>
            <p>
              We may ask you to verify your identity before processing an email request, to protect against someone else
              deleting your account without your permission.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. What is deleted</h2>
            <p className="mb-3">
              When your account is deleted, the following are permanently removed within 30 days:
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Your name, email address and password</li>
              <li>Your teaching profile and saved preferences</li>
              <li>Your generation history, favourites and saved teaching packs</li>
              <li>Your Ayla refinement history</li>
              <li>Your credit balance and usage history</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. What is retained, and why</h2>
            <p className="mb-3">
              We are required by Australian tax and corporate law to keep certain records even after account deletion. We
              retain only what the law requires:
            </p>
            <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full border-collapse text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="p-3 sm:p-4 font-semibold text-white">Retained</th>
                    <th className="p-3 sm:p-4 font-semibold text-white">Reason</th>
                    <th className="p-3 sm:p-4 font-semibold text-white">Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">Billing and transaction records</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">Australian tax and accounting law</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">7 years</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">
                      Consent records for a web subscription
                    </td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Evidence in the event of a payment dispute
                    </td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">7 years</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 sm:p-4 font-medium text-white align-top">
                      Records needed to investigate a reported breach of our Acceptable Use Policy
                    </td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">Security and legal protection</td>
                    <td className="p-3 sm:p-4 text-slate-300 align-top">
                      Until the matter is resolved, then deleted
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              These retained records are kept securely, used only for the stated purpose, and are not used to re-identify
              you for any other purpose.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Subscriptions are not automatically cancelled</h2>
            <p className="mb-3">
              Deleting your account does not cancel an active subscription. Cancel separately, before or after deleting
              your account:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                <span className="font-medium text-white">Web subscription</span> — cancel from your account page, or email{' '}
                <a
                  href="mailto:support@makemylesson.ai"
                  className="text-mml-teal underline-offset-2 hover:underline"
                >
                  support@makemylesson.ai
                </a>
              </li>
              <li>
                <span className="font-medium text-white">App Store subscription</span> — cancel in your Apple ID account
                settings under Subscriptions
              </li>
              <li>
                <span className="font-medium text-white">Google Play subscription</span> — cancel in the Google Play app
                under Payments &amp; subscriptions
              </li>
            </ul>
            <p>
              If you delete your account with an active subscription still running, we will not be able to provide you the
              service you continue to be billed for. Cancel the subscription first, or at the same time as your deletion
              request.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Institutional and school accounts</h2>
            <p>
              If your account was created as part of a school or department plan, your school or department administrator
              may also be able to remove your seat. Deleting your personal account does not delete records the institution
              is separately required to keep under its own agreement with us.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Confirmation</h2>
            <p>
              We will email you to confirm once your account and associated personal information have been deleted.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. Questions</h2>
            <p className="mb-1">Skyen Systems Pty Ltd · ACN 701 564 730</p>
            <p className="mb-3">Unit 18, 285–287 Derrimut Rd, Hoppers Crossing VIC 3029, Australia</p>
            <p className="mb-3">
              <a
                href="mailto:support@makemylesson.ai"
                className="text-mml-teal underline-offset-2 hover:underline"
              >
                support@makemylesson.ai
              </a>
            </p>
            <p className="text-sm text-slate-300">
              See also our{' '}
              <Link href="/privacy-policy-web" className="text-mml-teal underline-offset-2 hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/acceptable-use-policy" className="text-mml-teal underline-offset-2 hover:underline">
                Acceptable Use Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}
