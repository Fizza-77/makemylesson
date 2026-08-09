export default function TeachingMethodTitle({ title }) {
  const colonIndex = title.indexOf(':')

  if (colonIndex === -1) {
    return <h1 className="tm-title">{title}</h1>
  }

  const before = title.slice(0, colonIndex + 1)
  const after = title.slice(colonIndex + 1).trimStart()

  return (
    <h1 className="tm-title">
      <span className="tm-title-lead">{before}</span>
      {after ? (
        <>
          {' '}
          <span className="tm-title-accent">{after}</span>
        </>
      ) : null}
    </h1>
  )
}
