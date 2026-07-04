import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { CopyButton } from '@/components/ui/CopyButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { formatUZS } from '@/utils/money'
import {
  CheckIcon,
  MapPinIcon,
  MessageIcon,
  OrderEventTimeline,
  TruckIcon,
  UserIcon,
  useAddOrderNote,
  useOrderDetails,
  useOrderTimeline,
} from '@/features/orders'
import { AdjustmentCard, PaymentCard, SectionLabel } from './OrderDetailCards'

type StatusTone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info'
const STATUS_TONE: Record<string, StatusTone> = {
  completed: 'success', to_ship: 'info', shipping: 'info',
  unpaid: 'warning', cancellation: 'error', return_refund: 'error',
}

export function OrderDetailsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { id = '' } = useParams()
  const { data: order, isLoading, isError, refetch } = useOrderDetails(id)
  const { data: timeline } = useOrderTimeline(id)
  const addNote = useAddOrderNote(id)
  const [noteText, setNoteText] = useState('')
  const [buyerPaymentOpen, setBuyerPaymentOpen] = useState(false)

  const na = (v?: string) => (v && v !== '—' ? v : t('common.notAvailable', { defaultValue: 'Maʼlumot yoʻq' }))

  if (isLoading) {
    return (
      <Page>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4"><CardSkeleton lines={i === 0 ? 2 : 3} /></Card>
            ))}
          </div>
          <Card className="p-4"><CardSkeleton lines={6} /></Card>
        </div>
      </Page>
    )
  }

  if (isError) {
    return (
      <Page>
        <ErrorState
          title={t('orders.loadError', { defaultValue: 'Maʼlumotni yuklab boʻlmadi' })}
          retryLabel={t('common.retry', { defaultValue: 'Qayta urinish' })}
          onRetry={() => void refetch()}
        />
      </Page>
    )
  }

  if (!order) {
    return (
      <Page>
        <EmptyState title={t('orders.details.notFound')} />
      </Page>
    )
  }

  function handleSaveNote() {
    if (!noteText.trim()) return
    addNote.mutate(noteText, {
      onSuccess: () => {
        setNoteText('')
        toast.success(t('orders.details.noteSaved', { defaultValue: 'Eslatma saqlandi' }))
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  const events = timeline && timeline.length > 0 ? timeline : order.events
  const hasTracking = Boolean(order.trackingNumber && order.trackingNumber !== '—')

  return (
    <Page>
      <PageHeader
        title={t('orders.details.title')}
        breadcrumb={
          <span>
            {t('orders.breadcrumbHome')} ›{' '}
            <Link to="/orders" className="hover:underline">{t('orders.title')}</Link>
            {' › '}{t('orders.details.title')}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── Left column ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Status banner */}
          <Card className="flex items-center gap-3 p-4">
            <CheckIcon size={18} className="text-brand" />
            <Badge tone={STATUS_TONE[order.status] ?? 'gray'} className="px-3 py-1 text-sm">
              {t(`orders.status.${order.status}`)}
            </Badge>
          </Card>

          {/* Order ID */}
          <Card className="p-4">
            <SectionLabel icon={<MapPinIcon size={15} />} label={t('orders.details.orderId')} />
            <div className="mt-1.5 flex items-center gap-2">
              <p className="font-mono text-sm font-semibold text-text">{order.orderId}</p>
              <CopyButton value={order.orderId} />
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="p-4">
            <SectionLabel icon={<MapPinIcon size={15} />} label={t('orders.details.deliveryAddress')} />
            <p className="mt-1.5 text-sm text-text">{na(order.deliveryAddress)}</p>
          </Card>

          {/* Logistic Information */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <SectionLabel icon={<TruckIcon size={15} />} label={t('orders.details.logisticInfo')} />
              {hasTracking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info(t('orders.details.tracking', { defaultValue: 'Treking raqami' }) + `: ${order.trackingNumber}`)}
                >
                  {t('orders.details.track', { defaultValue: 'Kuzatish' })}
                </Button>
              )}
            </div>
            <div className="mt-2 text-sm text-text">
              <span className="font-medium">{t('orders.details.package', { defaultValue: 'Posilka' })} 1:</span>{' '}
              {na(order.logisticsCarrier)} · {na(order.logisticsService)}
            </div>
            {hasTracking && (
              <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                <span>{t('orders.details.tracking', { defaultValue: 'Treking raqami' })}: {order.trackingNumber}</span>
                <CopyButton value={order.trackingNumber} />
              </div>
            )}
            <div className="mt-3 flex gap-3">
              <div className="h-12 w-12 shrink-0 rounded-md border border-border bg-bg" />
              <span className="text-sm text-muted">
                {t('orders.details.totalProducts', { count: order.productCount, defaultValue: 'Jami {{count}} mahsulot' })}
              </span>
            </div>
          </Card>

          {/* Buyer */}
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg">
                <UserIcon size={16} className="text-muted" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text">{order.buyerName}</span>
                {order.buyerPhone && <span className="text-xs text-muted">{order.buyerPhone}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>{t('orders.details.follow')}</Button>
              <Button size="sm" onClick={() => navigate('/customer-service')}>
                <MessageIcon size={14} />
                {t('orders.details.chatNow')}
              </Button>
            </div>
          </Card>

          {/* Payment Information */}
          <PaymentCard order={order} t={t} />

          {/* Order Adjustment */}
          <AdjustmentCard order={order} t={t} />

          {/* Final amount */}
          <Card className="flex items-center justify-between p-4">
            <span className="font-semibold text-text">{t('orders.details.finalAmount')}</span>
            <span className="text-xl font-bold text-brand">{formatUZS(order.finalAmountUzs)}</span>
          </Card>

          {/* Buyer payment (collapsible) */}
          <Card className="p-4">
            <button
              type="button"
              onClick={() => setBuyerPaymentOpen((v) => !v)}
              className="flex w-full items-center justify-between text-sm font-semibold text-text transition-colors hover:text-brand"
            >
              <span>{t('orders.details.buyerPayment')}</span>
              <span>{formatUZS(order.buyerPaymentUzs)} {buyerPaymentOpen ? '↑' : '↓'}</span>
            </button>
            {buyerPaymentOpen && (
              <div className="mt-3 border-t border-border pt-3 text-sm text-muted">
                {formatUZS(order.buyerPaymentUzs)}
              </div>
            )}
          </Card>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <SectionLabel icon={<MessageIcon size={15} />} label={t('orders.details.notes', { defaultValue: 'Eslatmalar' })} />
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={t('orders.details.addNote')}
              rows={5}
              className="mt-2"
            />
            {noteText.trim() && (
              <Button size="sm" className="mt-2 w-full" onClick={handleSaveNote} disabled={addNote.isPending}>
                {t('orders.details.saveNote')}
              </Button>
            )}
          </Card>
          <Card className="p-4">
            <OrderEventTimeline events={events} />
          </Card>
        </div>
      </div>
    </Page>
  )
}
