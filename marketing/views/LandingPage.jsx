'use client'

import '@marketing/styles/legacy-landing-page.css'

import { useLayoutEffect, useState } from 'react'
import { cn } from '@marketing/lib/cn'
import AylaIcon from '@marketing/components/AylaIcon'
import { MML_APP } from '@marketing/lib/appUrls'
import AylaSection from '@marketing/landing/sections/AylaSection'
import CtaBandSection from '@marketing/landing/sections/CtaBandSection'
import SisterPlatformsSection from '@marketing/landing/sections/SisterPlatformsSection'
import CurriculumSection from '@marketing/landing/sections/CurriculumSection'
import FeaturesSection from '@marketing/landing/sections/FeaturesSection'
import ProblemSection from '@marketing/landing/sections/ProblemSection'
import HeroSection from '@marketing/landing/sections/HeroSection'
import HowItWorksSection from '@marketing/landing/sections/HowItWorksSection'
import MethodsSection from '@marketing/landing/sections/MethodsSection'
import ReplacesSection from '@marketing/landing/sections/ReplacesSection'
import LibraryExportSection from '@marketing/landing/sections/LibraryExportSection'
import PricingSection from '@marketing/landing/sections/PricingSection'
import ReviewsSection from '@marketing/landing/sections/ReviewsSection'
import TrustSection from '@marketing/landing/sections/TrustSection'
import StatsSection from '@marketing/landing/sections/StatsSection'
import LandingScrollHandler from '@marketing/components/LandingScrollHandler'

export default function LandingPage() {
  const [revealReady, setRevealReady] = useState(false)

  useLayoutEffect(() => {
    setRevealReady(true)
  }, [])

  return (
    <div className={cn('landing-page', revealReady && 'reveal-ready')} data-theme="light">
      <LandingScrollHandler />
      <HeroSection />
      <StatsSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MethodsSection />
      <AylaSection />
      <ReplacesSection />
      <LibraryExportSection />
      <CurriculumSection />
      <TrustSection />
      <ReviewsSection />
      <PricingSection />
      <SisterPlatformsSection />
      <CtaBandSection />

      <a
        href={MML_APP.ayla}
        className="landing-fab"
        aria-label="Open Ayla or help"
        title="Ayla"
      >
        <AylaIcon alt="Ayla" className="landing-fab-ayla h-full w-full" priority={false} />
      </a>
    </div>
  )
}