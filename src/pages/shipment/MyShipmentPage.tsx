import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import {
  ShipmentSearch,
  ShipmentStatusTabs,
  ShipmentTable,
  useDeliverOrder,
  useShipOrder,
  useShipments,
  useShipmentUi,
  type Shipment,
} from '@/features/shipment'

// THIN page: it composes the feature. All data/logic lives in @/features/shipment.
export function MyShipmentPage() {
  const { t } = useTranslation()
  const status = useShipmentUi((s) => s.status)
  const search = useShipmentUi((s) => s.search)
  const setStatus = useShipmentUi((s) => s.setStatus)
  const setSearch = useShipmentUi((s) => s.setSearch)
  const resetSearch = useShipmentUi((s) => s.resetSearch)

  const [pendingId, setPendingId] = useState<string | null>(null)
  const { data, isLoading, refetch } = useShipments({ status, search: search || undefined })
  const ship = useShipOrder()
  const deliver = useDeliverOrder()

  const shipments = data?.shipments ?? []

  function onShip(shipment: Shipment) {
    setPendingId(shipment.id)
    ship.mutate(shipment.orderId, { onSettled: () => setPendingId(null) })
  }

  function onDeliver(shipment: Shipment) {
    setPendingId(shipment.id)
    deliver.mutate(shipment.orderId, { onSettled: () => setPendingId(null) })
  }

  return (
    <Page>
      <PageHeader
        title={t('shipment.title')}
        subtitle={t('shipment.subtitle')}
        breadcrumb={
          <span>
            {t('shipment.title')}
            <span className="px-1.5 text-border-strong">/</span>
            <span className="text-text-secondary">{t('shipment.title')}</span>
          </span>
        }
      />

      <ShipmentStatusTabs active={status} summary={data?.summary} onChange={setStatus} />

      <ShipmentSearch
        search={search}
        onSearchChange={setSearch}
        onSearch={() => void refetch()}
        onClear={() => {
          resetSearch()
          void refetch()
        }}
      />

      <Card className="overflow-x-auto">
        <ShipmentTable
          shipments={shipments}
          isLoading={isLoading}
          pendingId={pendingId}
          onShip={onShip}
          onDeliver={onDeliver}
        />
      </Card>
    </Page>
  )
}
