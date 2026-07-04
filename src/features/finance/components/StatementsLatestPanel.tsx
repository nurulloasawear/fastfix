import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import type { IncomeStatement } from '../types/finance.types'

type Props = {
  statements: IncomeStatement[]
  onDownload: (id: string) => void
  onDismiss: () => void
}

export function StatementsLatestPanel({ statements, onDownload, onDismiss }: Props) {
  const { t } = useTranslation()
  const undownloaded = statements.filter((s) => s.downloadedAt === null)

  if (undownloaded.length === 0) return null

  return (
    <div className="absolute right-0 top-0 z-10 w-72 rounded-lg border border-border bg-surface shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-text">{t('finance.statements.latestTitle')}</h3>
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted hover:text-text"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Warning banner */}
      <div className="mx-3 mt-3 rounded-lg bg-warning-bg px-3 py-2">
        <p className="text-xs text-warning">{t('finance.statements.latestBanner')}</p>
      </div>

      {/* List */}
      <div className="px-3 py-2">
        <div className="mb-1 grid grid-cols-2 text-xs font-medium text-muted">
          <span>{t('finance.statements.latestColName')}</span>
          <span className="text-right">{t('finance.statements.latestColAction')}</span>
        </div>
        {undownloaded.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-2 border-b border-border py-2 last:border-0">
            <span className="truncate text-xs text-text-secondary">{s.filename}</span>
            <Button size="sm" onClick={() => onDownload(s.id)}>
              {t('finance.statements.download')}
            </Button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-3 py-2 text-xs text-muted">
        {t('finance.statements.latestFooter')}{' '}
        <a href="/finance/reports" className="font-semibold text-brand hover:underline">
          {t('finance.statements.myReports')}
        </a>
      </div>
    </div>
  )
}
