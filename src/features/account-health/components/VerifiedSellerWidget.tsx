import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ShieldIcon } from './icons'

export function VerifiedSellerWidget() {
  const { t } = useTranslation()

  return (
    <Card className="p-5 flex flex-col items-center gap-3 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand/10">
        <ShieldIcon size={24} className="text-brand" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text">{t('accountHealth.verifiedSeller.title')}</p>
        <p className="text-xs text-muted mt-1">{t('accountHealth.verifiedSeller.subtitle')}</p>
      </div>
      <Button variant="ghost" size="sm" className="text-xs text-brand hover:underline px-0 h-auto">
        {t('accountHealth.verifiedSeller.viewDetails')}
      </Button>
    </Card>
  )
}
