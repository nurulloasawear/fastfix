import { useTranslation } from 'react-i18next'
import { formatBytes } from './format'
import type { MediaStorage } from '../types/shop.types'

export function StorageBar({ storage }: { storage: MediaStorage }) {
  const { t } = useTranslation()
  const pct = storage.totalBytes ? Math.min(100, (storage.usedBytes / storage.totalBytes) * 100) : 0

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4 shadow-xs sm:flex-row sm:items-center">
      <div>
        <h4 className="text-sm font-semibold text-text">{t('shop.media.storageTitle')}</h4>
        <p className="text-xs text-muted">
          {t('shop.media.storageUsed', {
            used: formatBytes(storage.usedBytes),
            total: formatBytes(storage.totalBytes),
          })}
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg sm:w-64">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
