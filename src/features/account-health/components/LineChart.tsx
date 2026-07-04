// Lightweight inline SVG line chart — no chart library.
// Renders a data series + an optional dashed threshold line.
import { useId } from 'react'
import type { CSSProperties } from 'react'

interface DataPoint {
  label: string   // x-axis tick label
  value: number   // y value (0–maxY)
}

interface Props {
  data: DataPoint[]
  maxY: number
  thresholdY?: number          // dashed red line at this value
  thresholdLabel?: string
  yLabels?: string[]           // explicit y-axis labels (high→low)
  lineColor?: string
  dotColor?: string
  height?: number
}

const SVG_W = 600
const PAD_L = 52
const PAD_R = 16
const PAD_T = 12
const PAD_B = 36

export function LineChart({
  data,
  maxY,
  thresholdY,
  thresholdLabel,
  yLabels,
  lineColor = '#2d201c',
  dotColor = '#2d201c',
  height = 220,
}: Props) {
  const SVG_H = height
  const chartW = SVG_W - PAD_L - PAD_R
  const chartH = SVG_H - PAD_T - PAD_B

  function xOf(i: number) {
    if (data.length <= 1) return PAD_L + chartW / 2
    return PAD_L + (i / (data.length - 1)) * chartW
  }

  function yOf(val: number) {
    return PAD_T + chartH - (val / maxY) * chartH
  }

  const points = data.map((d, i) => ({ x: xOf(i), y: yOf(d.value), label: d.label, value: d.value }))

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  // Threshold line y coordinate
  const threshY = thresholdY !== undefined ? yOf(thresholdY) : null

  // Y axis ticks — 5 steps
  const yTicks = yLabels ?? Array.from({ length: 5 }, (_, i) => {
    const v = maxY * (1 - i / 4)
    if (Number.isInteger(v)) return `${v}%`
    return `${v.toFixed(2)}%`
  })

  // X axis: show at most ~8 labels evenly spaced
  const step = Math.max(1, Math.floor(data.length / 8))
  const xTickIdxs = data.map((_, i) => i).filter((i) => i % step === 0 || i === data.length - 1)

  // Unique, stable key for <defs> (no impure Math.random in render)
  const gradId = useId()

  const viewBox = `0 0 ${SVG_W} ${SVG_H}`

  const svgStyle: CSSProperties = { width: '100%', height: SVG_H, display: 'block' }

  return (
    <svg viewBox={viewBox} style={svgStyle} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.1" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Y gridlines */}
      {yTicks.map((label, i) => {
        const y = PAD_T + (i / (yTicks.length - 1)) * chartH
        return (
          <g key={label}>
            <line x1={PAD_L} x2={SVG_W - PAD_R} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
              {label}
            </text>
          </g>
        )
      })}

      {/* Threshold line */}
      {threshY !== null && threshY !== undefined && (
        <g>
          <line
            x1={PAD_L} x2={SVG_W - PAD_R}
            y1={threshY} y2={threshY}
            stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,4"
          />
          {thresholdLabel && (
            <text x={SVG_W - PAD_R + 2} y={threshY + 4} fontSize="8" fill="#ef4444">
              {thresholdLabel}
            </text>
          )}
        </g>
      )}

      {/* Area fill */}
      {points.length > 1 && (
        <polygon
          points={`${PAD_L},${PAD_T + chartH} ${polyline} ${SVG_W - PAD_R},${PAD_T + chartH}`}
          fill={`url(#${gradId})`}
        />
      )}

      {/* Data line */}
      {points.length > 1 && (
        <polyline points={polyline} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />
      )}

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={dotColor} stroke="white" strokeWidth="1.5" />
      ))}

      {/* X axis labels */}
      {xTickIdxs.map((i) => {
        const p = points[i]
        return (
          <text key={i} x={p.x} y={SVG_H - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">
            {p.label}
          </text>
        )
      })}
    </svg>
  )
}
