import AccountDataDeletionPage from '@marketing/components/legal/AccountDataDeletionPage'

export const metadata = {
  title: 'Account & Data Deletion | Make My Lesson',
  description:
    'How to request deletion of your Make My Lesson account and associated data. Operated by Qismat Ventures W.L.L.',
  alternates: { canonical: '/account-data-deletion' },
  robots: { index: true, follow: true },
}

export default function AccountDataDeletionRoutePage() {
  return <AccountDataDeletionPage />
}
