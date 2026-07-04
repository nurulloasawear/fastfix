import { useTranslation } from 'react-i18next'
import { formatUZS } from '@/utils/money'
import type { OrderDetailProduct, OrderPaymentSummary as Summary } from '../types/orders.types'

type Props = { product: OrderDetailProduct; summary: Summary }

export function OrderPaymentSummary({ product, summary }: Props) {
  const { t } = useTranslation()

  const lines: { label: string; value: number; strong?: boolean }[] = [
    { label: t('orders.details.subtotal'), value: summary.subtotalUzs },
    { label: t('orders.details.price'), value: summary.priceUzs },
    { label: t('orders.details.shippingSubtotal'), value: summary.shippingSubtotalUzs },
    { label: t('orders.details.feesCharges'), value: summary.feesAndChargesUzs },
    { label: t('orders.details.orderIncome'), value: summary.orderIncomeUzs, strong: true },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 bg-table-header px-4 py-3 text-xs font-medium text-muted">
        <div>{t('orders.product')}</div>
        <div>{t('orders.details.unitPrice')}</div>
        <div>{t('orders.details.quantity')}</div>
        <div>{t('orders.details.subtotal')}</div>
      </div>

      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2 border-b border-border px-4 py-3 text-sm">
        <div className="flex gap-2">
          <div className="h-10 w-10 shrink-0 rounded-md bg-bg" />
          <div>
            <div className="font-medium text-text">{product.productName}</div>
            <div className="text-xs text-muted">x{product.quantity}</div>
            <div className="text-xs text-muted">
              {t('orders.variation')}: {product.variation}
            </div>
          </div>
        </div>
        <div className="text-text">{formatUZS(product.unitPriceUzs)}</div>
        <div className="text-text">{product.quantity}</div>
        <div className="font-medium text-text">{formatUZS(product.subtotalUzs)}</div>
      </div>

      <div className="flex flex-col gap-1.5 px-4 py-3">
        {lines.map((line) => (
          <div
            key={line.label}
            className={`flex items-center justify-between text-sm ${
              line.strong ? 'font-semibold text-text' : 'text-muted'
            }`}
          >
            <span>{line.label}</span>
            <span className={line.strong ? 'text-brand' : 'text-text'}>{formatUZS(line.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
