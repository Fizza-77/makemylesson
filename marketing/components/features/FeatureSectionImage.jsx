import Image from 'next/image'
import { cn } from '@marketing/lib/cn'
import { getFeatureHeroImagePath } from '@marketing/data/features'

export default function FeatureSectionImage({
  feature,
  className = 'tm-section-visual',
  imageClassName = 'tm-section-img',
}) {
  const imageSrc = getFeatureHeroImagePath(feature)
  if (!imageSrc) return null

  return (
    <div className={cn(className)}>
      <Image
        src={imageSrc}
        alt={`${feature.label} feature illustration`}
        fill
        className={imageClassName}
        sizes="(max-width: 768px) min(100vw, 440px), 380px"
        priority
        loading="eager"
        fetchPriority="high"
        quality={60}
        decoding="async"
      />
    </div>
  )
}
