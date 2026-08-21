import JsonLd from '@marketing/components/JsonLd'
import { buildCoreOrganizationGraph } from '@marketing/lib/organizationSchema'

/**
 * Page-only JSON-LD (not layouts) so 404 / notFound() responses never emit schema.
 * Always includes the shared Organization / Brand / WebSite / SoftwareApplication graph.
 */
export default function MarketingPageJsonLd({ data }) {
  const pageNodes = !data ? [] : Array.isArray(data) ? data.filter(Boolean) : [data]
  return <JsonLd data={[buildCoreOrganizationGraph(), ...pageNodes]} />
}
