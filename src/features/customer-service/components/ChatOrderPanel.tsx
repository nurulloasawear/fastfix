import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { formatUZS } from '@/utils/money'
import type { ChatChannel, ChatOrderStatus } from '../types/customer-service.types'
import { ShoppingBagIcon } from './icons'

type Tone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info'

const ORDER_STATUS_TONE: Record<ChatOrderStatus, Tone> = {
  pending: 'warning',
  shipped: 'info',
  delivered: 'success',
}

type Props = { channel: ChatChannel }

// Right column: customer snapshot + the order the conversation is about + a policy note.
export function ChatOrderPanel({ channel }: Props) {
  const { t } = useTranslation()

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-5 border-l border-border bg-surface p-5 xl:flex">
      <div className="border-b border-border pb-4 text-center">
        <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-brand">
          {channel.customerName.charAt(0).toUpperCase()}
        </div>
        <h5 className="text-sm font-semibold text-text">{channel.customerName}</h5>
        <span className="mt-0.5 block text-xs text-muted">
          {t('customerService.chat.customerSince', { year: channel.customerSince })}
        </span>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-1.5">
          <ShoppingBagIcon size={14} className="text-text" />
          <span className="text-xs font-semibold uppercase tracking-wide text-text">
            {t('customerService.chat.associatedOrder')}
          </span>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-bg p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">{t('customerService.chat.orderId')}</span>
            <strong className="font-semibold text-text">{channel.orderId}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">{t('customerService.chat.status')}</span>
            <Badge tone={ORDER_STATUS_TONE[channel.orderStatus]}>
              {t(`customerService.chat.orderStatus.${channel.orderStatus}`)}
            </Badge>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <span className="text-muted">{t('customerService.chat.total')}</span>
            <strong className="font-semibold text-text">{formatUZS(channel.orderTotalUzs)}</strong>
          </div>
        </div>
      </div>

      <div className="mt-auto rounded-lg border border-dashed border-warning bg-warning-bg p-2.5 text-[10px] leading-relaxed text-warning">
        <strong>{t('customerService.chat.noteLabel')}:</strong> {t('customerService.chat.noteText')}
      </div>
    </aside>
  )
}
