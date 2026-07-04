import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatUZS } from '@/utils/money'
import {
  MapPinIcon,
  MessageIcon,
  ReturnEventTimeline,
  TruckIcon,
  UserIcon,
} from '@/features/orders'
import type { ReturnDetailResponse, ReturnEvent } from '@/features/orders'

export function SectionLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
      <span className="text-brand">{icon}</span>
      {label}
    </div>
  )
}

type DeliveryProps = { address: string; t: (k: string) => string }
export function DeliveryAddressCard({ address, t }: DeliveryProps) {
  return (
    <Card className="p-4">
      <SectionLabel icon={<MapPinIcon size={15} />} label={t('orders.returnDetail.deliveryAddress')} />
      <p className="mt-1.5 text-sm text-text">{address}</p>
    </Card>
  )
}

type LogisticProps = {
  carrier: string; service: string; trackingNumber: string
  t: (k: string) => string
}
export function LogisticCard({ carrier, service, trackingNumber, t }: LogisticProps) {
  return (
    <Card className="p-4">
      <SectionLabel icon={<TruckIcon size={15} />} label={t('orders.returnDetail.logisticInfo')} />
      <div className="mt-2 text-sm text-text">
        {carrier} · {service}
        {trackingNumber !== '—' && (
          <span className="ml-2 font-mono text-xs text-muted">{trackingNumber}</span>
        )}
      </div>
    </Card>
  )
}

type BuyerProps = { buyerName: string; t: (k: string) => string }
export function BuyerCard({ buyerName, t }: BuyerProps) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg">
          <UserIcon size={16} className="text-muted" />
        </div>
        <span className="text-sm font-semibold text-text">{buyerName}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>{t('orders.returnDetail.follow')}</Button>
        <Button size="sm">
          <MessageIcon size={14} />
          {t('orders.returnDetail.chatNow')}
        </Button>
      </div>
    </Card>
  )
}

type ProductProps = {
  req: ReturnDetailResponse
  t: (k: string) => string
}
export function ReturnProductCard({ req, t }: ProductProps) {
  return (
    <Card className="p-4">
      <div className="mb-2 text-xs font-semibold text-text-secondary">{t('orders.returnDetail.product')}</div>
      <div className="flex gap-3">
        <div className="h-14 w-14 shrink-0 rounded-md border border-border bg-bg" />
        <div>
          <div className="font-medium text-text">{req.productName}</div>
          <div className="text-sm font-semibold text-brand">{formatUZS(req.productPriceUzs)}</div>
          <div className="text-xs text-muted">{req.variation} · ×{req.quantity}</div>
        </div>
      </div>
    </Card>
  )
}

type RequestIdCardProps = {
  requestId: string; orderId: string
  t: (k: string) => string
}
export function RequestIdCard({ requestId, orderId, t }: RequestIdCardProps) {
  return (
    <Card className="p-4">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-text-secondary">
        <span className="text-brand">☰</span>
        {t('orders.returnDetail.requestId')}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-text">{requestId}</span>
        <Link to={`/orders/${orderId}`} className="text-xs text-brand hover:underline">
          {t('orders.returnDetail.viewRelatedOrder')}
        </Link>
      </div>
    </Card>
  )
}

type HistoryProps = { events: ReturnEvent[] }
export function ReturnHistorySidebar({ events }: HistoryProps) {
  return (
    <div>
      <Card className="p-4">
        <ReturnEventTimeline events={events} />
      </Card>
    </div>
  )
}
