import { useTranslation } from 'react-i18next'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { RETURN_STATUSES, type ReturnStatus, type ReturnSummary } from '../types/orders.types'

type Props = {
  active: ReturnStatus
  onChange: (status: ReturnStatus) => void
  summary?: ReturnSummary
}

export function ReturnStatusTabs({ active, onChange, summary }: Props) {
  const { t } = useTranslation()

  const items: TabItem[] = RETURN_STATUSES.map((status) => {
    const count = status === 'all' ? summary?.all : summary?.[status]
    const label = t(`orders.returns.status.${status}`)
    return { key: status, label: count ? `${label} (${count})` : label }
  })

  return (
    <div className="border-b border-border px-4 py-2">
      <Tabs
        items={items}
        value={active}
        onChange={(key) => onChange(key as ReturnStatus)}
      />
    </div>
  )
}
