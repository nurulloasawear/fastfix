import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import type { DataPeriodMode, OrderTypeFilter } from '../types/insights.types'

type Props = {
  mode: DataPeriodMode
  orderType: OrderTypeFilter
  onModeChange?: (m: DataPeriodMode) => void
  onOrderTypeChange?: (t: OrderTypeFilter) => void
  supportedModes?: DataPeriodMode[]
  showExport?: boolean
  onExport?: () => void
}

// Calendar inline SVG icon
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2.5" width="12" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// Chevron down inline SVG
function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Download icon
function DownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 11h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

const MODE_LABELS: Record<DataPeriodMode, string> = {
  realtime: 'realTime',
  day: 'byDay',
  month: 'byMonth',
}

export function DataPeriodBar({
  mode,
  orderType,
  onModeChange,
  onOrderTypeChange,
  supportedModes = ['realtime', 'day', 'month'],
  showExport = true,
  onExport,
}: Props) {
  const { t } = useTranslation()

  const modeLabel = t(`insights.${MODE_LABELS[mode]}`)

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
      {/* Data period dropdown */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted">{t('insights.dataPeriod')}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text hover:bg-bg"
          onClick={() => {
            if (!onModeChange) return
            const idx = supportedModes.indexOf(mode)
            onModeChange(supportedModes[(idx + 1) % supportedModes.length])
          }}
        >
          <CalIcon />
          {modeLabel}
          <ChevronDown />
        </button>
      </div>

      {/* Order type dropdown */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted">{t('insights.orderType')}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text hover:bg-bg"
          onClick={() => onOrderTypeChange?.(orderType === 'paid' ? 'all' : 'paid')}
        >
          {orderType === 'paid' ? t('insights.paidOrder') : t('insights.allOrders')}
          <ChevronDown />
        </button>
      </div>

      {showExport && (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={onExport}
        >
          <DownIcon />
          {t('insights.exportData')}
        </Button>
      )}
    </div>
  )
}
