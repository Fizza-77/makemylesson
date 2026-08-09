'use client'

/**
 * Embeds the Flutter web app below the global Navbar.
 * Paths like /app/pricing → {origin}/app/pricing
 */
export default function FlutterAppEmbed({ segments = [] }) {
  const origin = (
    process.env.NEXT_PUBLIC_MML_FLUTTER_HOSTING_ORIGIN || 'https://makemylesson.app'
  ).replace(/\/$/, '')
  const subpath = segments.filter(Boolean).join('/')
  const src = subpath ? `${origin}/app/${subpath}` : `${origin}/app`

  return (
    <iframe
      title="Make My Lesson app"
      src={src}
      className="block w-full min-h-[calc(100vh-4rem)] flex-1 border-0 bg-mml-navy"
      allow="clipboard-read; clipboard-write"
    />
  )
}
