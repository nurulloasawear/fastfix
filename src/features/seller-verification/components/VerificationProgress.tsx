import * as React from "react"
import { useTranslation } from "react-i18next"
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ShieldAlert, 
  User, 
  Mail, 
  Shield, 
  Key, 
  Landmark, 
  Building2, 
  FileCheck2 
} from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import { VERIFICATION_STEP_ORDER } from "../utils/constants"
import type { SellerStatus } from "../types/seller-verification.types"

interface VerificationProgressProps {
  readonly status?: SellerStatus | null
  readonly isLoading?: boolean
  readonly error?: Error | null
  readonly className?: string
}

const STEP_ICONS = {
  personal_info: User,
  email: Mail,
  passport: Shield,
  inn: Key,
  bank: Landmark,
  company: Building2,
  certificate: FileCheck2,
  completed: CheckCircle2,
} as const

const STATUS_INDICATORS = {
  done: {
    icon: CheckCircle2,
    styles: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
    iconClass: "text-emerald-500",
  },
  current: {
    icon: Clock,
    styles: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 animate-pulse",
    iconClass: "text-blue-500 animate-pulse",
  },
  upcoming: {
    icon: HelpCircle,
    styles: "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800",
    iconClass: "text-slate-300 dark:text-slate-700",
  },
  failed: {
    icon: ShieldAlert,
    styles: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50",
    iconClass: "text-rose-500",
  },
} as const

const PROGRESS_BAR_THEMES = {
  pending: "bg-amber-500 dark:bg-amber-400",
  processing: "bg-blue-500 dark:bg-blue-400",
  in_progress: "bg-blue-500 dark:bg-blue-400",
  verified: "bg-green-500 dark:bg-green-400",
  approved: "bg-emerald-500 dark:bg-emerald-400",
  rejected: "bg-red-500 dark:bg-red-400",
  failed: "bg-rose-500 dark:bg-rose-400",
  expired: "bg-slate-500 dark:bg-slate-400",
  not_sent: "bg-slate-300 dark:bg-slate-700",
  completed: "bg-indigo-500 dark:bg-indigo-400",
  active: "bg-teal-500 dark:bg-teal-400",
  inactive: "bg-gray-400 dark:bg-gray-600",
  default: "bg-blue-500 dark:bg-blue-400",
} as const

export const VerificationProgress: React.FC<VerificationProgressProps> = React.memo(({
  status,
  isLoading = false,
  error = null,
  className = "",
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div 
        className={`w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
        role="status"
        aria-busy="true"
      >
        <div className="space-y-2">
          <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
        </div>
        <div className="space-y-3 pt-4">
          {VERIFICATION_STEP_ORDER.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-1/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className={`w-full flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 ${className}`}
        role="alert"
      >
        <AlertTriangle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span>{t("seller.progress.error")}</span>
      </div>
    )
  }

  if (!status) {
    return (
      <div 
        className={`w-full text-center rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500 ${className}`}
        role="status"
      >
        {t("seller.progress.empty")}
      </div>
    )
  }

  const currentStep = status.currentStep
  const activeIndex = VERIFICATION_STEP_ORDER.indexOf(currentStep as (typeof VERIFICATION_STEP_ORDER)[number])
  const totalSteps = status.totalSteps || VERIFICATION_STEP_ORDER.length
  const completedSteps = status.completedSteps ?? 0
  const remainingSteps = Math.max(0, totalSteps - completedSteps)
  const progressPercentage = status.progressPercentage ?? 0

  const computedStatus = (
    status.verified ? "verified" : 
    (status as any).verificationStatus || 
    (status as any).status || 
    "pending"
  ).toLowerCase()

  const isFailedState = computedStatus === "failed" || computedStatus === "rejected"
  const isGlobalSuccess = status.verified || computedStatus === "approved" || computedStatus === "completed"

  const progressBarColorClass = PROGRESS_BAR_THEMES[computedStatus as keyof typeof PROGRESS_BAR_THEMES] || PROGRESS_BAR_THEMES.default

  return (
    <div 
      className={`w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
      role="region"
      aria-labelledby="verification-progress-headline"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="verification-progress-headline" className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {t("seller.progress.title")}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{t("seller.progress.completed_steps")}: <strong className="font-semibold text-slate-700 dark:text-slate-300">{completedSteps}</strong></span>
            <span>{t("seller.progress.remaining_steps")}: <strong className="font-semibold text-slate-700 dark:text-slate-300">{remainingSteps}</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.progress.status")}:</span>
          <StatusBadge status={computedStatus as any} />
        </div>
      </div>

      <div className="mb-6" role="group" aria-label={t("seller.progress.percentage")}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
          <div 
            className={`h-full transition-all duration-500 ease-out ${progressBarColorClass}`}
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <nav aria-label={t("seller.progress.title")}>
        <ul className="relative space-y-4" role="list">
          {VERIFICATION_STEP_ORDER.map((stepKey, idx) => {
            const StepIcon = STEP_ICONS[stepKey as keyof typeof STEP_ICONS]
            if (!StepIcon) return null

            const isStepCompleted = idx < activeIndex || isGlobalSuccess
            const isStepActive = idx === activeIndex && !isStepCompleted
            
            const indicatorKey = (isStepActive && isFailedState) 
              ? "failed" 
              : isStepCompleted 
                ? "done" 
                : isStepActive 
                  ? "current" 
                  : "upcoming"
                  
            const indicatorConfig = STATUS_INDICATORS[indicatorKey]
            const IndicatorIcon = indicatorConfig.icon

            return (
              <li 
                key={stepKey} 
                className={`relative flex items-start gap-4 rounded-xl border p-3.5 transition-colors duration-200 ${
                  isStepActive 
                    ? "border-blue-100 bg-blue-50/20 dark:border-blue-900/30 dark:bg-blue-950/10" 
                    : "border-transparent"
                }`}
                aria-current={isStepActive ? "step" : undefined}
              >
                {idx !== VERIFICATION_STEP_ORDER.length - 1 && (
                  <div 
                    className={`absolute bottom-0 left-7 top-12 w-0.5 -translate-x-1/2 rounded bg-slate-100 dark:bg-slate-900 ${
                      isStepCompleted ? "bg-emerald-100 dark:bg-emerald-950/40" : ""
                    }`} 
                    aria-hidden="true" 
                  />
                )}

                <div 
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-200 ${indicatorConfig.styles}`}
                  aria-hidden="true"
                >
                  <StepIcon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold transition-colors ${
                      isStepActive ? "text-blue-700 dark:text-blue-400" : isStepCompleted ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {t(`seller.steps.${stepKey}`)}
                    </span>
                    <IndicatorIcon className={`h-4 w-4 flex-shrink-0 ${indicatorConfig.iconClass}`} aria-hidden="true" />
                  </div>
                  <p className={`mt-0.5 text-xs transition-colors ${
                    isStepActive ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"
                  }`}>
                    {t(`seller.steps.${stepKey}_desc`)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
})

VerificationProgress.displayName = "VerificationProgress"