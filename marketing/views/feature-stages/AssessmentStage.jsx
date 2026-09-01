import AssessmentHowItWorks from '@marketing/components/features/AssessmentHowItWorks'
import AssessmentStageHero from '@marketing/components/features/AssessmentStageHero'
import {
  LazyAssessmentCta,
  LazyAssessmentCurriculumWording,
  LazyAssessmentExportCircle,
  LazyAssessmentMarkScheme,
  LazyAssessmentPaperStyles,
} from '@marketing/components/features/lazy/AssessmentLazySections'

export default function AssessmentStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <AssessmentStageHero />
      </div>
      <AssessmentHowItWorks />
      <LazyAssessmentPaperStyles />
      <div className="h-[1cm] bg-white" aria-hidden />
      <LazyAssessmentMarkScheme />
      <LazyAssessmentCurriculumWording />
      <LazyAssessmentExportCircle />
      <LazyAssessmentCta />
    </>
  )
}
