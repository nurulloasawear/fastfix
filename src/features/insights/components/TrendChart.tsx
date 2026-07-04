// Lightweight inline SVG line chart — no external chart library.
import { useState } from 'react'
import type { TrendPoint } from '../types/insights.types'

// Palette for up to 4 series
const COLORS = ['#e55b2b', '#3b82f6', '#10b981', '#f59e0b']

type ChipOption = { key: string; label: string }

type Props = {
  points: TrendPoint[]
  seriesKeys: string[]          // which keys from TrendPoint.values to draw
  labels?: ChipOption[]         // chip toggle options
  height?: number
  className?: string
}

function buildPath(xs: number[], ys: number[], width: number, height: number): string {
  if (xs.length < 2) return ''
  const pad = 4
  const w = width - pad * 2
  const h = height - pad * 2
  const maxY = Math.max(...ys, 1)
  const pts = xs.map((_, i) => {
    const px = pad + (i / (xs.length - 1)) * w
    const py = pad + h - (ys[i] / maxY) * h
    return `${px.toFixed(1)},${py.toFixed(1)}`
  })
  return `M ${pts.join(' L ')}`
}

export function TrendChart({ points, seriesKeys, labels = [], height = 120, className = '' }: Props) {
  const [active, setActive] = useState<Set<string>>(new Set(seriesKeys.slice(0, 2)))

  const W = 640
  const H = height

  const xs = points.map((_, i) => i)
  const xLabels = points.map((p) => p.label)

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Chip toggles */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {labels.map((c, ci) => {
            const on = active.has(c.key)
            const color = COLORS[ci % COLORS.length]
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  const next = new Set(active)
                  if (on) next.delete(c.key)
                  else next.add(c.key)
                  setActive(next)
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${
                  on ? 'border-transparent text-text' : 'border-border text-muted'
                }`}
                style={{ backgroundColor: on ? `${color}18` : undefined }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: on ? color : '#d1d5db' }}
                />
                {c.label}
              </button>
            )
          })}
        </div>
      )}

      {/* SVG chart */}
      <div className="w-full overflow-hidden rounded-lg border border-border bg-surface">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: `${H}px` }}
          aria-label="Trend chart"
        >
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1={0} y1={H * frac} x2={W} y2={H * frac}
              stroke="#f2f4f7" strokeWidth="1"
            />
          ))}

          {/* Series lines */}
          {seriesKeys.filter((k) => active.has(k)).map((k, si) => {
            const ys = points.map((p) => p.values[k] ?? 0)
            const d = buildPath(xs, ys, W, H - 20)
            const color = COLORS[si % COLORS.length]
            return (
              <path
                key={k}
                d={d}
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between border-t border-border px-1 py-1">
          {xLabels.filter((_, i) => i % Math.ceil(xLabels.length / 8) === 0).map((l) => (
            <span key={l} className="text-[10px] text-muted">{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
