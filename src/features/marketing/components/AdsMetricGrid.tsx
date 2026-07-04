import { useTranslation } from 'react-i18next'
import { formatUZS } from '@/utils/money'
import type { AdsMetrics } from '../types/marketing.types'

type Props = { metrics: AdsMetrics; active: MetricKey; onSelect: (key: MetricKey) => void }

export type MetricKey = keyof AdsMetrics

const ORDER: { key: MetricKey; i18n: string; fmt: (m: AdsMetrics) => string }[] = [
  { key: 'impressions', i18n: 'impressions', fmt: (m) => m.impressions.toLocaleString('ru-RU') },
  { key: 'clicks', i18n: 'clicks', fmt: (m) => m.clicks.toLocaleString('ru-RU') },
  { key: 'ctr', i18n: 'ctr', fmt: (m) => `${m.ctr}%` },
  { key: 'orders', i18n: 'orders', fmt: (m) => String(m.orders) },
  { key: 'itemsSold', i18n: 'itemsSold', fmt: (m) => String(m.itemsSold) },
  { key: 'gmvUzs', i18n: 'gmv', fmt: (m) => formatUZS(m.gmvUzs) },
  { key: 'expenseUzs', i18n: 'expense', fmt: (m) => formatUZS(m.expenseUzs) },
  { key: 'roas', i18n: 'roas', fmt: (m) => m.roas.toFixed(2) },
]

export function AdsMetricGrid({ metrics, active, onSelect }: Props) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ORDER.map(({ key, i18n, fmt }) => {
        const isActive = key === active
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors cursor-pointer hover:border-brand ${
              isActive ? 'border-brand bg-table-header' : 'border-border bg-surface'
            }`}
          >
            <span className="text-xs font-medium text-muted">{t(`marketing.ads.metric.${i18n}`)}</span>
            <strong className="text-lg font-semibold text-text">{fmt(metrics)}</strong>
          </button>
        )
      })}
    </div>
  )
}
