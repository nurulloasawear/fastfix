
// VerificationCompleted.tsx
import * as React from "react"
import { useTranslation } from "react-i18next"
import { ShieldCheck, ArrowRight, User, Mail, FileText, Building, CreditCard, Award, Calendar, BarChart2 } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import { VERIFICATION_STEP_ORDER } from "../utils/constants"
import type { SellerProfile, SellerStatus } from "../types/seller-verification.types"

interface VerificationCompletedProps {
  readonly profile?: SellerProfile | null
  readonly status?: SellerStatus | null
  readonly className?: string
  readonly onActionClick?: () => void
  readonly onBackToDashboard?: () => void
  readonly interactive?: boolean
}

export const VerificationCompleted: React.FC<VerificationCompletedProps> = React.memo(({
  profile,
  status,
  className = "",
  onActionClick,
  onBackToDashboard,
  interactive = false,
}) => {
  const { t } = useTranslation()

  const progressPercentage = status?.progressPercentage ?? 0
  const completedSteps = status?.completedSteps ?? 0
  const totalSteps = status?.totalSteps ?? VERIFICATION_STEP_ORDER.length

  const formattedDate = React.useMemo(() => {
    if (!profile?.updatedAt) return ""
    try {
      return new Date(profile.updatedAt).toLocaleDateString()
    } catch {
      return ""
    }
  }, [profile?.updatedAt])

  return (
    <div 
      className={`w-full max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8 ${className}`}
      role="region"
      aria-labelledby="verification-completed-title"
    >
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400">
          <ShieldCheck className="h-10 w-10" aria-hidden="true" />
        </div>
        <h1 
          id="verification-completed-title"
          className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl"
        >
          {t("seller.completed.title")}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t("seller.completed.description")}
        </p>
      </div>

      <div 
        className="mb-8 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-900/50"
        role="group"
        aria-label={t("seller.status.progress")}
      >
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t("seller.status.progress")}
          </span>
          <span aria-live="polite">{progressPercentage}%</span>
        </div>
        <div 
          className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className="h-full bg-green-500 transition-all duration-500 dark:bg-green-400"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-right text-xs text-slate-400 dark:text-slate-500">
          {t("seller.status.completedSteps")}: {completedSteps} / {totalSteps}
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
          <User className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.profile.fullName")}</p>
            <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{profile?.fullName || t("seller.profile.empty")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
          <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.profile.email")}</p>
            <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{profile?.email || t("seller.profile.empty")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
          <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.profile.date")}</p>
            <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{formattedDate || t("seller.profile.empty")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
          <Building className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.profile.status")}</p>
              <p className="sr-only">{profile?.verificationStatus || ""}</p>
            </div>
            {profile?.verificationStatus && (
              <StatusBadge status={profile.verificationStatus as any} className="mt-0.5" />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("seller.completed.summaryTitle")}
        </h2>
        <ul className="grid gap-2.5 sm:grid-cols-2" role="list">
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <FileText className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <span>{t("seller.steps.passport")}: {t("seller.status.verified")}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Building className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <span>{t("seller.steps.inn")}: {t("seller.status.verified")}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <CreditCard className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <span>{t("seller.steps.bank")}: {t("seller.status.verified")}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Award className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <span>{t("seller.steps.certificate")}: {t("seller.status.completed")}</span>
          </li>
        </ul>
      </div>

      {interactive && (onActionClick || onBackToDashboard) && (
        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
          {onActionClick && (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 sm:w-auto"
            >
              <span>{t("seller.completed.actionButton")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
            >
              {t("seller.completed.dashboardButton")}
            </button>
          )}
        </div>
      )}
    </div>
  )
})

VerificationCompleted.displayName = "VerificationCompleted"