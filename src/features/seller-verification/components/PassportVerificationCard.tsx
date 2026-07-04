// PassportVerificationCard.tsx
import * as React from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CheckCircle2, AlertCircle, RefreshCw, Loader2, CreditCard, Calendar, User, ExternalLink } from "lucide-react"
import { usePassportVerificationStatus, useStartPassportVerification } from "../queries/passport.queries"
import { PASSPORT_MIN_LENGTH, PASSPORT_MAX_LENGTH, REGEX } from "../utils/constants"
import type { StartPassportVerificationPayload } from "../types/seller-verification.types"

interface PassportVerificationCardProps {
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

interface PassportFormValues {
  passportNumber: string
}

export function PassportVerificationCard({
  disabled = false,
  readOnly = false,
  className = "",
}: PassportVerificationCardProps): React.JSX.Element {
  const { t } = useTranslation()

  const {
    data: statusData,
    isLoading: isFetchLoading,
    error: fetchError,
    refetch: refetchStatus,
  } = usePassportVerificationStatus()

  const {
    mutate: startVerificationMutate,
    isPending: isStarting,
    error: startError,
    reset: resetStartError,
  } = useStartPassportVerification()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<PassportFormValues>({
    defaultValues: { passportNumber: "" },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (statusData?.passportNumber) {
      resetForm({ passportNumber: statusData.passportNumber })
    }
  }, [statusData, resetForm])

  const onSubmit = React.useCallback(
    (values: PassportFormValues) => {
      if (disabled || readOnly || isStarting) return
      resetStartError()
      
      const payload: StartPassportVerificationPayload = {
        passportNumber: values.passportNumber.toUpperCase().trim(),
      }

      startVerificationMutate(payload, {
        onSuccess: (session) => {
          if (session?.redirectUrl) {
            window.location.assign(session.redirectUrl)
          }
        },
      })
    },
    [disabled, readOnly, isStarting, startVerificationMutate, resetStartError]
  )

  const handleRetry = React.useCallback(() => {
    resetStartError()
    refetchStatus()
  }, [resetStartError, refetchStatus])

  if (isFetchLoading) {
    return (
      <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-6 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-900" />
          <div className="h-10 w-full rounded-lg bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    )
  }

  const activeError = startError?.message || fetchError?.message
  const status = statusData?.status || "empty"

  const isVerified = status === "verified" || (statusData?.verified ?? false)
  const isPending = status === "pending"
  const isRejected = status === "rejected"
  const isWaitingAction = isStarting

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t("seller.passport.title")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("seller.passport.subtitle")}
          </p>
        </div>
        <div>
          {isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("seller.passport.status.verified")}
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("seller.passport.status.pending")}
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {t("seller.passport.status.rejected")}
            </span>
          )}
          {!isVerified && !isPending && !isRejected && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
              {t("seller.passport.status.empty")}
            </span>
          )}
        </div>
      </div>

      {activeError && (
        <div className="mb-6 flex gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">{t("seller.passport.errorTitle")}:</span>{" "}
            <span className="block sm:inline">{activeError}</span>
          </div>
        </div>
      )}

      {isPending && (
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-950/40 dark:bg-blue-950/10">
          <div className="flex gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {t("seller.passport.pollingNotice")}
              </p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                {t("seller.passport.autoRefreshState")}
              </p>
            </div>
          </div>
        </div>
      )}

      {isRejected && statusData?.rejectReason && (
        <div className="mb-6 flex gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">{t("seller.passport.fields.reason")}:</span>
            <p className="text-sm opacity-90">{statusData.rejectReason}</p>
          </div>
        </div>
      )}

      {isVerified && statusData && (
        <div className="space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <CreditCard className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">{t("seller.passport.fields.passportNumber")}</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 uppercase">
                  {statusData.passportNumber || t("seller.passport.placeholders.noData")}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">{t("seller.passport.fields.verifiedAt")}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {statusData.verifiedAt ? statusData.verifiedAt.split("T")[0] : t("seller.passport.placeholders.noData")}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
          <div className="flex items-start gap-2.5">
            <User className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">{t("seller.passport.fields.fullName")}</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {statusData.fullName || t("seller.passport.placeholders.noData")}
              </span>
            </div>
          </div>
        </div>
      )}

      {!isVerified && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="passportNumberInput" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("seller.passport.fields.passportNumber")}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="passportNumberInput"
                  type="text"
                  autoCapitalize="characters"
                  maxLength={PASSPORT_MAX_LENGTH}
                  disabled={disabled || readOnly || isPending || isWaitingAction}
                  {...register("passportNumber", {
                    required: t("seller.passport.validation.required"),
                    validate: (value) => {
                      const trimmed = value.trim().toUpperCase()
                      if (trimmed.length < PASSPORT_MIN_LENGTH || trimmed.length > PASSPORT_MAX_LENGTH) {
                        return t("seller.passport.validation.invalid")
                      }
                      if (REGEX?.PASSPORT && !REGEX.PASSPORT.test(trimmed)) {
                        return t("seller.passport.validation.invalid")
                      }
                      return true
                    },
                  })}
                  className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm uppercase outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${
                    errors.passportNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="AA1234567"
                  aria-invalid={errors.passportNumber ? "true" : "false"}
                  aria-describedby={errors.passportNumber ? "passportError" : undefined}
                />
              </div>
              {!readOnly && (
                <div className="flex gap-2 flex-shrink-0">
                  {isRejected && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={disabled || isWaitingAction}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("seller.passport.actions.retry")}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={disabled || isPending || isWaitingAction || !isValid}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 flex-1 sm:flex-initial"
                  >
                    {isWaitingAction ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("seller.passport.actions.redirecting")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {t("seller.passport.actions.verify")}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
            {errors.passportNumber && (
              <p id="passportError" className="text-xs text-red-500 font-medium mt-1">
                {errors.passportNumber.message}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  )
}