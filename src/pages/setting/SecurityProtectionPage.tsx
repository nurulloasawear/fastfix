import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { PasswordForm, SettingsTabBar, TwoFactorCard } from '@/features/setting'

// THIN page: composes the feature. All data/logic lives in @/features/setting.
export function SecurityProtectionPage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.security.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.nav.security')}`}
      />
      <SettingsTabBar />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PasswordForm />
        </div>
        <TwoFactorCard />
      </div>
    </Page>
  )
}
