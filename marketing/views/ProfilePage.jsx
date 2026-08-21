import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AylaIcon from '@marketing/components/AylaIcon'
import { containerClass } from '@marketing/components/layout/Container'
import { cn } from '@marketing/lib/cn'
import {
  User,
  BookOpen,
  Edit3,
  ChevronDown,
  Star,
  RefreshCw,
  PlusCircle,
  PlayCircle,
  Zap,
  AlertCircle,
} from 'lucide-react'
const RECENT_LESSONS = [
  { title: "Earth's Changing Surface", subject: 'Science', stage: 3, color: '#1BBFAD' },
  { title: 'Parts of the Plant', subject: 'Biology', stage: 2, color: '#7B5EA7' },
  { title: 'The Water Cycle', subject: 'Science', stage: 4, color: '#0D1B2A' },
]

const QUICK_ACTIONS = [
  { icon: <AlertCircle size={16} />, label: 'Need Any Help?' },
  { icon: <RefreshCw size={16} />, label: 'Refine My Existing Lesson' },
  { icon: <PlusCircle size={16} />, label: 'Create Something New' },
  { icon: <PlayCircle size={16} />, label: 'View Step by Step Demo' },
]

export default function ProfilePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] animate-fade-up bg-mml-navy-mid py-8">
      <div className={cn(containerClass, 'grid grid-cols-1 items-start gap-4 md:gap-6 md:grid-cols-[minmax(0,340px)_1fr]')}>
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="mb-5 flex items-center gap-2.5 rounded-mml-sm bg-mml-navy px-3.5 py-2.5">
              <div className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full border border-mml-teal/40 bg-mml-navy-mid">
                <AylaIcon width={28} height={28} alt="Ayla" className="h-full w-full" />
              </div>
              <div>
                <p className="text-[0.8rem] font-bold text-white">Ayla</p>
                <p className="text-[0.68rem] text-white">AI Teaching Assistant</p>
              </div>
              <button type="button" className="btn-primary ml-auto shrink-0 !px-3.5 !py-1.5 !text-xs">
                Ask Ayla
              </button>
            </div>

            <div className="mb-5 flex gap-4">
              <div className="relative shrink-0">
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
                  alt="Michael Carter"
                  width={64}
                  height={64}
                  className="rounded-full border-[3px] border-mml-teal bg-mml-navy-mid"
                  unoptimized
                />
                <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-mml-teal text-white">
                  <Star size={10} fill="currentColor" />
                </div>
              </div>
              <div>
                <h2 className="mb-0.5 text-[1.05rem] font-extrabold text-white">Michael Carter</h2>
                <p className="mb-2 text-[0.78rem] text-white">michael.carter@email.com</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-mml-teal/10 px-3 py-1 text-[0.75rem] font-semibold text-mml-teal-dark transition-colors hover:bg-mml-teal/20"
                >
                  <Edit3 size={12} /> Edit Profile
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-white/[0.06] px-3 py-2 text-[0.78rem] font-semibold text-white transition-colors hover:border-mml-teal hover:text-mml-teal-dark"
              >
                <BookOpen size={13} />
                <span>US Curriculum</span>
                <ChevronDown size={12} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-white/[0.06] px-3 py-2 text-[0.78rem] font-semibold text-white transition-colors hover:border-mml-teal hover:text-mml-teal-dark"
              >
                <User size={13} />
                <span>Grade & Subject</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3.5 text-[0.9rem] font-bold text-white">Your Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Lessons This Month', value: '17', trend: '+3 this month', clr: '#7dd3e8' },
                { label: 'Total Exports', value: '96', trend: '+20 this month', clr: '#a78bfa' },
                { label: 'Questions', value: '5,412', trend: '+266 this month', clr: '#B8860B' },
                { label: 'Students', value: '5,412', trend: '+1 this month', clr: '#4ade80' },
              ].map((s, i) => (
                <div key={i} className="rounded-mml-sm border border-white/[0.06] bg-mml-navy-mid p-3">
                  <p className="mb-0.5 font-display text-2xl font-extrabold" style={{ color: s.clr }}>
                    {s.value}
                  </p>
                  <p className="mb-1 text-[0.72rem] leading-snug text-white">{s.label}</p>
                  <p className="text-[0.68rem] font-semibold text-mml-green">{s.trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3.5 text-[0.9rem] font-bold text-white">Membership</h3>
            <div className="mb-2.5 flex items-center justify-between rounded-mml-sm bg-gradient-to-br from-mml-navy to-mml-navy-mid px-4 py-3.5 text-mml-teal">
              <div className="flex items-center gap-2.5">
                <Star size={16} fill="currentColor" />
                <div>
                  <p className="mb-0.5 text-sm font-bold text-white">PRO Membership</p>
                  <span className="badge badge-teal text-[0.65rem]">Active</span>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full bg-mml-teal/20 px-3.5 py-1.5 text-xs font-bold text-mml-teal transition-colors hover:bg-mml-teal/35"
              >
                Manage
              </button>
            </div>
            <p className="mb-2.5 text-[0.75rem] text-white">Renews on June 7, 2026</p>
            <div>
              <div className="mb-1.5 flex justify-between text-[0.72rem] text-white">
                <span>43/Unlimited Lesson Journeys</span>
                <span>43%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-white/[0.06]">
                <div
                  className="h-full rounded bg-gradient-to-r from-mml-teal to-mml-teal-light transition-all duration-1000"
                  style={{ width: '43%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-[0.9rem] font-bold text-white">Recent Activity</h3>
              <Link href="/library" className="text-[0.78rem] font-semibold text-mml-teal-dark transition-opacity hover:opacity-70">
                View All Activity →
              </Link>
            </div>
            <p className="mb-3.5 text-[0.78rem] text-white">Recent Lesson Activity</p>
            <div className="flex flex-col gap-2">
              {RECENT_LESSONS.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-mml-sm border border-white/[0.06] bg-mml-navy-mid px-4 py-3 transition-all hover:translate-x-0.5 hover:shadow-sm"
                >
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{l.title}</p>
                    <p className="text-[0.72rem] text-white">{l.subject}</p>
                  </div>
                  <span className="badge badge-teal shrink-0">Stage {l.stage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3.5 text-[0.9rem] font-bold text-white">Quick Actions</h3>
            <div className="flex flex-col gap-1.5">
              {QUICK_ACTIONS.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-mml-sm border border-white/[0.06] bg-mml-navy-mid px-3.5 py-3 text-left text-sm font-medium text-white transition-colors hover:border-mml-teal/25 hover:bg-mml-teal/5 hover:text-mml-teal-dark"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-mml-sm bg-mml-teal/10 text-mml-teal-dark">
                    {a.icon}
                  </span>
                  <span>{a.label}</span>
                  <ChevronDown
                    size={14}
                    className="ml-auto shrink-0 -rotate-90 text-white"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/lesson/stage1"
              className="btn-primary flex-1 justify-center"
            >
              <Zap size={14} /> Start a New Lesson
            </Link>
            <Link href="/pricing" className="btn-secondary flex-1 justify-center">
              <Star size={14} /> Upgrade Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
