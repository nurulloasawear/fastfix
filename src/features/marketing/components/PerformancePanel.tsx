// Reusable KPI performance panel (Flash Deals, Vouchers, etc.)
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { formatUZS } from '@/utils/money'

export interface KpiItem {
  labelKey: string
  value: string | number
  prevDelta?: string
  isMoney?: boolean
  isPercent?: boolean
}

interface Props {
  titleKey: string
  dateRange: string
  kpis: KpiItem[]
  moreKey?: string
  onMore?: () => void
}

export function PerformancePanel({ titleKey, dateRange, kpis, moreKey, onMore }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-base font-semibold text-text">{t(titleKey)}</span>
          <span className="ml-2 text-xs text-muted">{dateRange}</span>
        </div>
        {moreKey && (
          <Button variant="ghost" size="sm" onClick={onMore}>
            {t(moreKey)}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((kpi) => {
          const formatted = kpi.isMoney
            ? formatUZS(Number(kpi.value))
            : kpi.isPercent
            ? `${kpi.value}%`
            : String(kpi.value)
          return (
            <StatCard
              key={kpi.labelKey}
              label={t(kpi.labelKey)}
              value={formatted}
              delta={kpi.prevDelta ? { value: kpi.prevDelta, positive: true } : undefined}
            />
          )
        })}
      </div>
    </Card>
  )
}
