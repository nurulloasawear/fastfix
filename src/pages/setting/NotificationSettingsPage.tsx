import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmailNotificationCard, SettingsTabBar } from '@/features/setting'

// Notification Settings — thin page composed from feature building blocks.
export function NotificationSettingsPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.emailNotif.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.emailNotif.title')}`}
      />
      <SettingsTabBar />
      <EmailNotificationCard />
    </Page>
  )
}
