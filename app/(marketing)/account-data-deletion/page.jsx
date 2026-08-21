import AccountDataDeletionPage from '@marketing/components/legal/AccountDataDeletionPage'
import JsonLd from '@marketing/components/JsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Delete Your Account and Data'
const PAGE_DESCRIPTION =
  'Learn how to request deletion of your Make My Lesson account and personal data, what information is removed, and what may be retained for legal reasons.'
const PAGE_PATH = '/account-data-deletion'

export const metadata = {
  title: { absolute: 'Delete Your Account and Data | Make My Lesson' },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function AccountDataDeletionRoutePage() {
  return (
    <>
      <JsonLd
        data={buildPageJsonLd({
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
          path: PAGE_PATH,
        })}
      />
      <AccountDataDeletionPage />
    </>
  )
}
