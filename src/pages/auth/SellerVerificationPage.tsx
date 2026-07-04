import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useSellerStatus } from "../../features/seller-verification/queries/seller.queries"
import { VERIFICATION_STEP_ORDER } from "../../features/seller-verification/utils/constants"
import { VerificationProgress } from "../../features/seller-verification/components/VerificationProgress"
import { SellerVerificationStepper } from "../../features/seller-verification/components/SellerVerificationStepper"
import { VerificationCompleted } from "../../features/seller-verification/components/VerificationCompleted"
import { PersonalInfoForm } from "../../features/seller-verification/components/PersonalInfoForm"
import { EmailVerificationCard } from "../../features/seller-verification/components/EmailVerificationCard"
import { PassportVerificationCard } from "../../features/seller-verification/components/PassportVerificationCard"
import { InnVerificationCard } from "../../features/seller-verification/components/InnVerificationCard"
import { CompanyInfoCard } from "../../features/seller-verification/components/CompanyInfoCard"
import { BankAccountCard } from "../../features/seller-verification/components/BankAccountCard"
import { CertificateUploadCard } from "../../features/seller-verification/components/CertificateUploadCard"
import { sellerVerificationI18n } from "../../features/seller-verification/i18n"

type StepKeyType = (typeof VERIFICATION_STEP_ORDER)[number]

const STEP_COMPONENT_MAPPING: Record<StepKeyType, React.ComponentType> = {
  personal_info: PersonalInfoForm,
  email: EmailVerificationCard,
  passport: PassportVerificationCard,
  inn: InnVerificationCard,
  bank: BankAccountCard,
  company: CompanyInfoCard,
  certificate: CertificateUploadCard,
  completed: VerificationCompleted,
} as const

// DEV_MODE: Set to false in production to enforce strict sequential step completion
const IS_DEV_MODE =  true

export const SellerVerificationPage: React.FC = React.memo(() => {
  const { t } = useTranslation()
  const { data: status, isLoading, error, refetch } = useSellerStatus()

  // 1. Local Step State: Allows free navigation during development
  const [activeStep, setActiveStep] = useState<StepKeyType>(VERIFICATION_STEP_ORDER[0])

  // Synchronize local state when server updates progress (e.g., after successful save)
  useEffect(() => {
    if (status?.currentStep) {
      setActiveStep(status.currentStep as StepKeyType)
    }
  }, [status?.currentStep])

  // 2. Pure business logic handler for step changes
  const handleStepChange = useCallback((newStep: StepKeyType) => {
    // TODO: Production Locking Logic
    // Remove the IS_DEV_MODE bypass in production to prevent skipping ahead.
    // Example:
    // const targetIndex = VERIFICATION_STEP_ORDER.indexOf(newStep);
    // const serverIndex = VERIFICATION_STEP_ORDER.indexOf(status?.currentStep as StepKeyType);
    // if (!IS_DEV_MODE && targetIndex > serverIndex) return;

    setActiveStep(newStep)
  }, [])

  if (isLoading) {
    console.log("ACTIVE STEP =", activeStep)
    return (
      <div 
        className="min-h-screen bg-[#FFFDF7] p-4 md:p-8"
        role="status" 
        aria-busy="true"
        aria-label={t(sellerVerificationI18n.loading)}
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="h-32 w-full animate-pulse rounded-2xl bg-[#E8DDC7]/40" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="h-[400px] w-full animate-pulse rounded-2xl bg-[#E8DDC7]/40 shadow-sm" />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="h-[500px] w-full animate-pulse rounded-2xl bg-[#E8DDC7]/40 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-4 py-20 text-center" 
        role="alert"
      >
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-8 shadow-sm">
          <p className="mb-6 text-sm font-medium text-rose-800">
            {t(sellerVerificationI18n.failed)}
          </p>
          <button
            type="button"
            onClick={() => { void refetch() }}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#8B5E3C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#6F472D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5E3C]"
          >
            {t(sellerVerificationI18n.retry)}
          </button>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div 
        className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-4 py-20 text-center" 
        role="status"
      >
        <div className="w-full max-w-md rounded-2xl border border-[#E8DDC7] bg-[#FFFCF5] p-8 shadow-sm">
          <p className="text-sm font-medium text-[#7B6A58]">
            {t(sellerVerificationI18n.title)}
          </p>
        </div>
      </div>
    )
  }

  const normalizedStatus = (status.verificationStatus || "").toLowerCase()
  const isGloballyApproved = 
    status.verified || 
    normalizedStatus === "verified" || 
    normalizedStatus === "approved"

  // Only force the 'completed' UI if it's globally approved OR if dev mode is off
  if (isGloballyApproved || (status.currentStep === "completed" && !IS_DEV_MODE)) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] transition-colors duration-500">
        <main className="mx-auto max-w-3xl p-4 py-12 md:p-8 animate-in fade-in zoom-in-95 duration-500">
          <VerificationCompleted />
        </main>
      </div>
    )
  }

  const ActiveCardComponent = STEP_COMPONENT_MAPPING[activeStep] || STEP_COMPONENT_MAPPING.personal_info
  console.log(ActiveCardComponent.name)
  console.log({
  activeStep,
  statusCurrentStep: status.currentStep,
  ActiveCard: ActiveCardComponent.name,
})
  return (
    <div className="min-h-screen bg-[#FFFDF7] font-sans selection:bg-[#E8DDC7] selection:text-[#3F2C1F] transition-colors duration-300">
      <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <header className="space-y-2 px-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#3F2C1F] md:text-3xl lg:text-4xl">
            {t(sellerVerificationI18n.title)}
          </h1>
          <p className="max-w-2xl text-base text-[#7B6A58]">
            {t(sellerVerificationI18n.subtitle)}
          </p>
        </header>

        <section className="rounded-2xl border border-[#E8DDC7] bg-[#FFFCF5] p-5 shadow-sm transition-all hover:shadow-md md:p-6">
          <VerificationProgress 
            status={status} 
            isLoading={false} 
            error={null} 
          />
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-8 z-10">
            <div className="rounded-2xl border border-[#E8DDC7] bg-[#FFFCF5] p-5 shadow-sm transition-all hover:shadow-md md:p-6">
              <SellerVerificationStepper 
                status={status}
                currentStep={activeStep} 
                onStepChange={handleStepChange} 
              />
            </div>
          </aside>

          <section 
            className="lg:col-span-8 xl:col-span-9 relative" 
            aria-live="polite"
          >
            {/* Wrapper controls the animation when switching active steps.
              Note: Using key={activeStep} forces React to remount the card, triggering mount animations beautifully.
            */}
            <div 
              key={activeStep} 
              className="rounded-2xl border border-[#E8DDC7] bg-[#FFFCF5] shadow-sm transition-all hover:shadow-md p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500 ease-out"
            >
              <ActiveCardComponent />
            </div>
          </section>
          
        </div>
      </main>
    </div>
  )
})

SellerVerificationPage.displayName = "SellerVerificationPage"