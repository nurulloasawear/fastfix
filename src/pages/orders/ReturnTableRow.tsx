import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import { InfoCircleIcon } from '@/features/orders'
import type { ReturnRequest } from '@/features/orders'

type BadgeTone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info'

const RETURN_STATUS_TONE: Record<string, BadgeTone> = {
  under_review: 'gray',
  returning: 'info',
  refunded: 'success',
  disputed: 'warning',
  dispute_approved: 'success',
  dispute_rejected: 'error',
  rejected: 'error',
  claimed: 'success',
}

type Props = {
  req: ReturnRequest
  t: (k: string, opts?: Record<string, unknown>) => string
  orderIdLabel: string
  requestIdLabel: string
}

export function ReturnTableRow({ req, t, orderIdLabel, requestIdLabel }: Props) {
  return (
    <>
      {/* Buyer header row */}
      <tr className="border-t border-border bg-bg">
        <td colSpan={8} className="px-4 py-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface font-semibold text-muted">
              {req.buyerName.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-text">{req.buyerName}</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{orderIdLabel}</span>
            <Link to={`/orders/${req.orderId}`} className="font-mono text-brand hover:underline">
              {req.orderId}
            </Link>
            {req.unreadCount > 0 && (
              <span className="rounded-full bg-brand px-1.5 text-[10px] text-white">{req.unreadCount}</span>
            )}
            <span className="ml-2 text-muted">· {requestIdLabel}</span>
            <Link to={`/orders/returns/${req.id}`} className="font-mono text-brand hover:underline">
              {req.requestId}
            </Link>
          </div>
        </td>
      </tr>
      {/* Data row */}
      <Tr className="align-top hover:bg-bg">
        <Td>
          <div className="flex gap-2">
            <div className="h-12 w-12 shrink-0 rounded border border-border bg-bg" />
            <div>
              <div className="max-w-[140px] truncate font-medium text-text">{req.productName}</div>
              <div className="text-xs text-muted">×{req.quantity} · {req.variation}</div>
            </div>
          </div>
        </Td>
        <Td>
          <div className="text-xs font-semibold text-text-secondary">{t('orders.returns.refundAmount')}</div>
          <div className="font-semibold text-text">{formatUZS(req.refundAmountUzs)}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted">
            {t('orders.returns.adjustedAmount')}
            <InfoCircleIcon size={12} />
          </div>
          <div className="font-semibold text-brand">{formatUZS(req.adjustedAmountUzs)}</div>
        </Td>
        <Td className="text-text">{req.reasonCode}</Td>
        <Td className="text-muted">—</Td>
        <Td className="text-text">{req.solution}</Td>
        <Td>
          <Badge tone={RETURN_STATUS_TONE[req.status] ?? 'gray'}>
            {t(`orders.returns.status.${req.status}`)}
          </Badge>
        </Td>
        <Td>
          {req.forwardLogistic ? (
            <div>
              <div className="text-xs font-medium text-success">Delivery Done</div>
              <div className="text-xs text-muted">{req.forwardLogistic}</div>
            </div>
          ) : (
            <span className="text-xs text-muted">—</span>
          )}
        </Td>
        <Td>
          <Link to={`/orders/returns/${req.id}`}>
            <Button variant="outline" size="sm">→</Button>
          </Link>
        </Td>
      </Tr>
    </>
  )
}
