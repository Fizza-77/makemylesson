'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { TEACHING_METHODS_BASE } from '@marketing/data/teachingMethods'
import { getFeaturePath } from '@marketing/data/features'

const FeaturesDesktopMenu = dynamic(() =>
  import('@marketing/components/FeaturesNavMenu').then((mod) => ({
    default: mod.FeaturesDesktopMenu,
  })),
)

const TeachingMethodsDesktopMenu = dynamic(() =>
  import('@marketing/components/TeachingMethodsMegaMenu').then((mod) => ({
    default: mod.TeachingMethodsDesktopMenu,
  })),
)

const FeaturesMobileMenu = dynamic(() =>
  import('@marketing/components/FeaturesNavMenu').then((mod) => ({
    default: mod.FeaturesMobileMenu,
  })),
)

const TeachingMethodsMobileMenu = dynamic(() =>
  import('@marketing/components/TeachingMethodsMegaMenu').then((mod) => ({
    default: mod.TeachingMethodsMobileMenu,
  })),
)

export function DesktopNavMegaMenus({ pathname, linkClassName, enabled }) {
  if (!enabled) {
    return (
      <>
        <Link href={getFeaturePath('lesson-plan-generator')} className={linkClassName}>
          Features
        </Link>
        <Link href={TEACHING_METHODS_BASE} className={linkClassName}>
          Teaching Methods
        </Link>
      </>
    )
  }

  return (
    <>
      <FeaturesDesktopMenu pathname={pathname} linkClassName={linkClassName} />
      <TeachingMethodsDesktopMenu pathname={pathname} linkClassName={linkClassName} />
    </>
  )
}

export function MobileNavMegaMenus({ pathname, linkClassName, onNavigate, enabled }) {
  if (!enabled) {
    return (
      <>
        <Link href={getFeaturePath('lesson-plan-generator')} className={linkClassName} onClick={onNavigate}>
          Features
        </Link>
        <Link href={TEACHING_METHODS_BASE} className={linkClassName} onClick={onNavigate}>
          Teaching Methods
        </Link>
      </>
    )
  }

  return (
    <>
      <FeaturesMobileMenu
        pathname={pathname}
        linkClassName={linkClassName}
        onNavigate={onNavigate}
      />
      <TeachingMethodsMobileMenu
        pathname={pathname}
        linkClassName={linkClassName}
        onNavigate={onNavigate}
      />
    </>
  )
}
