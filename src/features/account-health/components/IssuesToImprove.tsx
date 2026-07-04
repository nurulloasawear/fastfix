import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type Props = {
  listingsWithIssues: number
  lateOrders: number
  isLoading?: boolean
}

export function IssuesToImprove({ listingsWithIssues, lateOrders, isLoading }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="h-5 w-48 animate-pulse rounded bg-border mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 animate-pulse rounded bg-border" />
          <div className="h-16 animate-pulse rounded bg-border" />
        </div>
      </Card>
    )
  }

  const hasIssues = listingsWithIssues > 0 || lateOrders > 0

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-text">{t('accountHealth.issues.title')}</h3>
        <Button variant="ghost" size="sm" className="text-xs text-brand hover:underline px-0 h-auto">
          {t('accountHealth.viewMore')}
        </Button>
      </div>
      <p className="text-xs text-muted mb-4">{t('accountHealth.issues.subtitle')}</p>

      {hasIssues ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/products?filter=issues')}
            className="text-left rounded-lg border border-border p-4 hover:bg-bg transition-colors"
          >
            <p className="text-xs text-muted mb-1">{t('accountHealth.issues.listingsWithIssues')}</p>
            <p className="text-2xl font-bold text-brand">{listingsWithIssues}</p>
          </button>
          <button
            type="button"
            onClick={() => navigate('/orders?filter=late')}
            className="text-left rounded-lg border border-border p-4 hover:bg-bg transition-colors"
          >
            <p className="text-xs text-muted mb-1">{t('accountHealth.issues.lateOrders')}</p>
            <p className="text-2xl font-bold text-brand">{lateOrders}</p>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted mb-1">{t('accountHealth.issues.listingsWithIssues')}</p>
            <p className="text-2xl font-bold text-success">0</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted mb-1">{t('accountHealth.issues.lateOrders')}</p>
            <p className="text-2xl font-bold text-success">0</p>
          </div>
        </div>
      )}

      {!hasIssues && (
        <p className="mt-3 text-xs text-muted text-center">{t('accountHealth.issues.none')}</p>
      )}
    </Card>
  )
}
