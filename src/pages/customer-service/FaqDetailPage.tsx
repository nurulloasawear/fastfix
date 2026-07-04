import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { FaqDetailForm } from '@/features/customer-service'

// THIN page: the FAQ-card editor. All form logic lives in FaqDetailForm.
export function FaqDetailPage() {
  const { t } = useTranslation()

  return (
    <Page>
      <PageHeader
        title={t('customerService.faqAssistant.detail.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.faqAssistant.crumb')} › ${t('customerService.faqAssistant.detail.crumb')}`}
      />

      <FaqDetailForm />
    </Page>
  )
}
