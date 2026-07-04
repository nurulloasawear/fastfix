import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/ui/StatCard'
import type { DiscountSummary, StatusFilter } from '../types/discounts.types'
import { AlertTriangle, ChartIcon, ClockIcon, UsersIcon } from './icons'

type Props = {
  summary: DiscountSummary
  status: StatusFilter
  onSelect: (status: StatusFilter) => void
}

// Three top cards double as status filters; the fourth (usage) is informational.
export function DiscountStats({ summary, status, onSelect }: Props) {
  const { t } = useTranslation()

  const cards = [
    {
      key: 'all' as const,
      label: t('discounts.stat.total'),
      hint: t('discounts.stat.totalDesc'),
      value: summary.total,
      Icon: ChartIcon,
      clickable: true,
    },
    {
      key: 'active' as const,
      label: t('discounts.stat.active'),
      hint: t('discounts.stat.activeDesc'),
      value: summary.active,
      Icon: ClockIcon,
      clickable: true,
    },
    {
      key: 'expired' as const,
      label: t('discounts.stat.expired'),
      hint: t('discounts.stat.expiredDesc'),
      value: summary.expired,
      Icon: AlertTriangle,
      clickable: true,
    },
    {
      key: 'used' as const,
      label: t('discounts.stat.used'),
      hint: t('discounts.stat.usedDesc'),
      value: summary.totalUsed,
      Icon: UsersIcon,
      clickable: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, hint, value, Icon, clickable }) => {
        const isActive = clickable && status === key
        return (
          <button
            key={key}
            type="button"
            disabled={!clickable}
            onClick={() => clickable && onSelect(key as StatusFilter)}
            className={`group rounded-lg text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              isActive ? 'ring-1 ring-brand' : ''
            } ${clickable ? 'hover:opacity-90' : 'cursor-default'}`}
          >
            <StatCard
              label={label}
              value={
                <span className="flex items-center gap-2">
                  {value}
                  <Icon size={16} className="text-muted" />
                </span>
              }
              hint={hint}
              className={isActive ? 'border-brand' : ''}
            />
          </button>
        )
      })}
    </div>
  )
}
