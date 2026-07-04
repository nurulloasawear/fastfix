import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import type { InsightMetric } from '../types/home.types'
import { formatMetricValue } from './formatMetric'

type Props = { metric: InsightMetric }

// A single label + trend + value block, used inside grouped rows. `metric.key`
// resolves to home.insights.metric.<key>; trend is rendered as a success pill.
export function MetricCell({ metric }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-muted">
          {t(`home.insights.metric.${metric.key}`)}
        </span>
        {metric.trendPct != null && <Badge tone="success">+{metric.trendPct.toFixed(2)}%</Badge>}
      </div>
      <strong className="text-base font-semibold text-text">{formatMetricValue(metric)}</strong>
    </div>
  )
}
