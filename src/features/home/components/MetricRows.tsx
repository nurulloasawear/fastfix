import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import type { InsightMetricRow } from '../types/home.types'
import { MetricCell } from './MetricCell'

type Props = { titleKey: string; rows: InsightMetricRow[] }

// Grouped metric rows used by the product-overview and sales-services tabs.
// Each row may carry an optional heading (titleKey) on the left.
export function MetricRows({ titleKey, rows }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="flex flex-col gap-4 p-6">
      <h2 className="text-base font-semibold text-text">{t(titleKey)}</h2>

      <div className="flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:gap-6">
            {row.titleKey && (
              <div className="w-40 shrink-0 text-sm font-semibold text-text-secondary">
                {t(row.titleKey)}
              </div>
            )}
            <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {row.metrics.map((metric) => (
                <MetricCell key={`${row.id}-${metric.key}`} metric={metric} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
