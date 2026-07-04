import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  FaqAccordion,
  HelpGuideCard,
  HelpHero,
  MessageSquareIcon,
  useHelpCenter,
} from '@/features/customer-service'

// THIN page: composes the customer-service feature. Primary `/customer-service` route.
export function HelpCenterPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useHelpCenter()
  const guides = data?.guides ?? []
  const faqs = data?.faqs ?? []

  return (
    <Page>
      <PageHeader
        title={t('customerService.help.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.breadcrumb')} › ${t('customerService.help.crumb')}`}
      />

      <HelpHero />

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">{t('customerService.help.guidesTitle')}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <HelpGuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </section>

      <FaqAccordion faqs={faqs} isLoading={isLoading} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <MessageSquareIcon size={18} />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-text">
              {t('customerService.help.calloutTitle')}
            </h4>
            <p className="mt-0.5 text-xs text-text-secondary">{t('customerService.help.calloutText')}</p>
          </div>
        </div>
        <Button>{t('customerService.help.calloutAction')}</Button>
      </div>
    </Page>
  )
}
