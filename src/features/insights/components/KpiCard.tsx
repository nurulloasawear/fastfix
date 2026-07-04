import { formatUZS } from '@/utils/money'
import type { KpiMetric } from '../types/insights.types'

type Props = {
  metric: KpiMetric
  label: string
  size?: 'sm' | 'md'
}

function DeltaBadge({ delta }: { delta: number }) {
  const isPositive = delta >= 0
  const color = isPositive ? 'text-success' : 'text-error-text'
  const sign = isPositive ? '+' : ''
  return (
    <span className={`text-xs font-medium ${color}`}>
      {sign}{delta.toFixed(2)}%
    </span>
  )
}

export function KpiCard({ metric, label, size = 'md' }: Props) {
  const { value, delta, isMonetary, isPercent } = metric

  function formatValue(v: number): string {
    if (isMonetary) return formatUZS(v)
    if (isPercent) return `${v.toFixed(2)}%`
    return v.toLocaleString('ru-RU')
  }

  return (
    <div className={`flex flex-col gap-1 ${size === 'sm' ? 'p-2' : 'p-3'}`}>
      <span className={`font-semibold text-text ${size === 'sm' ? 'text-base' : 'text-xl'}`}>
        {formatValue(value)}
      </span>
      <div className="flex flex-wrap items-center gap-1">
        <DeltaBadge delta={delta} />
      </div>
      <span className="text-xs text-muted leading-tight">{label}</span>
    </div>
  )
}
