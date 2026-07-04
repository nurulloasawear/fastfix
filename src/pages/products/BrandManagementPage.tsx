import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlusCircle, RecordsTable, useBrands } from '@/features/products'

export function BrandManagementPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useBrands()
  const brands = data?.brands ?? []

  return (
    <Page>
      <PageHeader
        title={t('products.setting.title')}
        breadcrumb={`${t('products.home')} › ${t('products.setting.title')} › ${t('products.setting.brandTitle')}`}
      />

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-text">{t('products.setting.brandTitle')}</h2>
            <p className="text-sm text-muted">{t('products.setting.brandDesc')}</p>
          </div>
          <Link to="/products/product-setting/brand-registration">
            <Button>
              <PlusCircle size={16} /> {t('products.brand.register')}
            </Button>
          </Link>
        </div>

        <RecordsTable
          nameLabel={t('products.brand.name')}
          isLoading={isLoading}
          rows={brands.map((item) => ({ kind: 'brand', item }))}
        />
      </Card>
    </Page>
  )
}
