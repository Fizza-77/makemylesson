import Link from 'next/link'
import { BookOpen, Folder, Library, Users } from 'lucide-react'
import { MML_APP } from '@marketing/lib/appUrls'

export default function AssessmentCta() {
  return (
    <section
      className="bg-white px-4 pt-2 sm:px-6 md:px-8"
      aria-labelledby="assessment-cta-heading"
    >
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-t-[32px] bg-[#ade5df] px-5 py-12 sm:rounded-t-[40px] sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1E3A]">
              <span className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-[#74FFFD]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#1A1E3A]" />
              </span>
              Ready to assess?
            </p>
            <h2
              id="assessment-cta-heading"
              className="text-[clamp(1.85rem,3.8vw,3rem)] font-bold leading-[1.15] tracking-tight text-[#1A1E3A]"
            >
              <span className="block">Paper on the desk.</span>
              <span className="block">Scheme in your hand.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#1A1E3A]/70 sm:text-base">
              10 free credits · assessment and mark scheme generated together · no card required
            </p>
            <Link
              href={MML_APP.signUp || MML_APP.stage1}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1A1E3A] px-6 py-3.5 text-[15px] font-bold text-white no-underline shadow-[0_10px_24px_rgba(26,30,58,0.22)] transition hover:bg-[#242845]"
            >
              Generate a Test — Free
            </Link>
          </div>

          <div className="relative mx-auto h-[360px] w-full max-w-[540px] sm:h-[400px]">
            <article className="absolute right-0 top-8 z-[1] w-[70%] max-w-[235px] rotate-[8deg] rounded-[26px] bg-white p-4 shadow-[0_18px_40px_rgba(26,30,58,0.14)] sm:right-1 sm:top-10 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1A1E3A]/40">
                School
              </p>
              <p className="mt-2 text-[1.65rem] font-bold leading-none text-[#1A1E3A]">Pooled</p>
              <p className="mt-2 text-[11px] leading-snug text-[#1A1E3A]/55">
                Shared credits for whole teaching teams.
              </p>
              <div className="mt-4 rounded-2xl bg-[#eef2f6] p-3">
                <p className="flex items-baseline gap-1.5 font-medium text-[#1A1E3A]/55">
                  <span className="text-[1.75rem] font-bold leading-none text-[#1A1E3A]">∞</span>
                  <span className="text-[11px]">flexible allocation</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#d7e0e8]">
                  <div
                    className="h-full w-[95%] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #1e9a98 0%, #35bebc 50%, #74fffd 100%)',
                    }}
                  />
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-[11px] font-medium text-[#1A1E3A]/70">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                    <Users className="h-2.5 w-2.5 text-[#35BEBC]" />
                  </span>
                  Shared team credits
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                    <Library className="h-2.5 w-2.5 text-[#35BEBC]" />
                  </span>
                  School admin controls
                </li>
              </ul>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#1A1E3A]/40">
                  For schools
                </span>
                <Link
                  href="/contact"
                  className="rounded-full bg-[#1A1E3A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white no-underline"
                >
                  Contact us
                </Link>
              </div>
            </article>

            <article className="absolute left-0 top-12 z-[2] w-[70%] max-w-[235px] -rotate-[9deg] rounded-[26px] bg-[#1A1E3A] p-4 text-white shadow-[0_18px_40px_rgba(26,30,58,0.3)] sm:left-0 sm:top-14 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Free</p>
              <p className="mt-2 text-[1.65rem] font-bold leading-none">10 Credits</p>
              <p className="mt-2 text-[11px] leading-snug text-white/55">
                Explore every stage before upgrading.
              </p>
              <div className="mt-4 rounded-2xl bg-white/[0.06] p-3">
                <p className="flex items-baseline gap-1.5 font-medium text-white/50">
                  <span className="text-[1.35rem] font-bold leading-none text-white">10</span>
                  <span className="text-[11px]">credits included</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[32%] rounded-full bg-[#35BEBC]" />
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-[11px] font-medium text-white/75">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                    <Folder className="h-2.5 w-2.5 text-[#35BEBC]" />
                  </span>
                  Complete teaching packs
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                    <BookOpen className="h-2.5 w-2.5 text-[#35BEBC]" />
                  </span>
                  All creation tools
                </li>
              </ul>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                  No card required
                </span>
                <Link
                  href={MML_APP.signUp || MML_APP.stage1}
                  className="rounded-full bg-[#35BEBC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A] no-underline"
                >
                  Start free
                </Link>
              </div>
            </article>

            <article className="absolute left-[16%] top-0 z-[3] w-[76%] max-w-[255px] rotate-[2deg] rounded-[28px] bg-[#0a0b12] p-5 text-white shadow-[0_24px_50px_rgba(10,11,18,0.45)] sm:left-[20%] sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Individual
              </p>
              <p className="mt-2 text-[1.75rem] font-bold leading-none">
                60
                <span className="ml-1.5 text-[0.95rem] font-semibold text-white/55">/ month</span>
              </p>
              <p className="mt-2 text-[12px] leading-snug text-white/55">
                Built for teachers creating every week.
              </p>
              <div className="mt-4 rounded-2xl bg-white/[0.06] p-3.5">
                <p className="flex items-baseline gap-1.5 font-medium text-white/50">
                  <span className="text-[1.35rem] font-bold leading-none text-white">60</span>
                  <span className="text-[11px]">monthly credits</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[75%] rounded-full bg-[#35BEBC]" />
                </div>
              </div>
              <ul className="mt-3.5 space-y-2 text-[12px] font-medium text-white/75">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                    <Folder className="h-2.5 w-2.5 text-[#35BEBC]" />
                  </span>
                  Up to 15 complete packs
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#35BEBC]/25">
                    <Library className="h-2.5 w-2.5 text-[#35BEBC]" />
                  </span>
                  Personal resource library
                </li>
              </ul>
              <div className="mt-5 flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                  For one teacher
                </span>
                <span className="rounded-full bg-[#35BEBC] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1E3A]">
                  Most popular
                </span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
