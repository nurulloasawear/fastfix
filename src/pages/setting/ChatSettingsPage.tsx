import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { ChatSettingsCard, SettingsTabBar } from '@/features/setting'

// Chat Settings — thin page composed from feature building blocks.
export function ChatSettingsPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.chat.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.chat.title')}`}
      />
      <SettingsTabBar />
      <ChatSettingsCard />
    </Page>
  )
}
