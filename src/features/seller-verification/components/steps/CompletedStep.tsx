import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export function CompletedStep() {
  const { t } = useTranslation()

  return (
    <Card className="p-8 text-center md:p-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
        <ShieldCheck className="h-8 w-8 text-success" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-text md:text-2xl">
        {t('sellerVerification.completed.title')}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        {t('sellerVerification.completed.description')}
      </p>
      <Link
        to="/home"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-brand bg-brand px-6 text-base font-semibold text-white transition-colors hover:border-accent hover:bg-accent hover:text-brand"
      >
        {t('sellerVerification.completed.dashboard')}
      </Link>
    </Card>
  )
}
