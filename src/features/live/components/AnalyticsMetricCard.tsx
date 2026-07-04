import { StatCard } from '@/components/ui/StatCard'
import type { MetricCard } from '../types/live.types'

type Props = {
  card: MetricCard
  label: string
}

export function AnalyticsMetricCard({ card, label }: Props) {
  return (
    <StatCard
      label={label}
      value={card.value}
      hint={card.delta ?? undefined}
      className="rounded-none border-0 shadow-none"
    />
  )
}
