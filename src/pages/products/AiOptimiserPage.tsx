import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Zap } from '@/features/products'

// OZB MVP: full page shows "Coming Soon" state.
// Full implementation in v2 — see spec §8.
export function AiOptimiserPage() {
  const { t } = useTranslation()

  return (
    <Page>
      <PageHeader
        title={t('products.aiPopup.title')}
        breadcrumb={`${t('products.home')} › ${t('products.title')} › ${t('products.aiPopup.title')}`}
      />

      {/* Hero card */}
      <Card className="flex flex-col items-center gap-4 py-16 px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-bg text-warning">
          <Zap size={32} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-text">
            {t('products.aiPopup.title')}
          </h2>
          <p className="max-w-md text-sm text-muted">
            {t('products.aiPopup.subtitle')}
          </p>
        </div>

        {/* Coming Soon badge */}
        <div className="mt-4 rounded-full border-2 border-dashed border-border-strong px-8 py-4">
          <p className="text-xl font-semibold text-text-secondary">Tez orada — Coming Soon</p>
          <p className="mt-1 text-sm text-muted">
            AI-powered image polish and description helper are coming in v2.
          </p>
        </div>

        {/* Feature preview tiles */}
        <div className="mt-6 grid w-full max-w-lg grid-cols-2 gap-4">
          <FeatureTile title={t('products.aiPopup.imagePolish')} />
          <FeatureTile title={t('products.aiPopup.descHelper')} />
        </div>
      </Card>
    </Page>
  )
}

function FeatureTile({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-bg p-4 opacity-60">
      <div className="h-20 w-full rounded-md bg-bg border border-border" />
      <p className="text-center text-sm font-semibold text-text-secondary">{title}</p>
      <Badge tone="gray">Coming Soon</Badge>
    </div>
  )
}
