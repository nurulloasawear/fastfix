import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Td, Th, Tr } from '@/components/ui/Table'
import type { MassShipOrder } from '../types/shipment.types'
import { ReceiptIcon } from './icons'
import { formatWeight } from '../utils/weight'

type Props = {
  orders: MassShipOrder[]
  isLoading: boolean
  selected: string[]
  onToggle: (orderId: string) => void
  onToggleAll: (checked: boolean) => void
}

const checkboxCls = 'h-4 w-4 cursor-pointer rounded border-border-strong accent-brand'

export function MassShipTable({ orders, isLoading, selected, onToggle, onToggleAll }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptIcon size={24} />}
        title={t('shipment.massShip.empty')}
      />
    )
  }

  const allSelected = orders.every((o) => selected.includes(o.orderId))

  return (
    <Table>
      <thead>
        <Tr>
          <Th className="w-12">
            <input
              type="checkbox"
              aria-label={t('shipment.massShip.selectAll')}
              checked={allSelected}
              onChange={(e) => onToggleAll(e.target.checked)}
              className={checkboxCls}
            />
          </Th>
          <Th>{t('shipment.orderId')}</Th>
          <Th>{t('shipment.massShip.contents')}</Th>
          <Th className="text-right">{t('shipment.weight')}</Th>
        </Tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <Tr key={o.id}>
            <Td>
              <input
                type="checkbox"
                aria-label={o.reference}
                checked={selected.includes(o.orderId)}
                onChange={() => onToggle(o.orderId)}
                className={checkboxCls}
              />
            </Td>
            <Td className="font-medium text-text">{o.reference}</Td>
            <Td className="text-muted">{o.productName}</Td>
            <Td className="text-right font-mono text-xs text-muted">
              {formatWeight(o.weightKg)}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
