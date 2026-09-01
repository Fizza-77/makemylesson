import ActivityCta from '@marketing/components/features/ActivityCta'
import ActivityHowItWorks from '@marketing/components/features/ActivityHowItWorks'
import ActivityNextStages from '@marketing/components/features/ActivityNextStages'
import ActivityStageHero from '@marketing/components/features/ActivityStageHero'
import ActivityTakeAnywhere from '@marketing/components/features/ActivityTakeAnywhere'
import {
  LazyActivityMethodShape,
  LazyActivityTeacherCopy,
  LazyActivityTypes,
} from '@marketing/components/features/lazy/ActivityLazySections'

export default function ActivityStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <ActivityStageHero />
      </div>
      <ActivityHowItWorks />
      <div className="h-[1cm] bg-white" aria-hidden />
      <LazyActivityTypes />
      <div className="h-[1cm] bg-white" aria-hidden />
      <LazyActivityTeacherCopy />
      <LazyActivityMethodShape />
      <ActivityTakeAnywhere />
      <ActivityNextStages />
      <ActivityCta />
    </>
  )
}
