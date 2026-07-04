import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/ui/StatCard'
import type { InsightMetric } from '../types/home.types'
import { formatMetricValue } from './formatMetric'

type Props = { metrics: InsightMetric[] }

// KPI tiles for the dashboard/marketing tabs. Highlighted tiles get the brand
// accent border. Trend delta shown as success/error colour when present.
export function MetricCardGrid({ metrics }: Props) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {metrics.map((metric) => {
        const trendValue =
          metric.trendPct != null
            ? `${metric.trendPct >= 0 ? '+' : ''}${metric.trendPct.toFixed(2)}%`
            : undefined

        return (
          <StatCard
            key={metric.key}
            label={t(`home.insights.metric.${metric.key}`)}
            value={formatMetricValue(metric)}
            delta={
              trendValue != null
                ? { value: trendValue, positive: (metric.trendPct ?? 0) >= 0 }
                : undefined
            }
            className={metric.highlighted ? 'border-brand' : ''}
          />
        )
      })}
    </div>
  )
}
