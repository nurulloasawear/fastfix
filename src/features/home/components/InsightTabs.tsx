import { useTranslation } from 'react-i18next'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { INSIGHT_TABS, type InsightTab } from '../types/home.types'

type Props = {
  active: InsightTab
  onChange: (tab: InsightTab) => void
}

export function InsightTabs({ active, onChange }: Props) {
  const { t } = useTranslation()

  const items: TabItem[] = INSIGHT_TABS.map((tab) => ({
    key: tab,
    label: t(`home.insights.tab.${tab}`),
  }))

  return (
    <Tabs
      items={items}
      value={active}
      onChange={(key) => onChange(key as InsightTab)}
    />
  )
}
