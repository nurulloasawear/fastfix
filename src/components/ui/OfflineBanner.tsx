import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

// Lightweight offline state (OD-002, RTS-010) — replaces the browser's "Chrome
// dino" with a branded banner + retry. No service worker; just online/offline events.
export function OfflineBanner() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[110] flex items-center justify-center gap-3 bg-error px-4 py-2 text-sm font-medium text-white">
      <span>{t('common.offline', 'Internet aloqasi yoʻq')}</span>
      <button
        type="button"
        onClick={() => {
          if (navigator.onLine) {
            setOnline(true)
            void qc.invalidateQueries()
          }
        }}
        className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold transition-colors hover:bg-white/30"
      >
        {t('common.retry', 'Qayta urinish')}
      </button>
    </div>
  )
}
