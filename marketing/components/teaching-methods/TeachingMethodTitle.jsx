function splitTrailingWords(text, count = 2) {
  const trimmed = text.trim()
  if (!trimmed) return { lead: '', accent: '' }

  const words = trimmed.split(/\s+/)
  if (words.length <= count) {
    return { lead: '', accent: trimmed }
  }

  return {
    lead: words.slice(0, -count).join(' '),
    accent: words.slice(-count).join(' '),
  }
}

export default function TeachingMethodTitle({ title }) {
  const colonIndex = title.indexOf(':')

  if (colonIndex === -1) {
    const { lead, accent } = splitTrailingWords(title, 2)
    if (!lead) {
      return (
        <h1 className="tm-title">
          <span className="pricing-hero-underline pricing-hero-underline--straight tm-title-accent relative inline">
            {accent}
          </span>
        </h1>
      )
    }

    return (
      <h1 className="tm-title">
        <span className="tm-title-lead">{lead}</span>{' '}
        <span className="pricing-hero-underline pricing-hero-underline--straight tm-title-accent relative inline whitespace-nowrap">
          {accent}
        </span>
      </h1>
    )
  }

  const before = title.slice(0, colonIndex + 1)
  const after = title.slice(colonIndex + 1).trimStart()
  const { lead, accent } = splitTrailingWords(after, 2)

  return (
    <h1 className="tm-title">
      <span className="tm-title-lead">{before}</span>
      {after ? (
        <>
          {' '}
          {lead ? <span className="tm-title-lead">{lead} </span> : null}
          <span className="pricing-hero-underline pricing-hero-underline--straight tm-title-accent relative inline whitespace-nowrap">
            {accent}
          </span>
        </>
      ) : null}
    </h1>
  )
}


