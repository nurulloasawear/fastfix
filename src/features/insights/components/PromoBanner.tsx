import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

// Dismissible achievement banner — shown at top of each insights page.
export function PromoBanner() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-success-bg px-4 py-3">
      <div className="flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" className="text-success"/>
          <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-success"/>
        </svg>
        <p className="text-sm font-semibold text-success">
          {t('insights.promoBanner.title')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm">
          {t('insights.learnMore')}
        </Button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 text-muted hover:bg-bg hover:text-text transition-colors"
          aria-label={t('insights.promoBanner.dismiss')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
