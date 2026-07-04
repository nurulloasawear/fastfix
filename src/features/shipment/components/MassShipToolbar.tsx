import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { MassShipAction } from '../types/shipment.types'
import { ReceiptIcon, TruckIcon } from './icons'

type Props = {
  selectedCount: number
  isPending: boolean
  onAction: (action: MassShipAction) => void
}

export function MassShipToolbar({ selectedCount, isPending, onAction }: Props) {
  const { t } = useTranslation()
  const disabled = isPending || selectedCount === 0

  return (
    <Card className="flex flex-wrap items-center gap-3 p-4">
      <span className="mr-auto text-sm font-medium text-text-secondary">
        {t('shipment.massShip.selectedCount', { total: selectedCount })}
      </span>
      <Button variant="outline" disabled={disabled} onClick={() => onAction('print_receipts')}>
        <ReceiptIcon size={15} />
        {t('shipment.massShip.printReceipts')}
      </Button>
      <Button disabled={disabled} onClick={() => onAction('hand_to_courier')}>
        <TruckIcon size={15} />
        {t('shipment.massShip.handToCourier')}
      </Button>
    </Card>
  )
}
