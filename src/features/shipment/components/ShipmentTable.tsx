import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Td, Th, Tr } from '@/components/ui/Table'
import type { Shipment } from '../types/shipment.types'
import { TruckIcon } from './icons'
import { ShipmentStatusBadge } from './ShipmentStatusBadge'

type Props = {
  shipments: Shipment[]
  isLoading: boolean
  pendingId: string | null
  onShip: (shipment: Shipment) => void
  onDeliver: (shipment: Shipment) => void
}

export function ShipmentTable({ shipments, isLoading, pendingId, onShip, onDeliver }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (shipments.length === 0) {
    return (
      <EmptyState
        icon={<TruckIcon size={24} />}
        title={t('shipment.empty')}
      />
    )
  }

  return (
    <Table>
      <thead>
        <Tr>
          <Th>{t('shipment.orderCustomer')}</Th>
          <Th>{t('shipment.courier')}</Th>
          <Th>{t('shipment.tracking')}</Th>
          <Th>{t('shipment.destination')}</Th>
          <Th>{t('shipment.statusLabel')}</Th>
          <Th className="text-right">{t('shipment.action')}</Th>
        </Tr>
      </thead>
      <tbody>
        {shipments.map((s) => {
          const busy = pendingId === s.id
          return (
            <Tr key={s.id}>
              <Td>
                <div className="font-medium text-text">{s.reference}</div>
                <div className="text-xs text-muted">{s.customerName}</div>
              </Td>
              <Td className="text-text-secondary">{s.courierService}</Td>
              <Td className="font-mono text-xs text-muted">{s.trackingNumber}</Td>
              <Td className="max-w-[200px] truncate text-muted">{s.destination}</Td>
              <Td>
                <ShipmentStatusBadge status={s.status} />
              </Td>
              <Td className="text-right">
                {s.status === 'preparing' && (
                  <Button variant="outline" size="sm" disabled={busy} onClick={() => onShip(s)}>
                    {t('shipment.dispatch')}
                  </Button>
                )}
                {s.status === 'in_transit' && (
                  <Button variant="outline" size="sm" disabled={busy} onClick={() => onDeliver(s)}>
                    {t('shipment.markDelivered')}
                  </Button>
                )}
                {s.status === 'delivered' && (
                  <span className="text-xs text-muted">{t('shipment.done')}</span>
                )}
              </Td>
            </Tr>
          )
        })}
      </tbody>
    </Table>
  )
}
