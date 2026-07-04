import { useTranslation } from 'react-i18next'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import {
  SHIPMENT_STATUS_FILTERS,
  type ShipmentStatusFilter,
  type ShipmentSummary,
} from '../types/shipment.types'

type Props = {
  active: ShipmentStatusFilter
  summary?: ShipmentSummary
  onChange: (status: ShipmentStatusFilter) => void
}

export function ShipmentStatusTabs({ active, summary, onChange }: Props) {
  const { t } = useTranslation()

  const items: TabItem[] = SHIPMENT_STATUS_FILTERS.map((status) => ({
    key: status,
    label: t(`shipment.status.${status}`),
    count: summary?.[status],
  }))

  return (
    <Tabs
      items={items}
      value={active}
      onChange={(key) => onChange(key as ShipmentStatusFilter)}
    />
  )
}
