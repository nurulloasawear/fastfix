import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import { DollarIcon } from '@/features/orders'
import type { OrderDetailsResponse } from '@/features/orders'

// ── Section label (icon + bold text) ─────────────────────────────────────────
export function SectionLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
      <span className="text-brand">{icon}</span>
      {label}
    </div>
  )
}

// ── Simple payment row ────────────────────────────────────────────────────────
export function PayRow({
  label, value, strong, muted,
}: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? 'text-muted' : 'text-text-secondary'}>{label}</span>
      <span className={strong ? 'font-semibold text-brand' : muted ? 'text-muted' : 'text-text'}>{value}</span>
    </div>
  )
}

// ── Payment Information card (items table + breakdown) ────────────────────────
type PaymentCardProps = {
  order: OrderDetailsResponse
  t: (k: string) => string
}

export function PaymentCard({ order, t }: PaymentCardProps) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel icon={<DollarIcon size={15} />} label={t('orders.details.paymentInfo')} />
        <Button variant="ghost" size="sm">{t('orders.details.viewTransactionHistory')}</Button>
      </div>

      <Table>
        <thead>
          <Tr className="border-0">
            <Th>{t('orders.details.no')}</Th>
            <Th>{t('orders.product')}</Th>
            <Th className="text-right">{t('orders.details.unitPrice')}</Th>
            <Th className="text-right">{t('orders.details.quantity')}</Th>
            <Th className="text-right">{t('orders.details.subtotal')}</Th>
          </Tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <Tr key={item.id}>
              <Td className="text-muted">{item.no}</Td>
              <Td>
                <div className="flex gap-2">
                  <div className="h-10 w-10 shrink-0 rounded border border-border bg-bg" />
                  <div>
                    <div className="line-clamp-2 font-medium text-text">{item.productName}</div>
                    <div className="text-xs text-muted">{item.variation}</div>
                  </div>
                </div>
              </Td>
              <Td className="text-right text-text">{formatUZS(item.unitPriceUzs)}</Td>
              <Td className="text-right text-text">{item.quantity}</Td>
              <Td className="text-right font-medium text-text">{formatUZS(item.subtotalUzs)}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      <Button variant="ghost" size="sm" className="mt-2">
        {t('orders.details.seeIncomeDetails')} ↓
      </Button>

      <div className="mt-3 flex flex-col gap-1.5 text-sm">
        <PayRow label={t('orders.details.merchandiseSubtotal')} value={formatUZS(order.merchandiseSubtotalUzs)} />
        <PayRow label={t('orders.details.deliveryFee')} value={formatUZS(order.deliveryFeeUzs)} />
        <PayRow label={t('orders.details.feesCharges')} value={`-${formatUZS(order.commissionUzs)}`} muted />
        <PayRow label={t('orders.details.netPayout')} value={formatUZS(order.netPayoutUzs)} strong />
      </div>
    </Card>
  )
}

// ── Order Adjustment card ─────────────────────────────────────────────────────
type AdjCardProps = {
  order: OrderDetailsResponse
  t: (k: string) => string
}

export function AdjustmentCard({ order, t }: AdjCardProps) {
  return (
    <Card className="p-4">
      <SectionLabel icon={<DollarIcon size={15} />} label={t('orders.details.orderAdjustment')} />
      <div className="mt-3">
        <Table>
          <thead>
            <Tr className="border-0">
              <Th>{t('orders.details.adjDate')}</Th>
              <Th>{t('orders.details.adjReason')}</Th>
              <Th className="text-right">{t('orders.details.adjAmount')}</Th>
            </Tr>
          </thead>
          <tbody>
            {order.adjustments.length === 0 ? (
              <Tr>
                <Td colSpan={3} className="text-center text-xs text-muted">—</Td>
              </Tr>
            ) : order.adjustments.map((adj) => (
              <Tr key={adj.id}>
                <Td className="text-text">{adj.date}</Td>
                <Td className="text-text">{adj.reason}</Td>
                <Td className="text-right font-medium text-brand">{formatUZS(adj.releasedAmountUzs)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  )
}
