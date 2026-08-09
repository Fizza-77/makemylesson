import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function RefundPaymentsPolicyPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">
            Refund &amp; Payments Policy
          </h1>
          <p className="legal-article-operator">Operated by Qismat Ventures W.L.L</p>
          <p className="legal-article-meta">
            <span className="block">Effective Date: [To be set]</span>
            <span className="mt-1 block">Last Updated: [To be set]</span>
          </p>
        </header>

        <div className="legal-article-body">
          <section className="legal-section">
            <h2 className="legal-h2">1. Introduction</h2>
            <p className="mb-3">
              This Refund &amp; Payments Policy governs all payments, subscriptions, and paid features offered on Make My
              Lesson, operated by Qismat Ventures W.L.L.
            </p>
            <p className="mb-3">This policy applies across:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Web platform (direct payments)</li>
              <li>Apple App Store</li>
              <li>Google Play Store</li>
              <li>Institutional and school plans</li>
            </ul>
            <p className="mb-3">Billing Contact:</p>
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
            <h2 className="legal-h2">2. Platform-Based Purchases (Apple &amp; Google)</h2>
            <p className="mb-3">If you subscribe through:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Apple App Store</li>
              <li>Google Play Store</li>
            </ul>
            <p className="mb-3">Then:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Refunds are governed by the respective platform policies</li>
              <li>Make My Lesson does not control refund decisions or timelines</li>
              <li>Refund requests must be submitted directly via Apple or Google</li>
              <li>By purchasing through these platforms, you agree to their refund terms.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. Direct Purchases (Web – Paddle or Equivalent)</h2>
            <p className="mb-3">For purchases made directly via Make My Lesson:</p>
            <h3 className="mb-2 mt-4 font-sans text-[15px] font-semibold text-white">Eligibility</h3>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Subscriptions may be eligible for a refund within 7 calendar days of purchase</li>
              <li>Only if the service has not been substantially used</li>
            </ul>
            <h3 className="legal-h3">Important Conditions</h3>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Once credits are used (i.e., generation occurs), refunds may be denied</li>
              <li>Manual editing does not count as usage</li>
              <li>AI generation (credit consumption) counts as usage</li>
            </ul>
            <h3 className="legal-h3">Subscriptions</h3>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Subscriptions can be cancelled anytime to stop future billing</li>
              <li>Current billing cycles are non-refundable</li>
            </ul>
            <h3 className="legal-h3">Refund Processing</h3>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Approved refunds are issued to the original payment method</li>
              <li>Transaction or processing fees may be deducted where applicable</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. Credit System (Important Clarification)</h2>
            <p className="mb-3">Make My Lesson operates on a credit-based system:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>1 credit = 1 stage generation</li>
              <li>4 credits = full teaching pack</li>
              <li>5 free credits are provided on signup</li>
              <li>Paid plans include 30 credits per month</li>
            </ul>
            <h3 className="legal-h3">Key Rules:</h3>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Credits are deducted only after successful generation and save</li>
              <li>Manual editing is always free</li>
              <li>Regeneration counts as a new credit usage</li>
            </ul>
            <h3 className="legal-h3">Refund Implication:</h3>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Once credits are used, the service is considered partially or fully consumed</li>
              <li>This may make the purchase non-refundable</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Free Access (No Trial Billing)</h2>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Every user receives 5 free credits on signup</li>
              <li>No payment method is required for initial access</li>
            </ul>
            <p className="mb-3">Since free credits are provided:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Users are expected to evaluate the platform before purchasing</li>
              <li>Refunds based on &quot;trial expectations&quot; may not be accepted</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. School &amp; Department Plans</h2>
            <p className="mb-3">For institutional purchases:</p>
            <h3 className="mb-2 mt-4 font-sans text-[15px] font-semibold text-white">Plans Include:</h3>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Department Plan (up to 5 teachers)</li>
              <li>School Plan (up to 10 teachers)</li>
              <li>Custom plans for 10+ seats</li>
            </ul>
            <h3 className="legal-h3">Refund Policy</h3>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>These plans include a 14-day money-back guarantee</li>
              <li>Refund eligibility applies only within 14 days of purchase</li>
            </ul>
            <h3 className="legal-h3">Conditions</h3>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>After 14 days, plans are non-refundable</li>
              <li>Each teacher account operates independently (no shared credits)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. Child Accounts</h2>
            <p className="mb-3">Make My Lesson is not designed for children.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Accounts are intended for teachers and institutions only</li>
              <li>Any purchases made are the responsibility of the account holder</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. Legal Exceptions &amp; Consumer Rights</h2>
            <p className="mb-3">Nothing in this policy limits rights under applicable consumer protection laws, including:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Statutory refund rights</li>
              <li>Billing error corrections</li>
              <li>Duplicate charge disputes</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. Billing Support &amp; Disputes</h2>
            <p className="mb-3">For billing-related queries:</p>
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

            <h3 className="mb-3 font-sans text-[15px] font-semibold text-white">Dispute Process</h3>

            <h4 className="mb-2 font-sans text-sm font-semibold text-white/95">Initial Contact</h4>
            <p className="mb-2">Provide:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Account email</li>
              <li>Transaction details</li>
              <li>Platform used</li>
              <li>Description of issue</li>
            </ul>

            <h4 className="mb-2 font-sans text-sm font-semibold text-white/95">Internal Review</h4>
            <p className="mb-4">We will review and may request additional information</p>

            <h4 className="mb-2 font-sans text-sm font-semibold text-white/95">Resolution Timeline</h4>
            <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Target: within 14 business days</li>
              <li>May vary for third-party platforms</li>
            </ul>

            <h3 className="legal-h3">Platform Authority</h3>
            <p className="mb-6">For Apple/Google purchases → final authority rests with the platform</p>

            <h3 className="legal-h3">Good-Faith Requirement</h3>
            <p className="mb-3">Fraudulent or repeated abuse of refund claims may result in:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-mml-teal">
              <li>Account restrictions</li>
              <li>Suspension of payment privileges</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. Changes to This Policy</h2>
            <p className="mb-3">We may update this policy periodically.</p>
            <p>Continued use of Make My Lesson constitutes acceptance of updates.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">11. Contact Information</h2>
            <p className="mb-3">For payment-related questions:</p>
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
