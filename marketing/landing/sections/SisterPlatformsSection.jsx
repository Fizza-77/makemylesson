'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { Reveal } from '../shared'
import { containerGutter } from '@marketing/components/layout/Container'

const SPRING = { type: 'spring', stiffness: 300, damping: 25 }

const PLATFORMS = [
  {
    name: 'Studiely',
    tagline: 'Start Studying Smarter',
    url: 'https://www.studiely.com',
    logo: '/logo-studiely.jpeg',
    description: [
      'An AI-powered study platform built for students across the same curriculum systems Make My Lesson serves.',
      'Where Make My Lesson supports the teacher preparing the lesson, Studiely supports the student on the other side of it.',
    ],
  },
  {
    name: 'Linguatude',
    tagline: 'AI English Test Preparation',
    url: 'https://linguatude.com',
    logo: '/linguatude-logo.webp',
    description: [
      'An AI-powered English test preparation platform for IELTS, TOEFL iBT, PTE Academic, Cambridge B1 Preliminary, and Cambridge B2 First.',
      'Where Make My Lesson supports the teacher planning the lesson, Linguatude supports the learner whose next opportunity depends on passing a high-stakes English test.',
    ],
  },
]

function PlatformCard({ platform, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <motion.a
        href={platform.url}
        target="_blank"
        rel="noopener noreferrer"
        className="sister-card group"
        whileHover={{ y: -5 }}
        transition={SPRING}
      >
        <div className="sister-card-brand">
          <div className="sister-card-logo-wrap">
            <Image
              src={platform.logo}
              alt={`${platform.name} logo`}
              width={72}
              height={72}
              className="sister-card-logo"
            />
          </div>
          <h3 className="sister-card-name">{platform.name}</h3>
        </div>
        <div className="sister-card-copy">
          <p className="sister-card-tagline">{platform.tagline}</p>
          <div className="sister-card-desc">
            {platform.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <ArrowUpRight size={18} strokeWidth={2} className="sister-card-arrow" aria-hidden />
      </motion.a>
    </Reveal>
  )
}

export default function SisterPlatformsSection() {
  return (
    <section id="sister-platforms" className="sister-platforms">
      <div className={`mx-auto w-full max-w-[1800px] ${containerGutter}`}>
        <Reveal className="sister-head">
          <h2 className="sister-title">Sister Platforms</h2>
          <p className="sister-subtitle">Built by Skyen Solutions</p>
        </Reveal>

        <div className="sister-grid grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {PLATFORMS.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  )
}
