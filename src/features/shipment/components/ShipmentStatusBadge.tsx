import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import type { ShipmentStatus } from '../types/shipment.types'

type Tone = 'warning' | 'info' | 'success'

const TONE: Record<ShipmentStatus, Tone> = {
  preparing: 'warning',
  in_transit: 'info',
  delivered: 'success',
}

type Props = { status: ShipmentStatus }

export function ShipmentStatusBadge({ status }: Props) {
  const { t } = useTranslation()
  return <Badge tone={TONE[status]}>{t(`shipment.status.${status}`)}</Badge>
}
