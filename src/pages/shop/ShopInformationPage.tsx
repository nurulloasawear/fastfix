// Shop Information page — Basic Info tab + Identity Verification tab.
// Thin page: all data/logic lives in @/features/shop.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import {
  ShopInfoBasicPanel,
  ShopInfoKycPanel,
  usePatchShopInfo,
  useShopInfo,
  useShopKyc,
} from '@/features/shop'

type InfoTab = 'basic' | 'kyc'

export function ShopInformationPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<InfoTab>('basic')

  const { data: profile, isLoading: profileLoading } = useShopInfo()
  const { data: kyc, isLoading: kycLoading } = useShopKyc()
  const patchInfo = usePatchShopInfo()

  const tabItems: TabItem[] = [
    { key: 'basic', label: t('shop.shopInfo.basicTab') },
    { key: 'kyc',   label: t('shop.shopInfo.kycTab') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('shop.shopInfo.title')}
        breadcrumb={`${t('shop.appeals.breadcrumbHome')} › ${t('shop.shopInfo.title')}`}
        actions={
          <Button variant="outline" size="sm">
            {t('shop.shopInfo.viewMyShop')}
          </Button>
        }
      />

      <Tabs items={tabItems} value={tab} onChange={(k) => setTab(k as InfoTab)} />

      {tab === 'basic' && (
        profileLoading || !profile ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <ShopInfoBasicPanel
            profile={profile}
            onSave={(payload) => patchInfo.mutate(payload)}
            isSaving={patchInfo.isPending}
          />
        )
      )}

      {tab === 'kyc' && (
        kycLoading || !kyc ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <ShopInfoKycPanel kyc={kyc} />
        )
      )}
    </Page>
  )
}
