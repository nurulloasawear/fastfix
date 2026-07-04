import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr } from '@/components/ui/Table'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import type { OrderItem, OrderStatus } from '../types/orders.types'
import { ClipboardIcon, SearchIcon } from './icons'
import { OrderRowGroup } from './OrderRowGroup'

type Props = {
  orders: OrderItem[]
  isLoading: boolean
  activeStatus: OrderStatus
  searchActive?: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onArrangeShipment?: (id: string) => void
}

const COLS = 7

export function OrderTable({
  orders, isLoading, activeStatus, searchActive, selectedIds,
  onToggleSelect, onSelectAll, onArrangeShipment,
}: Props) {
  const { t } = useTranslation()

  if (!isLoading && orders.length === 0) {
    return searchActive ? (
      <EmptyState
        icon={<SearchIcon size={24} />}
        title={t('orders.emptySearch', { defaultValue: 'Hech narsa topilmadi' })}
        description={t('orders.emptySearchHint', { defaultValue: 'Boshqa buyurtma raqami yoki xaridor nomini sinab koʻring.' })}
      />
    ) : (
      <EmptyState
        icon={<ClipboardIcon size={24} />}
        title={t('orders.empty')}
        description={t('orders.emptyHint', { defaultValue: 'Bu boʻlimda hozircha buyurtmalar yoʻq.' })}
      />
    )
  }

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.includes(o.id))

  return (
    <Table>
      <thead>
        <Tr className="border-0">
          <Th className="w-10">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => allSelected ? onSelectAll([]) : onSelectAll(orders.map((o) => o.id))}
              className="h-4 w-4 rounded border-border-strong accent-brand"
            />
          </Th>
          <Th>{t('orders.product')}</Th>
          <Th>{t('orders.totalBuyerPayment')}</Th>
          <Th>{t('orders.statusCol')}</Th>
          <Th>{t('orders.countdown')}</Th>
          <Th>{t('orders.logisticsChannel')}</Th>
          <Th>{t('orders.action')}</Th>
        </Tr>
      </thead>
      <tbody>
        {isLoading && <TableRowSkeleton cols={COLS} />}
        {orders.map((order) => (
          <OrderRowGroup
            key={order.id}
            order={order}
            activeStatus={activeStatus}
            selected={selectedIds.includes(order.id)}
            onToggle={() => onToggleSelect(order.id)}
            onArrangeShipment={onArrangeShipment}
            t={t}
          />
        ))}
      </tbody>
    </Table>
  )
}
