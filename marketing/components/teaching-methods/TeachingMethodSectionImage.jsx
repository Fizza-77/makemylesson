import Image from 'next/image'
import { cn } from '@marketing/lib/cn'
import {
  getTeachingMethodHeroImagePath,
  getTeachingMethodSectionImagePath,
} from '@marketing/data/teachingMethods'
import { getFeatureSectionImagePath } from '@marketing/data/features'

function getSectionImagePath(entity) {
  return getTeachingMethodSectionImagePath(entity) ?? getFeatureSectionImagePath(entity)
}

export default function TeachingMethodSectionImage({
  method,
  className = 'tm-section-visual',
  imageClassName = 'tm-section-img',
  imageKey = 'hero',
}) {
  const imageSrc =
    imageKey === 'section' ? getSectionImagePath(method) : getTeachingMethodHeroImagePath(method)
  if (!imageSrc) return null

  const alt =
    imageKey === 'section'
      ? `${method.label ?? method.title} section illustration`
      : `${method.label ?? method.title} teaching method illustration`

  const isHero = imageKey === 'hero'

  return (
    <div className={cn(className)}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={imageClassName}
        sizes={
          isHero
            ? '(max-width: 768px) min(100vw, 440px), 380px'
            : '(max-width: 900px) min(100vw, 320px), 280px'
        }
        priority={isHero}
        loading={isHero ? 'eager' : 'lazy'}
        fetchPriority={isHero ? 'high' : 'auto'}
        quality={isHero ? 60 : 75}
        decoding="async"
      />
    </div>
  )
}


