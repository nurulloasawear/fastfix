import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Image } from '@/components/ui/Image'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { formatDateTime } from '@/utils/formatDate'
import { PackageIcon } from '@/features/orders'
import type { MassShipItem } from '@/features/orders'

type Tab = 'orders_to_ship' | 'generate_documents'

type Props = {
  orders: MassShipItem[]
  isLoading: boolean
  massShipTab: Tab
  selectedIds: string[]
  allSelected: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
  t: (k: string, o?: Record<string, unknown>) => string
  noDataLabel: string
}

export function MassShipTable({
  orders, isLoading, massShipTab, selectedIds, allSelected,
  onToggle, onToggleAll, t, noDataLabel,
}: Props) {
  if (!isLoading && orders.length === 0) {
    return (
      <EmptyState
        icon={<PackageIcon size={24} />}
        title={noDataLabel}
        description={t('orders.massShipPage.noDataHint', { defaultValue: 'Faqat toʻlovi tasdiqlangan buyurtmalar bu yerda koʻrinadi.' })}
      />
    )
  }

  const cols = massShipTab === 'generate_documents' ? 8 : 7

  return (
    <Table>
      <thead>
        <Tr className="border-0">
          <Th className="w-10">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleAll}
              className="h-4 w-4 rounded border-border-strong accent-brand"
            />
          </Th>
          <Th>{t('orders.massShipPage.colProducts')}</Th>
          <Th>{t('orders.massShipPage.colOrderId')}</Th>
          <Th>{t('orders.massShipPage.colBuyer')}</Th>
          <Th>{t('orders.massShipPage.colChannel')}</Th>
          <Th>{t('orders.massShipPage.colConfirmedTime')}</Th>
          {massShipTab === 'generate_documents' ? (
            <>
              <Th>{t('orders.massShipPage.colTracking')}</Th>
              <Th>{t('orders.massShipPage.colPrinted')}</Th>
            </>
          ) : (
            <Th>{t('orders.massShipPage.colOrderStatus')}</Th>
          )}
        </Tr>
      </thead>
      <tbody>
        {isLoading && <TableRowSkeleton cols={cols} />}
        {orders.map((order) => (
          <Tr key={order.id} className="hover:bg-bg">
            <Td>
              <input
                type="checkbox"
                checked={selectedIds.includes(order.id)}
                onChange={() => onToggle(order.id)}
                className="h-4 w-4 rounded border-border-strong accent-brand"
              />
            </Td>
            <Td>
              <div className="flex gap-2">
                <Image src={order.productThumbnail} className="h-10 w-10 shrink-0 rounded border border-border" />
                <span className="max-w-[160px] truncate text-sm text-text">{order.productName}</span>
              </div>
            </Td>
            <Td className="font-mono text-xs text-text">{order.orderId}</Td>
            <Td className="text-sm text-text">{order.buyerName}</Td>
            <Td className="text-sm text-text">{order.channel}</Td>
            <Td className="text-xs text-muted">{formatDateTime(order.confirmedTime)}</Td>
            {massShipTab === 'generate_documents' ? (
              <>
                <Td className="font-mono text-xs text-text">{order.trackingNumber ?? '—'}</Td>
                <Td className="text-xs text-muted">{order.labelPrintedAt ? formatDateTime(order.labelPrintedAt) : '—'}</Td>
              </>
            ) : (
              <Td><Badge tone="info">{order.orderStatus}</Badge></Td>
            )}
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
