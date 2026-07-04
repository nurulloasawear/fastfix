// SellerVerificationStepper.tsx
import * as React from "react"
import { useTranslation } from "react-i18next"
import * as Icons from "lucide-react"
import { VERIFICATION_STEP_ORDER } from "../utils/constants"
import type { VerificationStep } from "../types/enums"
import type { SellerStatus } from "../types/seller-verification.types"

interface SellerVerificationStepperProps {
  status: SellerStatus;
  currentStep: VerificationStep
  onStepChange: (step: VerificationStep) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function SellerVerificationStepper({
  status,
  currentStep,
  onStepChange,
  disabled = false,
  readOnly = false,
  className = "",
  orientation = "horizontal",
}: SellerVerificationStepperProps): React.JSX.Element {
  const { t } = useTranslation()

  const currentStepIndex = React.useMemo(() => {
    return VERIFICATION_STEP_ORDER.indexOf(currentStep)
  }, [currentStep])

  const progressPercentage = React.useMemo(() => {
    if (status.progressPercentage !== undefined) {
      return status.progressPercentage
    }
    const total = VERIFICATION_STEP_ORDER.length
    if (total <= 1) return 0
    return Math.round((currentStepIndex / (total - 1)) * 100)
  }, [status.progressPercentage, currentStepIndex])

  const handleStepClick = React.useCallback(
    (stepId: VerificationStep) => {
      if (disabled || readOnly) return
      onStepChange(stepId)
    },
    [disabled, readOnly, onStepChange]
  )

  const isVertical = orientation === "vertical"
  const ChevronRightIcon = Icons.ChevronRight

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100 uppercase">
            {t("seller.stepper.title")}
          </h2>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden dark:bg-slate-800" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
          <div className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-slate-400 dark:text-slate-500">
          <span>
            {t("seller.stepper.completedSteps", {
              count: status.completedSteps ?? currentStepIndex,
              total: status.totalSteps ?? VERIFICATION_STEP_ORDER.length,
            })}
          </span>
        </div>
      </div>

      <nav aria-label={t("seller.stepper.title")} className="overflow-x-auto scrollbar-none">
        <ol className={`flex ${isVertical ? "flex-col gap-4" : "flex-row items-center gap-2 sm:gap-4"} min-w-full`}>
          {VERIFICATION_STEP_ORDER.map((stepId, index) => {
            let StepIcon = Icons.Circle
            switch (stepId) {
              case "personal_info": StepIcon = Icons.UserRound; break
              case "email": StepIcon = Icons.Mail; break
              case "passport": StepIcon = Icons.CreditCard; break
              case "inn": StepIcon = Icons.FileCheck; break
              case "bank": StepIcon = Icons.CreditCard; break
              case "company": StepIcon = Icons.Building2; break
              case "certificate": StepIcon = Icons.FileCheck; break
              case "completed": StepIcon = Icons.ShieldCheck; break
            }

            const isTargetActive = stepId === currentStep
            const isCompleted = index < currentStepIndex
            
            // DEV MODE: Barcha qadamlar ochiq qoldirildi
            // TODO: Production uchun serverMaxIndex tekshiruvini backend ulanganda qaytarish kerak bo'ladi
            const isLocked = false
            
            const clickable = !disabled && !readOnly && !isTargetActive

            let stateColorClass = "bg-white border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500"
            if (isTargetActive) {
              stateColorClass = "bg-blue-600 border-blue-600 text-white shadow-sm dark:bg-blue-500 dark:border-blue-500"
            } else if (isCompleted) {
              stateColorClass = "bg-green-50 border-green-200 text-green-600 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-400"
            }

            let labelColorClass = "text-slate-400 dark:text-slate-600"
            if (isTargetActive) {
              labelColorClass = "text-blue-600 dark:text-blue-400"
            } else if (isCompleted) {
              labelColorClass = "text-slate-700 dark:text-slate-300"
            }

            const CheckIcon = Icons.Check

            return (
              <li key={stepId} className={`flex items-center ${isVertical ? "w-full" : "flex-shrink-0"}`}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => handleStepClick(stepId)}
                  aria-current={isTargetActive ? "step" : undefined}
                  className={`flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1.5 transition-colors w-full ${
                    clickable ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60" : "cursor-default"
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border transition-all duration-200 flex-shrink-0 ${stateColorClass}`}>
                    {isCompleted ? <CheckIcon className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                  </span>
                  
                  <div className={`${isVertical ? "block" : "hidden sm:block"}`}>
                    <p className={`text-xs font-semibold leading-none ${labelColorClass}`}>
                      {t(`seller.stepper.steps.${stepId}`)}
                    </p>
                  </div>
                </button>

                {!isVertical && index < VERIFICATION_STEP_ORDER.length - 1 && (
                  <ChevronRightIcon className="h-4 w-4 text-slate-300 dark:text-slate-700 mx-1 flex-shrink-0 hidden sm:block" aria-hidden="true" />
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}