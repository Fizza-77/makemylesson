'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { cn } from '@marketing/lib/cn'

export default function ContactToast({ message, variant = 'info', onDismiss }) {
  useEffect(() => {
    if (!message || !onDismiss) return undefined
    const t = setTimeout(onDismiss, variant === 'success' ? 6000 : 5000)
    return () => clearTimeout(t)
  }, [message, variant, onDismiss])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'fixed bottom-6 left-4 right-4 z-[1200] mx-auto flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg sm:left-auto sm:right-6',
            variant === 'success' &&
              'border-mml-teal/40 bg-mml-navy text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
            variant === 'error' &&
              'border-red-400/30 bg-mml-navy text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
            variant === 'info' && 'border-white/15 bg-mml-navy-mid text-white',
          )}
        >
          {variant === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mml-teal" aria-hidden />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden />
          )}
          <p className="min-w-0 flex-1 text-sm leading-snug">{message}</p>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 rounded-md p-1 text-white transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}


