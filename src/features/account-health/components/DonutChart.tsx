// Lightweight inline SVG donut chart — no chart library.
import type { NfrDonutSlice } from '../types/account-health.types'

interface Props {
  slices: NfrDonutSlice[]
  toggle: 'amount' | 'count'
  noDataLabel: string
  size?: number
}

const CX = 80
const CY = 80
const R_OUTER = 62
const R_INNER = 38

function toPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const x1 = cx + r * Math.cos(rad(startAngle))
  const y1 = cy + r * Math.sin(rad(startAngle))
  const x2 = cx + r * Math.cos(rad(endAngle))
  const y2 = cy + r * Math.sin(rad(endAngle))
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function DonutChart({ slices, toggle, noDataLabel, size = 160 }: Props) {
  if (slices.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 160 160" aria-hidden="true">
          {/* Empty ring */}
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#e5e7eb" strokeWidth={R_OUTER - R_INNER} />
          <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#9ca3af">
            {noDataLabel}
          </text>
        </svg>
      </div>
    )
  }

  const total = slices.reduce(
    (sum, s) => sum + (toggle === 'amount' ? s.valueAmount : s.valueCount),
    0,
  )

  let angle = -90
  const paths: Array<{ d1: string; d2: string; color: string; label: string }> = []

  for (const slice of slices) {
    const val = toggle === 'amount' ? slice.valueAmount : slice.valueCount
    const sweep = total > 0 ? (val / total) * 360 : 0
    const outer1 = toPath(CX, CY, R_OUTER, angle, angle + sweep)
    const inner2 = toPath(CX, CY, R_INNER, angle + sweep, angle)
    paths.push({
      d1: `${outer1} L ${CX + R_INNER * Math.cos(((angle + sweep) * Math.PI) / 180)} ${CY + R_INNER * Math.sin(((angle + sweep) * Math.PI) / 180)} ${inner2} Z`,
      d2: '',
      color: slice.color,
      label: slice.label,
    })
    angle += sweep
  }

  return (
    <svg width={size} height={size} viewBox="0 0 160 160" aria-hidden="true">
      {paths.map((p, i) => (
        <path key={i} d={p.d1} fill={p.color} />
      ))}
    </svg>
  )
}
