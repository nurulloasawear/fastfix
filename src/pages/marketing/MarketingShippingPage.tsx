import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { MarketingNav, ShippingForm, useMarketingShipping, ChevronRight } from '@/features/marketing'

export function MarketingShippingPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useMarketingShipping()

  return (
    <Page>
      <PageHeader
        title={t('marketing.shipping.title')}
        subtitle={t('marketing.shipping.subtitle')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.shipping.title')}</span>
          </span>
        }
      />

      <MarketingNav />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : data ? (
        <ShippingForm initial={data} />
      ) : null}
    </Page>
  )
}
