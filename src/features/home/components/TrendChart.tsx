import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { InsightChartSeries } from '../types/home.types'

const W = 880
const H = 170
const AXIS = ['0:00', '06:00', '12:00', '18:00', '24:00']

// Literal class pairs (line stroke + legend dot bg) so Tailwind's JIT keeps them.
// Sales = success green, Orders = accent yellow, Conversion = brand brown.
type Series = { key: keyof InsightChartSeries; line: string; dot: string }
const ALL_SERIES: Series[] = [
  { key: 'sales', line: 'stroke-success', dot: 'bg-success' },
  { key: 'orders', line: 'stroke-accent', dot: 'bg-accent' },
  { key: 'conversion', line: 'stroke-brand', dot: 'bg-brand' },
]

// Each series is normalized to its OWN min/max so all lines stay visible.
function buildPath(values: number[]): string {
  if (values.length === 0) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W
      const y = H - ((v - min) / range) * (H - 18) - 9
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

type Props = { chart: InsightChartSeries; showConversion: boolean }

export function TrendChart({ chart, showConversion }: Props) {
  const { t } = useTranslation()
  const series = showConversion ? ALL_SERIES : ALL_SERIES.filter((s) => s.key !== 'conversion')

  const paths = useMemo(
    () => series.map((s) => ({ key: s.key, line: s.line, d: buildPath(chart[s.key]) })),
    [chart, series],
  )

  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-44 w-full"
        aria-hidden="true"
      >
        {paths.map((p) => (
          <path key={p.key} d={p.d} fill="none" strokeWidth={2} className={p.line} />
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-xs text-muted">
        {AXIS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs font-medium text-muted">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <i className={`h-2 w-2 rounded-full ${s.dot}`} />
            {t(`home.insights.series.${s.key}`)}
          </span>
        ))}
      </div>
    </div>
  )
}
