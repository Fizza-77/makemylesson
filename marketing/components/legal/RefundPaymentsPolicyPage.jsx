import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function RefundPaymentsPolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">
            Refund &amp; Payments Policy
          </h1>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
          <p className="legal-article-meta">
            <span className="block">Effective Date: 11 September 2026</span>
            <span className="mt-1 block">Last Updated: 11 September 2026</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. Introduction</h2>
            <p className="mb-3">
              This Refund &amp; Payments Policy governs all payments, subscriptions and paid features on Make My Lesson,
              operated by Skyen Systems Pty Ltd (ACN 701 564 730). It forms part of our Terms of Service.
            </p>
            <p className="mb-3">
              It applies across our website, the Apple App Store, Google Play, and institutional plans.
            </p>
            <p className="mb-3">Billing contact:</p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. Who you are buying from</h2>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>
                Subscriptions purchased on makemylesson.ai are sold by Skyen Systems Pty Ltd and processed by Stripe
                Payments Australia Pty Ltd.
              </li>
              <li>
                Subscriptions purchased inside our iOS or Android apps are sold through the Apple App Store or Google
                Play, under their terms.
              </li>
            </ul>
            <p>
              Charges from our website appear on your statement as SKYEN* MAKEMYLESSON. Skyen Systems does not receive or
              store your full card number.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. Plans and pricing</h2>
            <p className="mb-3">
              Make My Lesson is available on the following plans, at the price shown at checkout:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Free — 5 credits on signup, no payment method required</li>
              <li>Monthly — $9.99 USD, 30 credits</li>
              <li>3 Months — $27.00 USD, 90 credits</li>
              <li>6 Months — $50.00 USD, 180 credits</li>
              <li>Annual — $90.00 USD, 360 credits</li>
            </ul>
            <p>
              All prices are in US dollars. Your card issuer may convert to your local currency and apply its own
              conversion fee; the USD amount shown at the time you subscribe is the amount charged. Applicable taxes,
              where required, are added at checkout.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. How credits work</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>1 credit = 1 stage generation. A full 4-stage teaching pack costs 4 credits.</li>
              <li>Credits are deducted only after a successful generation and save.</li>
              <li>Manual editing is always free and consumes no credits.</li>
              <li>Refinements with Ayla consume no credits.</li>
              <li>Regeneration counts as a new generation and consumes a credit.</li>
              <li>
                Credits are pooled for your plan period, not released monthly. You may use them at any time within the
                period. Credits do not carry over — any unused credits expire when the period ends.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Auto-renewal</h2>
            <p className="mb-3">
              Paid plans renew automatically at the end of each billing cycle, at the then-current price, unless you
              cancel before the renewal date. You consent to this recurring charge when you subscribe.
            </p>
            <p>
              For plans with a term longer than one month, we will email you a reminder at least seven days before each
              renewal, stating the renewal date, the amount and how to cancel. We will give you reasonable advance notice
              by email before any price increase takes effect for your next renewal.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Cancelling</h2>
            <p className="mb-3">
              You can cancel at any time from your account page. Cancellation stops future billing. Your plan and
              remaining credits stay available until the end of the period you have already paid for.
            </p>
            <p>
              To cancel a subscription bought in the app, use your Apple or Google account settings — we cannot cancel
              platform subscriptions on your behalf.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. Refunds — website purchases</h2>
            <p className="mb-3">
              Every account receives 5 free credits on signup so you can evaluate the platform before paying. Because of
              that, once a billing period has begun the fee for that period is not refundable.
            </p>
            <p className="mb-3">
              Where circumstances warrant it, we may offer a partial refund or an account credit at our discretion.
              Contact{' '}
              <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                support@makemylesson.ai
              </a>{' '}
              and we will consider your situation.
            </p>
            <p>
              This policy does not limit your rights under the Australian Consumer Law. If our service is not supplied
              with due care and skill, or is not as described, you may be entitled to a remedy under that law regardless
              of anything in this policy.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Refunds — App Store and Google Play purchases</h2>
            <p>
              Refunds for subscriptions bought inside our apps are governed by Apple&apos;s and Google&apos;s policies.
              We do not control those decisions or timelines, and requests must be made directly to the platform. By
              purchasing through those platforms you agree to their refund terms.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. School and department plans</h2>
            <p className="mb-3">
              We offer plans for teaching teams. Each teacher receives an individual account with their own credits;
              shared logins are not permitted. Plans are quoted on enquiry — email{' '}
              <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                hello@makemylesson.ai
              </a>
              .
            </p>
            <p>
              Institutional plans include a 14-day money-back guarantee from the date of purchase. After 14 days, plans
              are non-refundable for the remainder of the term. Institutional purchases may also be governed by a
              separate written agreement, which prevails over this policy where they conflict.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. Failed payments</h2>
            <p>
              If a payment fails at renewal we will attempt to notify you and may retry the charge. If payment is not
              collected, your account moves to the Free plan. Your saved lesson packs are retained.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">11. Accounts and age</h2>
            <p>
              Make My Lesson is intended for teachers and institutions. It is not designed for children. Any purchase is
              the responsibility of the account holder.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">12. Billing disputes</h2>
            <p className="mb-3">
              Contact{' '}
              <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                support@makemylesson.ai
              </a>{' '}
              with your account email, transaction details, the platform used and a description of the issue. We aim to
              resolve billing queries within 14 business days; timelines may vary where a third-party platform is
              involved. For App Store and Google Play purchases, final authority rests with the platform.
            </p>
            <p>Repeated or fraudulent refund claims may result in account restrictions.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">13. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The current version is always published on this page with the
              date it was last updated. Where a change materially affects your subscription we will give you reasonable
              notice by email.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">14. Contact</h2>
            <p className="mb-3">
              Skyen Systems Pty Ltd (ACN 701 564 730), Unit 18, 285–287 Derrimut Rd, Hoppers Crossing VIC 3029, Australia.
            </p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:support@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  support@makemylesson.ai
                </a>
                {' '}
                — billing, subscriptions, refunds
              </li>
              <li>
                <a href="mailto:hello@makemylesson.ai" className="text-mml-teal underline-offset-2 hover:underline">
                  hello@makemylesson.ai
                </a>
                {' '}
                — school and department plan quotes
              </li>
            </ul>
          </section>
        </div>
      </article>
    </PolicyPageShell>
  )
}
