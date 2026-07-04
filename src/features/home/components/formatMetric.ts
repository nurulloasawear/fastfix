import { formatUZS } from '@/utils/money'
import type { InsightMetric } from '../types/home.types'

// Formats one metricʻs value: money → formatUZS, percent → "xx.xx%", else a plain count.
// Shared by the KPI grid and the grouped metric rows.
export function formatMetricValue(metric: InsightMetric): string {
  if (metric.amountUzs != null) return formatUZS(metric.amountUzs)
  if (metric.percent != null) return `${metric.percent.toFixed(2)}%`
  return String(metric.count)
}
