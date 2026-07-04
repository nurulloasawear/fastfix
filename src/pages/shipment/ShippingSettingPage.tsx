import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { ShippingSettingsForm, useShippingSettings } from '@/features/shipment'

// THIN page: it composes the feature. All data/logic lives in @/features/shipment.
export function ShippingSettingPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useShippingSettings()

  return (
    <Page>
      <PageHeader
        title={t('shipment.settings.title')}
        subtitle={t('shipment.settings.subtitle')}
        breadcrumb={
          <span>
            {t('shipment.title')}
            <span className="px-1.5 text-border-strong">/</span>
            <span className="text-text-secondary">{t('shipment.settings.title')}</span>
          </span>
        }
      />

      {isLoading || !data ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <ShippingSettingsForm settings={data} />
      )}
    </Page>
  )
}
