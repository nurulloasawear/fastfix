// Appeal Centre page — Preferred Seller Appeal + Listing Violation Appeal tabs.
// Thin page: data/logic in @/features/shop.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { AppealsTable, useAppeals } from '@/features/shop'
import type { AppealType } from '@/features/shop'

type PrimaryTab = AppealType

export function AppealsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<PrimaryTab>('preferred_seller')

  const { data, isLoading } = useAppeals({ type: tab })
  const appeals = data?.appeals ?? []

  const tabItems: TabItem[] = [
    { key: 'preferred_seller',   label: t('shop.appeals.preferredTab') },
    { key: 'listing_violation',  label: t('shop.appeals.violationTab') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('shop.appeals.title')}
        breadcrumb={`${t('shop.appeals.breadcrumbHome')} › ${t('shop.appeals.breadcrumbAppeals')}`}
      />

      <Tabs items={tabItems} value={tab} onChange={(k) => setTab(k as PrimaryTab)} />

      <AppealsTable
        appeals={appeals}
        type={tab}
        isLoading={isLoading}
        onFilterChange={(_params) => undefined}
      />
    </Page>
  )
}
