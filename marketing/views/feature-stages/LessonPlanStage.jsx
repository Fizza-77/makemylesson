import LessonPlanCognitiveBalance from '@marketing/components/features/LessonPlanCognitiveBalance'
import LessonPlanCta from '@marketing/components/features/LessonPlanCta'
import LessonPlanHowItWorks from '@marketing/components/features/LessonPlanHowItWorks'
import LessonPlanNextStages from '@marketing/components/features/LessonPlanNextStages'
import LessonPlanStageHero from '@marketing/components/features/LessonPlanStageHero'
import LessonPlanTakeAnywhere from '@marketing/components/features/LessonPlanTakeAnywhere'
import {
  LazyLessonPlanDifferentiation,
  LazyLessonPlanWhatsInside,
} from '@marketing/components/features/lazy/LessonPlanLazySections'

export default function LessonPlanStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <LessonPlanStageHero />
        <LessonPlanHowItWorks />
      </div>
      <LazyLessonPlanWhatsInside />
      <div className="h-[1cm] bg-white" aria-hidden />
      <LazyLessonPlanDifferentiation />
      <LessonPlanCognitiveBalance />
      <LessonPlanTakeAnywhere />
      <LessonPlanNextStages />
      <LessonPlanCta />
    </>
  )
}
