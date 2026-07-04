import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlusCircle } from '@/features/products'

function SettingPanel({
  title,
  desc,
  action,
  to,
}: {
  title: string
  desc: string
  action: string
  to: string
}) {
  return (
    <Card className="flex flex-col items-start gap-3 p-6">
      <h2 className="text-base font-semibold text-text">{title}</h2>
      <p className="text-sm text-muted">{desc}</p>
      <Link to={to} className="mt-1">
        <Button variant="outline">
          <PlusCircle size={16} /> {action}
        </Button>
      </Link>
    </Card>
  )
}

export function ProductSettingPage() {
  const { t } = useTranslation()

  return (
    <Page>
      <PageHeader
        title={t('products.setting.title')}
        breadcrumb={`${t('products.home')} › ${t('products.setting.title')}`}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SettingPanel
          title={t('products.setting.brandTitle')}
          desc={t('products.setting.brandDesc')}
          action={t('products.setting.addBrand')}
          to="/products/product-setting/brand-management"
        />
        <SettingPanel
          title={t('products.setting.sizeTitle')}
          desc={t('products.setting.sizeDesc')}
          action={t('products.setting.addSize')}
          to="/products/product-setting/size-chart-management"
        />
      </div>
    </Page>
  )
}
