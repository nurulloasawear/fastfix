import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { LANGUAGES, setLanguage } from '@/i18n'
import { useSellerStatus } from '../api/seller-verification.queries'
import { UI_STEPS, uiStepIndexFor } from '../lib/constants'
import { ProgressTrack } from './ProgressTrack'
import { ProfileStep } from './steps/ProfileStep'
import { IdentityStep } from './steps/IdentityStep'
import { BankStep } from './steps/BankStep'
import { CompanyStep } from './steps/CompanyStep'
import { DocumentsStep } from './steps/DocumentsStep'
import { CompletedStep } from './steps/CompletedStep'

const STEP_SCREENS = [ProfileStep, IdentityStep, BankStep, CompanyStep, DocumentsStep] as const

export function VerificationWizard() {
  const { t, i18n } = useTranslation()
  const { data: status, isLoading, isError, refetch } = useSellerStatus()

  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  // Frontier already applied to activeIndex; lets the wizard slide forward
  // exactly once each time the backend unlocks the next step.
  const appliedReached = useRef(0)

  const reachedIndex = status ? uiStepIndexFor(status.currentStep) : 0

  useEffect(() => {
    if (reachedIndex > appliedReached.current) {
      // Follow the frontier only if the user is standing on it; someone
      // reviewing an earlier step must not be yanked forward.
      if (activeIndex === appliedReached.current) {
        setDirection('forward')
        setActiveIndex(reachedIndex)
      }
      appliedReached.current = reachedIndex
    }
  }, [reachedIndex, activeIndex])

  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-busy="true" aria-label={t('sellerVerification.loading')}>
        <Card className="p-6"><CardSkeleton lines={3} /></Card>
        <Card className="p-6"><CardSkeleton lines={8} /></Card>
      </div>
    )
  }

  if (isError || !status) {
    return (
      <Card className="p-10">
        <ErrorState
          title={t('sellerVerification.common.error')}
          description={t('sellerVerification.loadFailed')}
          retryLabel={t('sellerVerification.retry')}
          onRetry={() => { void refetch() }}
        />
      </Card>
    )
  }

  const isApproved =
    status.verified ||
    status.verificationStatus === 'verified' ||
    status.verificationStatus === 'approved' ||
    status.currentStep === 'completed'

  if (isApproved) {
    return <CompletedStep />
  }

  const steps = UI_STEPS.map(({ key }) => ({
    key,
    title: t(`sellerVerification.steps.${key}.title`),
    description: t(`sellerVerification.steps.${key}.description`),
  }))

  const goTo = (index: number) => {
    if (index < 0 || index > reachedIndex || index === activeIndex) return
    setDirection(index > activeIndex ? 'forward' : 'back')
    setActiveIndex(index)
  }

  const ActiveStep = STEP_SCREENS[activeIndex] ?? ProfileStep

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors ${
              i18n.language === lang
                ? 'bg-brand text-white'
                : 'text-muted hover:bg-table-header hover:text-text'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <Card className="p-5 md:p-6">
        <ProgressTrack
          steps={steps}
          activeIndex={activeIndex}
          reachedIndex={reachedIndex}
          fillPercent={status.progressPercentage}
          onStepSelect={goTo}
        />
      </Card>

      {/* key remount + directional keyframes = the slide between steps */}
      <div className="overflow-x-clip">
        <Card
          key={steps[activeIndex]?.key}
          className={`p-6 md:p-8 ${direction === 'forward' ? 'animate-step-forward' : 'animate-step-back'}`}
        >
          <ActiveStep />
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('sellerVerification.nav.back')}
        </Button>
        <Button
          variant="primary"
          disabled={activeIndex >= reachedIndex}
          onClick={() => goTo(activeIndex + 1)}
        >
          {t('sellerVerification.nav.next')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
