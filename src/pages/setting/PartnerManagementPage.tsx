import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { PartnerManagementCard, SettingsTabBar } from '@/features/setting'

// Partner Management — OAuth partner integrations table (replaces old API-key-only page).
export function PartnerManagementPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.partners.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.partners.title')}`}
      />
      <SettingsTabBar />
      <PartnerManagementCard />
    </Page>
  )
}
