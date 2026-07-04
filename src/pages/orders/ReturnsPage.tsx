import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { useReturnsUi } from '@/features/orders'
import type { ReturnPrimaryTab } from '@/features/orders'
import { ReturnsPanel } from './ReturnsPanel'

export function ReturnsPage() {
  const { t } = useTranslation()
  const primaryTab    = useReturnsUi((s) => s.primaryTab)
  const setPrimaryTab = useReturnsUi((s) => s.setPrimaryTab)

  const primaryTabs: TabItem[] = (
    ['all', 'return_refund', 'cancellation'] as ReturnPrimaryTab[]
  ).map((tab) => ({ key: tab, label: t(`orders.returns.primaryTab.${tab}`) }))

  return (
    <Page>
      <PageHeader
        title={t('orders.returns.title')}
        breadcrumb={`${t('orders.breadcrumbHome')} › ${t('orders.returns.title')}`}
        actions={
          <a href="#" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
            {t('orders.returns.viewNonFulfilmentRate')} ↗
          </a>
        }
      />

      <Card className="overflow-hidden">
        {/* Primary tabs (All / Return-Refund / Cancellation) */}
        <div className="border-b border-border px-4 py-2">
          <Tabs items={primaryTabs} value={primaryTab} onChange={(key) => setPrimaryTab(key as ReturnPrimaryTab)} />
        </div>
        <ReturnsPanel />
      </Card>
    </Page>
  )
}
