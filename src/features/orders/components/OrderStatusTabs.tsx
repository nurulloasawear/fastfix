import { useTranslation } from 'react-i18next'
import { ORDER_STATUSES, type OrderStatus, type OrderSummary } from '../types/orders.types'

type Props = {
  active: OrderStatus
  summary?: OrderSummary
  onChange: (status: OrderStatus) => void
}

export function OrderStatusTabs({ active, summary, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-1 border-b border-border bg-surface px-4 pt-3">
      {ORDER_STATUSES.map((status) => {
        const count = summary?.[status]
        const isActive = active === status
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`-mb-px rounded-t-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-b-2 border-brand text-brand'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t(`orders.status.${status}`)}
            {count != null && count > 0 ? (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  isActive ? 'bg-brand text-white' : 'bg-bg text-muted'
                }`}
              >
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
