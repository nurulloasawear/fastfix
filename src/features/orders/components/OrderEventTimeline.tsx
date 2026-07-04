import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDate'
import type { OrderEvent } from '../types/orders.types'

type Props = { events: OrderEvent[] }

export function OrderEventTimeline({ events }: Props) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
        {t('orders.details.orderHistory')}
      </div>
      <ol className="relative ml-2 border-l border-border">
        {events.map((ev) => (
          <li key={ev.id} className="mb-5 ml-5 last:mb-0">
            <span
              className={`absolute -left-[7px] mt-1 h-3.5 w-3.5 rounded-full border-2 ${
                ev.active
                  ? 'border-brand bg-brand'
                  : 'border-border bg-surface'
              }`}
            />
            <p className={`text-sm font-semibold ${ev.active ? 'text-brand' : 'text-text-secondary'}`}>
              {t(`orders.event.${ev.eventType}`, ev.eventType)}
            </p>
            {ev.description && (
              <p className="mt-0.5 text-xs text-muted">{ev.description}</p>
            )}
            <p className="text-xs text-muted">{formatDateTime(ev.timestamp)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
