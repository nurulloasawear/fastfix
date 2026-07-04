import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import {
  MassShipTable,
  MassShipToolbar,
  useMassShip,
  useMassShipOrders,
  useShipmentUi,
  type MassShipAction,
} from '@/features/shipment'

type Banner = { action: MassShipAction; count: number }

// THIN page: it composes the feature. All data/logic lives in @/features/shipment.
export function MassShipPage() {
  const { t } = useTranslation()
  const selected = useShipmentUi((s) => s.selected)
  const toggleSelected = useShipmentUi((s) => s.toggleSelected)
  const setAllSelected = useShipmentUi((s) => s.setAllSelected)
  const clearSelected = useShipmentUi((s) => s.clearSelected)

  const { data, isLoading } = useMassShipOrders()
  const massShip = useMassShip()
  const [banner, setBanner] = useState<Banner | null>(null)

  const orders = data?.orders ?? []

  function onToggleAll(checked: boolean) {
    setAllSelected(checked ? orders.map((o) => o.orderId) : [])
  }

  function onAction(action: MassShipAction) {
    const count = selected.length
    massShip.mutate(
      { orderIds: selected, action },
      {
        onSuccess: () => {
          setBanner({ action, count })
          clearSelected()
        },
      },
    )
  }

  return (
    <Page>
      <PageHeader
        title={t('shipment.massShip.title')}
        subtitle={t('shipment.massShip.subtitle')}
        breadcrumb={
          <span>
            {t('shipment.title')}
            <span className="px-1.5 text-border-strong">/</span>
            <span className="text-text-secondary">{t('shipment.massShip.title')}</span>
          </span>
        }
      />

      {banner && (
        <div className="rounded-lg border border-border bg-success-bg p-3 text-sm font-medium text-success">
          {banner.action === 'print_receipts'
            ? t('shipment.massShip.successPrint', { total: banner.count })
            : t('shipment.massShip.successHand', { total: banner.count })}
        </div>
      )}

      <MassShipToolbar
        selectedCount={selected.length}
        isPending={massShip.isPending}
        onAction={onAction}
      />

      <Card className="overflow-x-auto">
        <MassShipTable
          orders={orders}
          isLoading={isLoading}
          selected={selected}
          onToggle={toggleSelected}
          onToggleAll={onToggleAll}
        />
      </Card>
    </Page>
  )
}
