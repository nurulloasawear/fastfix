import { useTranslation } from 'react-i18next'
import type { FaqOverviewMetrics } from '../types/customer-service.types'
import { InfoIcon } from './icons'

type Props = { metrics: FaqOverviewMetrics }

// Four-tier inverted funnel SVG. Colours from Shopee reference (blues + brand orange).
const TIER_COLORS = ['#4a90d9', '#5ba3e0', '#7fbde0', '#e86c2e']
const TIER_W = [240, 200, 160, 120]  // widths for the funnel tiers
const TIER_H = 56
const SVG_W = 280
const SVG_H = TIER_H * 4 + 8

export function FaqFunnelChart({ metrics }: Props) {
  const { t } = useTranslation()

  const ctr =
    metrics.faqTriggered > 0
      ? ((metrics.faqClicked / metrics.faqTriggered) * 100).toFixed(2)
      : '0.00'

  const resolutionRate =
    metrics.faqClicked > 0
      ? ((metrics.questionResolved / metrics.faqClicked) * 100).toFixed(2)
      : '0.00'

  const helpfulRate =
    metrics.helpfulClicks + metrics.unhelpfulClicks > 0
      ? ((metrics.helpfulClicks / (metrics.helpfulClicks + metrics.unhelpfulClicks)) * 100).toFixed(2)
      : '0.00'

  const tiers = [
    { label: t('customerService.faqDashboard.faqTriggered'), color: TIER_COLORS[0], w: TIER_W[0] },
    { label: t('customerService.faqDashboard.faqClicked'), color: TIER_COLORS[1], w: TIER_W[1] },
    { label: t('customerService.faqDashboard.questionResolved'), color: TIER_COLORS[2], w: TIER_W[2] },
    { label: t('customerService.faqDashboard.helpfulClicks'), color: TIER_COLORS[3], w: TIER_W[3] },
  ]

  const annotations = [
    { label: t('customerService.faqDashboard.ctr'), value: `${ctr}%`, y: TIER_H * 1.5 },
    { label: t('customerService.faqDashboard.resolutionRate'), value: `${resolutionRate}%`, y: TIER_H * 2.5 },
    { label: t('customerService.faqDashboard.helpfulRate'), value: `${helpfulRate}%`, y: TIER_H * 3.5 },
  ]

  return (
    <div className="relative flex items-start gap-6">
      {/* SVG funnel */}
      <svg width={SVG_W} height={SVG_H} className="shrink-0">
        {tiers.map((tier, i) => {
          const x = (SVG_W - tier.w) / 2
          const y = i * TIER_H + 4
          const nextW = i < tiers.length - 1 ? TIER_W[i + 1] : tier.w
          const nextX = (SVG_W - nextW) / 2
          // Trapezoid path
          const path = `M${x},${y} L${x + tier.w},${y} L${nextX + nextW},${y + TIER_H - 2} L${nextX},${y + TIER_H - 2} Z`
          return (
            <g key={tier.label}>
              <path d={path} fill={tier.color} />
              <text
                x={SVG_W / 2}
                y={y + TIER_H / 2 + 5}
                textAnchor="middle"
                fill="white"
                fontSize={12}
                fontWeight={600}
              >
                {tier.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Rate annotations on the right */}
      <div className="flex flex-col justify-around" style={{ height: SVG_H }}>
        {annotations.map((ann) => (
          <div key={ann.label} className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-xs text-muted">
              {ann.label}
              <InfoIcon size={11} />
            </div>
            <span className="text-sm font-semibold text-brand">{ann.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
