import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProductSettingCard, SettingsTabBar } from '@/features/setting'

// Product Setting — content reuse consent toggle.
export function ProductSettingPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.productSetting.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.productSetting.title')}`}
      />
      <SettingsTabBar />
      <ProductSettingCard />
    </Page>
  )
}
