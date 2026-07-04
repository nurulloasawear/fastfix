import { useTranslation } from 'react-i18next'
import { StatCard } from './StatCard'
import { StarIcon } from './icons'
import type { ShopRatingSummary } from '../types/shop.types'

export function ReviewStats({ summary }: { summary: ShopRatingSummary }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard
        label={t('shop.rating.avg')}
        value={summary.average.toFixed(1)}
        icon={<StarIcon filled className="h-5 w-5" />}
        iconClass="bg-accent-soft text-warning"
      />
      <StatCard
        label={t('shop.rating.positive')}
        value={`${summary.positiveRate}%`}
        icon={<StarIcon className="h-5 w-5" />}
        iconClass="bg-success-bg text-success"
      />
      <StatCard
        label={t('shop.rating.total')}
        value={summary.total}
        icon={<StarIcon className="h-5 w-5" />}
        iconClass="bg-bg text-brand"
      />
      <StatCard
        label={t('shop.rating.unanswered')}
        value={summary.unanswered}
        icon={<StarIcon className="h-5 w-5" />}
        iconClass="bg-bg text-text-secondary"
      />
    </div>
  )
}
