import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { AccountInfoCard, AccountProtectionCard, SettingsTabBar } from '@/features/setting'

// Account & Security — merges Account Information + Account Protection (formerly SecurityProtectionPage).
export function AccountSettingPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.tabs.account')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.tabs.account')}`}
      />
      <SettingsTabBar />
      <AccountInfoCard />
      <AccountProtectionCard />
    </Page>
  )
}
