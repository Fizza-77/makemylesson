import SlideDeckCta from '@marketing/components/features/SlideDeckCta'
import SlideDeckHowItWorks from '@marketing/components/features/SlideDeckHowItWorks'
import SlideDeckNextStages from '@marketing/components/features/SlideDeckNextStages'
import SlideDeckStageHero from '@marketing/components/features/SlideDeckStageHero'
import {
  LazySlideDeckDuration,
  LazySlideDeckSequence,
  LazySlideDeckSpeakerNotes,
} from '@marketing/components/features/lazy/SlideDeckLazySections'

export default function SlideDeckStage() {
  return (
    <>
      <div className="fp-shell px-4 pb-2 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <SlideDeckStageHero />
      </div>
      <div className="h-10 bg-white sm:h-14" aria-hidden />
      <SlideDeckHowItWorks />
      <div className="h-[1cm] bg-white" aria-hidden />
      <LazySlideDeckSequence />
      <LazySlideDeckSpeakerNotes />
      <LazySlideDeckDuration />
      <SlideDeckNextStages />
      <SlideDeckCta />
    </>
  )
}
