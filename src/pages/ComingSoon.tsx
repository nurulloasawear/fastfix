import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'

// Placeholder for pages in the Shopee IA not yet rebuilt (filled in per the
// per-section specs in OZB/architecture/FE/seller-portal/).
export function ComingSoon() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const name = pathname.split('/').filter(Boolean).join(' / ') || 'page'

  return (
    <div className="p-6 md:p-8">
      <Card className="flex flex-col items-center gap-3 p-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg text-xl">🚧</span>
        <h1 className="text-lg font-semibold capitalize text-text">{name}</h1>
        <p className="text-sm text-muted">{t('common.comingSoon')}</p>
      </Card>
    </div>
  )
}
