import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdsTimeseries } from '../types/marketing.types'

const W = 880
const H = 170

function buildPath(values: number[], w: number, h: number): string {
  if (values.length === 0) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w
      const y = h - ((v - min) / range) * (h - 20) - 10
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

type Props = { series: AdsTimeseries }

export function AdsChart({ series }: Props) {
  const { t } = useTranslation()
  const impPath = useMemo(() => buildPath(series.impressions, W, H), [series.impressions])
  const roasPath = useMemo(() => buildPath(series.roas, W, H), [series.roas])
  const midIdx = Math.floor((series.labels.length - 1) / 2)
  const axisLabels = series.labels.length > 0
    ? [series.labels[0], series.labels[midIdx], series.labels[series.labels.length - 1]]
    : []

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-44 w-full" aria-hidden="true">
        <path d={impPath} fill="none" strokeWidth={2} className="stroke-success" />
        <path d={roasPath} fill="none" strokeWidth={2} className="stroke-brand" />
      </svg>

      <div className="mt-2 flex justify-between text-xs text-muted">
        {axisLabels.map((label) => <span key={label}>{label}</span>)}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-success" />
          {t('marketing.ads.legend.impressions')}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-brand" />
          {t('marketing.ads.legend.roas')}
        </span>
      </div>
    </div>
  )
}
