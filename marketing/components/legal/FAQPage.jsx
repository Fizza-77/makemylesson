/**
 * Unused legacy legal FAQ shell — live FAQs are at `/faq` via `faqItems.js`.
 * Kept so accidental imports do not break; prefer updating `marketing/data/faqItems.js`.
 */
import Link from 'next/link'
import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function FAQPage() {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">Frequently Asked Questions</h1>
          <p className="legal-article-operator">Operated by Skyen Systems Pty Ltd</p>
        </header>
        <div className="legal-article-body">
          <p>
            The current FAQs are published at{' '}
            <Link href="/faq" className="text-mml-teal underline-offset-2 hover:underline">
              /faq
            </Link>
            .
          </p>
        </div>
      </article>
    </PolicyPageShell>
  )
}
