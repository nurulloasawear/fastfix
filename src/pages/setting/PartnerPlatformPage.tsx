import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { ApiKeyCard, SettingsTabBar } from '@/features/setting'

// THIN page: composes the feature. All data/logic lives in @/features/setting.
export function PartnerPlatformPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.partner.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.nav.partner')}`}
      />
      <SettingsTabBar />
      <ApiKeyCard />
    </Page>
  )
}
