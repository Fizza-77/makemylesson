'use client'

import ActivityCta from '@marketing/components/features/ActivityCta'
import ActivityHowItWorks from '@marketing/components/features/ActivityHowItWorks'
import ActivityMethodShape from '@marketing/components/features/ActivityMethodShape'
import ActivityNextStages from '@marketing/components/features/ActivityNextStages'
import ActivityStageHero from '@marketing/components/features/ActivityStageHero'
import ActivityTakeAnywhere from '@marketing/components/features/ActivityTakeAnywhere'
import ActivityTeacherCopy from '@marketing/components/features/ActivityTeacherCopy'
import ActivityTypes from '@marketing/components/features/ActivityTypes'
import AssessmentCta from '@marketing/components/features/AssessmentCta'
import AssessmentCurriculumWording from '@marketing/components/features/AssessmentCurriculumWording'
import AssessmentExportCircle from '@marketing/components/features/AssessmentExportCircle'
import AssessmentHowItWorks from '@marketing/components/features/AssessmentHowItWorks'
import AssessmentMarkScheme from '@marketing/components/features/AssessmentMarkScheme'
import AssessmentPaperStyles from '@marketing/components/features/AssessmentPaperStyles'
import AssessmentStageHero from '@marketing/components/features/AssessmentStageHero'
import FeatureStageSelector from '@marketing/components/features/FeatureStageSelector'
import LessonPlanCognitiveBalance from '@marketing/components/features/LessonPlanCognitiveBalance'
import LessonPlanCta from '@marketing/components/features/LessonPlanCta'
import LessonPlanDifferentiation from '@marketing/components/features/LessonPlanDifferentiation'
import LessonPlanHowItWorks from '@marketing/components/features/LessonPlanHowItWorks'
import LessonPlanNextStages from '@marketing/components/features/LessonPlanNextStages'
import LessonPlanStageHero from '@marketing/components/features/LessonPlanStageHero'
import LessonPlanTakeAnywhere from '@marketing/components/features/LessonPlanTakeAnywhere'
import LessonPlanWhatsInside from '@marketing/components/features/LessonPlanWhatsInside'
import SlideDeckCta from '@marketing/components/features/SlideDeckCta'
import SlideDeckDuration from '@marketing/components/features/SlideDeckDuration'
import SlideDeckHowItWorks from '@marketing/components/features/SlideDeckHowItWorks'
import SlideDeckNextStages from '@marketing/components/features/SlideDeckNextStages'
import SlideDeckSequence from '@marketing/components/features/SlideDeckSequence'
import SlideDeckSpeakerNotes from '@marketing/components/features/SlideDeckSpeakerNotes'
import SlideDeckStageHero from '@marketing/components/features/SlideDeckStageHero'
import {
  FEATURE_STAGE_ITEMS,
  getFeatureBySlug,
} from '@marketing/data/features'

const DEFAULT_STAGE = FEATURE_STAGE_ITEMS[0].slug

function resolveStage(stage) {
  return getFeatureBySlug(stage) ? stage : DEFAULT_STAGE
}

function LessonPlanStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <LessonPlanStageHero />
        <LessonPlanHowItWorks />
      </div>
      <LessonPlanWhatsInside />
      <div className="h-[1cm] bg-white" aria-hidden />
      <LessonPlanDifferentiation />
      <LessonPlanCognitiveBalance />
      <LessonPlanTakeAnywhere />
      <LessonPlanNextStages />
      <LessonPlanCta />
    </>
  )
}

function SlideDeckStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <SlideDeckStageHero />
      </div>
      <div className="h-10 bg-white sm:h-14" aria-hidden />
      <SlideDeckHowItWorks />
      <div className="h-[1cm] bg-white" aria-hidden />
      <SlideDeckSequence />
      <SlideDeckSpeakerNotes />
      <SlideDeckDuration />
      <SlideDeckNextStages />
      <SlideDeckCta />
    </>
  )
}

function ActivityStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <ActivityStageHero />
      </div>
      <ActivityHowItWorks />
      <div className="h-[1cm] bg-white" aria-hidden />
      <ActivityTypes />
      <div className="h-[1cm] bg-white" aria-hidden />
      <ActivityTeacherCopy />
      <ActivityMethodShape />
      <ActivityTakeAnywhere />
      <ActivityNextStages />
      <ActivityCta />
    </>
  )
}

function AssessmentStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <AssessmentStageHero />
      </div>
      <AssessmentHowItWorks />
      <AssessmentPaperStyles />
      <div className="h-[1cm] bg-white" aria-hidden />
      <AssessmentMarkScheme />
      <AssessmentCurriculumWording />
      <AssessmentExportCircle />
      <AssessmentCta />
    </>
  )
}

function StageContent({ slug }) {
  switch (slug) {
    case 'presentation-maker':
      return <SlideDeckStage />
    case 'classroom-activities':
      return <ActivityStage />
    case 'test-generator':
      return <AssessmentStage />
    case 'lesson-plan-generator':
    default:
      return <LessonPlanStage />
  }
}

export default function FeaturesPage({ stageSlug }) {
  const activeSlug = resolveStage(stageSlug)

  return (
    <div className="tm-page-wrap min-h-[calc(100vh-4rem)] bg-white">
      <FeatureStageSelector activeSlug={activeSlug} />
      <div key={activeSlug}>
        <StageContent slug={activeSlug} />
      </div>
    </div>
  )
}
