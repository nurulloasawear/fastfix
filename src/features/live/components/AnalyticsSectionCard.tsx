import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'

type InnerTab = { label: string; value: string }

type Props = {
  title: string
  tabs?: InnerTab[]
  activeTab?: string
  onTabChange?: (tab: string) => void
  children: ReactNode
}

export function AnalyticsSectionCard({ title, tabs, activeTab, onTabChange, children }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h3 className="text-xs font-bold tracking-wider text-text-secondary">{title}</h3>
        {tabs && tabs.length > 1 && activeTab && onTabChange && (
          <Tabs
            items={tabs.map((tab) => ({ key: tab.value, label: tab.label }))}
            value={activeTab}
            onChange={onTabChange}
            className="gap-1"
          />
        )}
      </div>
      <div className="p-1">{children}</div>
    </Card>
  )
}
