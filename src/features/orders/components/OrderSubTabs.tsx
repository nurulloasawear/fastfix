import { useTranslation } from 'react-i18next'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import type { OrderSubStatus } from '../types/orders.types'

type Props = {
  tabs: OrderSubStatus[]
  active: OrderSubStatus
  onChange: (subStatus: OrderSubStatus) => void
}

export function OrderSubTabs({ tabs, active, onChange }: Props) {
  const { t } = useTranslation()

  const items: TabItem[] = tabs.map((tab) => ({
    key: tab,
    label: t(`orders.subStatus.${tab}`),
  }))

  return (
    <div className="border-b border-border px-4 py-2">
      <Tabs
        items={items}
        value={active}
        onChange={(key) => onChange(key as OrderSubStatus)}
      />
    </div>
  )
}
