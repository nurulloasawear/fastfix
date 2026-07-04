import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  NotificationSettingsCard,
  SettingsTabBar,
  ShopProfileCard,
} from '@/features/setting'

// THIN page: composes the feature. All data/logic lives in @/features/setting.
// Shop profile is real (GET /sellers/me · POST /sellers/register); notifications mock.
export function ShopSettingsPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.shop.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.nav.shop')}`}
      />
      <SettingsTabBar />
      <ShopProfileCard />
      <NotificationSettingsCard />
    </Page>
  )
}
