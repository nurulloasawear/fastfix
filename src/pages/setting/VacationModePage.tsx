import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { SettingsTabBar, VacationModeCard } from '@/features/setting'

// Vacation Mode — toggle with guard modal.
export function VacationModePage() {
  const { t } = useTranslation()
  return (
    <Page>
      <PageHeader
        title={t('setting.vacationMode.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.vacationMode.title')}`}
      />
      <SettingsTabBar />
      <VacationModeCard />
    </Page>
  )
}
