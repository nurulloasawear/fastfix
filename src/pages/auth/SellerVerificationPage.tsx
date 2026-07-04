import { useTranslation } from 'react-i18next'
import { VerificationWizard } from '@/features/seller-verification'

// Public full-screen onboarding route (outside the app shell) — the wizard
// itself owns loading/error/completed states.
export function SellerVerificationPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg">
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 md:py-12">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
            {t('sellerVerification.title')}
          </h1>
          <p className="text-sm text-muted md:text-base">
            {t('sellerVerification.subtitle')}
          </p>
        </header>
        <VerificationWizard />
      </main>
    </div>
  )
}
