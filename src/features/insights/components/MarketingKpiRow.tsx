import { formatUZS } from '@/utils/money'
import { StatCard } from '@/components/ui/StatCard'

type KpiItem = {
  label: string
  value: number
  delta: number
  isMonetary?: boolean
  isPercent?: boolean
  deltaLabel?: string
}

type Props = { items: KpiItem[] }

export function MarketingKpiRow({ items }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => {
        function fmt(v: number): string {
          if (item.isMonetary) return formatUZS(v)
          if (item.isPercent) return `${v.toFixed(2)}%`
          return v.toLocaleString('ru-RU')
        }
        return (
          <StatCard
            key={i}
            label={item.label}
            value={fmt(item.value)}
            delta={{
              value: `${item.delta >= 0 ? '+' : ''}${item.delta.toFixed(2)}%`,
              positive: item.delta >= 0,
            }}
            hint={item.deltaLabel}
          />
        )
      })}
    </div>
  )
}
