import FaqHeroSection from '@marketing/components/faq/FaqHeroSection'
import FaqStateProvider from '@marketing/components/faq/FaqStateProvider'
import FaqSupportSection from '@marketing/components/faq/FaqSupportSection'
import LazyFaqTopicsSection from '@marketing/components/faq/LazyFaqTopicsSection'

export default function FaqPage() {
  return (
    <FaqStateProvider>
      <div className="faq-page min-h-[calc(100vh-4rem)] bg-white">
        <FaqHeroSection />
        <LazyFaqTopicsSection />
        <FaqSupportSection />
      </div>
    </FaqStateProvider>
  )
}


