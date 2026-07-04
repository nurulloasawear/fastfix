import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import type { ChatMetricsResponse } from '../types/customer-service.types'
import { InfoIcon, TrendDownIcon, TrendUpIcon } from './icons'

type Props = { data?: ChatMetricsResponse; isLoading: boolean }

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

function DeltaPill({ pct }: { pct: number | null }) {
  const { t } = useTranslation()
  if (pct === null) {
    return <span className="text-xs text-muted">{t('customerService.chatManagement.performance.noData')}</span>
  }
  const positive = pct >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-success' : 'text-error'}`}>
      {positive ? <TrendUpIcon size={12} /> : <TrendDownIcon size={12} />}
      {Math.abs(pct).toFixed(2)}%
    </span>
  )
}

export function ChatPerformanceCard({ data, isLoading }: Props) {
  const { t } = useTranslation()
  const m = data?.metrics

  const tiles = [
    {
      label: t('customerService.chatManagement.performance.enquiry'),
      value: isLoading ? '—' : String(m?.enquiryCount ?? 0),
      delta: m?.enquiryDeltaPct ?? null,
    },
    {
      label: t('customerService.chatManagement.performance.responseRate'),
      value: isLoading ? '—' : m?.responseRate == null ? '-' : `${m.responseRate}%`,
      delta: m?.responseDeltaPct ?? null,
    },
    {
      label: t('customerService.chatManagement.performance.responseTime'),
      value: isLoading ? '—' : formatTime(m?.avgResponseTimeSeconds ?? 0),
      delta: m?.enquiryDeltaPct ?? null,
    },
  ]

  const period = data
    ? t('customerService.chatManagement.performance.period', {
        from: data.periodStart,
        to: data.periodEnd,
      })
    : ''

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text">
            {t('customerService.chatManagement.performance.title')}
          </span>
          {period && <span className="text-xs text-muted">({period})</span>}
        </div>
        <button type="button" className="text-xs text-brand hover:underline">
          {t('customerService.chatManagement.performance.more')} &rsaquo;
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        {tiles.map((tile) => (
          <div key={tile.label} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
            <div className="flex items-center gap-1 text-xs text-muted">
              {tile.label}
              <InfoIcon size={12} className="text-muted" />
            </div>
            <div className="text-2xl font-semibold text-text">{tile.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <span>{t('customerService.chatManagement.performance.vsPrev')}</span>
              <DeltaPill pct={tile.delta} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
