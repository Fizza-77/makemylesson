import PrivacyPolicyPage from '@marketing/components/legal/PrivacyPolicyPage'
import JsonLd from '@marketing/components/JsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Privacy Policy for Make My Lesson Users'
const PAGE_DESCRIPTION =
  'Read how Make My Lesson collects, uses, stores and protects account, generated-content and technical data, including your privacy rights and choices.'
const PAGE_PATH = '/privacy-policy'

export const metadata = {
  title: { absolute: PAGE_NAME },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyRoutePage() {
  return (
    <>
      <JsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <PrivacyPolicyPage />
    </>
  )
}
