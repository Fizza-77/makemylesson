import AccountDataDeletionPage from '@marketing/components/legal/AccountDataDeletionPage'

export const metadata = {
  title: { absolute: 'Delete Your Account and Data | Make My Lesson' },
  description:
    'Learn how to request deletion of your Make My Lesson account and personal data, what information is removed, and what may be retained for legal reasons.',
  alternates: { canonical: '/account-data-deletion' },
  robots: { index: true, follow: true },
}

export default function AccountDataDeletionRoutePage() {
  return <AccountDataDeletionPage />
}
