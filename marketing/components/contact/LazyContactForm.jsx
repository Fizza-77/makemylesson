'use client'

import { Suspense, useEffect, useRef, useState } from 'react'

function ContactFormFallback() {
  return (
    <div
      className="min-h-[28rem] rounded-[28px] bg-[#242845]/40 sm:rounded-[32px]"
      aria-hidden
    />
  )
}

export default function LazyContactForm({ initialSubject = '' }) {
  const rootRef = useRef(null)
  const [Form, setForm] = useState(null)

  useEffect(() => {
    if (Form) return

    const load = () => {
      void import('@marketing/components/contact/ContactForm').then((module) => {
        setForm(() => module.default)
      })
    }

    // Subject deep-links should mount the form promptly so it can preselect.
    if (initialSubject) {
      load()
      return
    }

    const el = rootRef.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      load()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load()
          observer.disconnect()
        }
      },
      { rootMargin: '280px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [Form, initialSubject])

  return (
    <div ref={rootRef} className="scroll-mt-28" id="contact-form-section">
      {Form ? (
        <Suspense fallback={<ContactFormFallback />}>
          <Form initialSubject={initialSubject} />
        </Suspense>
      ) : (
        <div id="contact-form">
          <ContactFormFallback />
        </div>
      )}
    </div>
  )
}
