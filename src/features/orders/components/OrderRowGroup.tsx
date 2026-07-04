import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import type { OrderItem, OrderStatus } from '../types/orders.types'
import { MessageIcon, UserIcon } from './icons'

type BadgeTone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info'

const STATUS_TONE: Record<string, BadgeTone> = {
  unpaid: 'warning',
  to_ship: 'info',
  shipping: 'info',
  completed: 'success',
  cancellation: 'error',
  return_refund: 'error',
}

export function CountdownBadge({ seconds }: { seconds: number }) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const isUrgent = seconds < 86400
  const label = h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h ${m}m`
  return (
    <Badge tone={isUrgent ? 'error' : 'gray'} className="font-mono text-xs">
      {label}
    </Badge>
  )
}

type Props = {
  order: OrderItem
  activeStatus: OrderStatus
  selected: boolean
  onToggle: () => void
  onArrangeShipment?: (id: string) => void
  t: (key: string, opts?: Record<string, unknown>) => string
}

export function OrderRowGroup({ order, activeStatus, selected, onToggle, onArrangeShipment, t }: Props) {
  return (
    <>
      {/* Buyer header row */}
      <tr className="border-t border-border bg-bg">
        <td colSpan={7} className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected}
                onChange={onToggle}
                className="h-4 w-4 rounded border-border-strong accent-brand"
              />
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface">
                <UserIcon size={13} className="text-muted" />
              </div>
              <span className="text-sm font-semibold text-text">{order.buyerName}</span>
              <button type="button" className="text-muted transition-colors hover:text-brand">
                <MessageIcon size={13} />
              </button>
            </div>
            <Link to={`/orders/${order.id}`} className="font-mono text-xs font-medium text-brand hover:underline">
              {t('orders.orderId')} {order.orderId}
            </Link>
          </div>
        </td>
      </tr>
      {/* Data row */}
      <Tr className="align-middle hover:bg-bg">
        <Td>
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="h-4 w-4 rounded border-border-strong accent-brand"
          />
        </Td>
        {/* Product */}
        <Td className="max-w-[260px]">
          <div className="flex gap-3">
            <div className="h-14 w-14 shrink-0 rounded-md border border-border bg-bg" />
            <div className="min-w-0">
              <div className="truncate font-medium text-text">{order.productName}</div>
              <div className="mt-0.5 text-xs text-muted">{order.variation} · ×{order.quantity}</div>
            </div>
          </div>
        </Td>
        {/* Total */}
        <Td>
          <div className="font-semibold text-text">{formatUZS(order.totalUzs)}</div>
          <div className="text-xs text-muted">{order.paymentLabel}</div>
        </Td>
        {/* Status */}
        <Td>
          <Badge tone={(STATUS_TONE[order.status] ?? 'gray') as BadgeTone}>
            {t(`orders.status.${order.status}`)}
          </Badge>
        </Td>
        {/* Countdown */}
        <Td>
          {order.shipByDeadlineSeconds != null && activeStatus === 'to_ship' ? (
            <CountdownBadge seconds={order.shipByDeadlineSeconds} />
          ) : (
            <span className="text-muted">—</span>
          )}
        </Td>
        {/* Logistics */}
        <Td>
          <div className="font-medium text-text">{order.logisticsProvider}</div>
          {order.trackingNumber !== '—' && (
            <div className="font-mono text-xs text-muted">{order.trackingNumber}</div>
          )}
          <div className="text-xs text-muted">{order.paymentLabel}</div>
        </Td>
        {/* Actions */}
        <Td>
          {activeStatus === 'to_ship' || order.status === 'to_ship' ? (
            <Button size="sm" onClick={() => onArrangeShipment?.(order.id)}>
              {t('orders.arrangeShipment')}
            </Button>
          ) : order.status === 'completed' ? (
            <Button variant="outline" size="sm"
              onClick={() => window.open(`/api/seller/orders/${order.id}/invoice`, '_blank')}>
              {t('orders.printInvoice')}
            </Button>
          ) : (
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline" size="sm">{t('orders.viewDetails')}</Button>
            </Link>
          )}
        </Td>
      </Tr>
    </>
  )
}
