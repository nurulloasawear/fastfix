import { useTranslation } from 'react-i18next'
import { formatUZS } from '@/utils/money'
import type { ChannelCard } from '../types/insights.types'

type Props = { channels: ChannelCard[] }

export function ChannelBreakdown({ channels }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">
          {t('insights.overview.shopSalesBreakdown')}
        </h3>
        <span className="text-xs font-semibold text-brand">
          {t('insights.overview.adsContribution')}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`flex min-w-[120px] flex-1 flex-col gap-1 rounded-lg border px-3 py-2.5 ${
              ch.id === 'total'
                ? 'border-brand bg-brand/5'
                : 'border-border bg-surface'
            }`}
          >
            <span className="text-xs text-muted">{ch.name}</span>
            <span className="text-sm font-semibold text-text">{formatUZS(ch.salesUzs)}</span>
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-medium ${ch.deltaPct >= 0 ? 'text-success' : 'text-error-text'}`}
              >
                {ch.deltaPct >= 0 ? '+' : ''}{ch.deltaPct.toFixed(2)}%
              </span>
              <span className="text-xs text-muted">{t('insights.vsPrevDay')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
