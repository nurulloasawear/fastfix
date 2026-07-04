// Inline-SVG trapezoid funnel — proportional band heights.
type FunnelTier = {
  label: string
  value: number
  convRate?: number   // % conversion label on the right side
  color: string
}

type Props = {
  tiers: FunnelTier[]
  width?: number
  height?: number
}

export function FunnelDiagram({ tiers, width = 200, height = 260 }: Props) {
  const bandH = height / tiers.length
  const maxW = width * 0.85
  const minW = width * 0.35

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-label="Funnel diagram">
      {tiers.map((tier, i) => {
        const w = minW + (maxW - minW) * (1 - i / Math.max(tiers.length - 1, 1))
        const nextW = i < tiers.length - 1
          ? minW + (maxW - minW) * (1 - (i + 1) / Math.max(tiers.length - 1, 1))
          : minW
        const y = i * bandH
        const cx = width / 2
        const x1 = cx - w / 2
        const x2 = cx + w / 2
        const nx1 = cx - nextW / 2
        const nx2 = cx + nextW / 2

        return (
          <g key={tier.label}>
            <polygon
              points={`${x1},${y} ${x2},${y} ${nx2},${y + bandH} ${nx1},${y + bandH}`}
              fill={tier.color}
              opacity={0.85}
            />
            {/* Label inside */}
            <text
              x={cx}
              y={y + bandH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9"
              fontWeight="600"
              fill="#fff"
            >
              {tier.label}
            </text>
            {/* Conv rate on right */}
            {tier.convRate !== undefined && i > 0 && (
              <text
                x={nx2 + 6}
                y={y + bandH * 0.5}
                fontSize="8"
                fill="#374151"
                dominantBaseline="central"
              >
                {tier.convRate.toFixed(2)}%
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
