import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { PageShell } from '@marketing/components/layout/Container'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@marketing/lib/appUrls'

export const metadata = {
  title: 'Get the Make My Lesson app',
  description:
    'Download Make My Lesson on the App Store or Google Play, or open it on the web.',
  robots: { index: false, follow: true },
}

function platformFromUserAgent(ua) {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'desktop'
}

export default async function SmartLinkPage() {
  const headerList = await headers()
  const ua = headerList.get('user-agent') || ''
  const platform = platformFromUserAgent(ua)

  if (platform === 'ios') redirect(APP_STORE_URL)
  if (platform === 'android') redirect(GOOGLE_PLAY_URL)

  return (
    <PageShell
      className="!bg-white border-t-transparent text-[#1A1E3A]"
      contentClassName="flex flex-col items-center py-16 sm:py-24"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]/70">
        Make My Lesson
      </p>
      <h1 className="font-[family-name:var(--font-manrope)] text-center text-[clamp(1.6rem,3.5vw,2.25rem)] font-bold tracking-tight">
        Get the app
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-[#1A1E3A]/75">
        Scan the QR code on your phone, or download Make My Lesson below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={APP_STORE_URL}
          className="inline-flex h-[48px] min-w-[168px] items-center justify-center gap-2 rounded-lg bg-black px-3 text-white no-underline ring-1 ring-black/10 transition hover:bg-black/90"
        >
          <span className="text-[13px] font-semibold">App Store</span>
        </a>
        <a
          href={GOOGLE_PLAY_URL}
          className="inline-flex h-[48px] min-w-[168px] items-center justify-center gap-2 rounded-lg bg-black px-3 text-white no-underline ring-1 ring-black/10 transition hover:bg-black/90"
        >
          <span className="text-[13px] font-semibold">Google Play</span>
        </a>
      </div>
    </PageShell>
  )
}
