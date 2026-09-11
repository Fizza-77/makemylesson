import AccountDataDeletionPage from '@marketing/components/legal/AccountDataDeletionPage'
import MarketingPageJsonLd from '@marketing/components/MarketingPageJsonLd'
import { buildPageJsonLd } from '@marketing/lib/pageSchema'

const PAGE_NAME = 'Account & Data Deletion'
const PAGE_DESCRIPTION =
  'How to delete your Make My Lesson account, what personal information is removed within 30 days, and what billing records we retain under Australian law.'
const PAGE_PATH = '/account-data-deletion'

export const metadata = {
  title: { absolute: 'Account & Data Deletion | Make My Lesson' },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
}

export default function AccountDataDeletionRoutePage() {
  return (
    <>
      <MarketingPageJsonLd
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


