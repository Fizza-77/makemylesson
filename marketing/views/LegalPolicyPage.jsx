import PolicyPageShell from '@marketing/components/layout/PolicyPageShell'

export default function LegalPolicyPage({ title, lead }) {
  return (
    <PolicyPageShell>
      <article className="legal-article">
        <header className="legal-article-header">
          <h1 className="legal-article-title">{title}</h1>
        </header>
        <div className="legal-article-body">
          <p>{lead}</p>
        </div>
      </article>
    </PolicyPageShell>
  )
}
