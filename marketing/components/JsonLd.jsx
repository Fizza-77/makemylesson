/**
 * Renders a JSON-LD script tag. Accepts a single object or array of objects.
 * @param {{ data: object | object[] }} props
 */
export default function JsonLd({ data }) {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}


