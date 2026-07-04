// InnVerificationCard.tsx
import * as React from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { CheckCircle2, AlertCircle, RefreshCw, Loader2, Building2, User } from "lucide-react"
import {
  useInnVerificationStatus,
  useVerifyInn,
} from "../queries/inn.queries"
import { INN_LENGTH } from "../utils/constants"
import { validateInn } from "../utils/validators"
import type { VerifyInnPayload } from "../types/seller-verification.types"

interface InnVerificationCardProps {
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

interface InnFormValues {
  inn: string
}

export function InnVerificationCard({
  disabled = false,
  readOnly = false,
  className = "",
}: InnVerificationCardProps): React.JSX.Element {
  const { t } = useTranslation()

  const {
    data: statusData,
    isLoading: isFetchLoading,
    error: fetchError,
    refetch: refetchStatus,
  } = useInnVerificationStatus()

  const {
    mutate: verifyInnMutate,
    isPending: isVerifying,
    error: verifyError,
    reset: resetVerifyError,
  } = useVerifyInn()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<InnFormValues>({
    defaultValues: { inn: "" },
    mode: "onChange",
  })

  React.useEffect(() => {
    if (statusData?.inn) {
      resetForm({ inn: statusData.inn })
    }
  }, [statusData, resetForm])

  const onSubmit = React.useCallback(
    (values: InnFormValues) => {
      if (disabled || readOnly || isVerifying) return
      resetVerifyError()
      const payload: VerifyInnPayload = { inn: values.inn }
      verifyInnMutate(payload, {
        onSuccess: () => {
          resetForm()
        },
      })
    },
    [disabled, readOnly, isVerifying, verifyInnMutate, resetVerifyError, resetForm]
  )

  const handleRetry = React.useCallback(() => {
    resetVerifyError()
    refetchStatus()
  }, [resetVerifyError, refetchStatus])

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

  const activeError = verifyError?.message || fetchError?.message
  const status = statusData?.status || "empty"
  
  const isVerified = status === "verified"
  const isPending = (status === "empty" && isVerifying) || status === "not_verified"
  const isRejected = status === "failed"

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t("seller.inn.title")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("seller.inn.subtitle")}
          </p>
        </div>
        <div>
          {isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("seller.inn.status.verified")}
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("seller.inn.status.checking")}
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {t("seller.inn.status.failed")}
            </span>
          )}
          {!isVerified && !isPending && !isRejected && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
              {t("seller.inn.status.empty")}
            </span>
          )}
        </div>
      </div>

      {activeError && (
        <div className="mb-6 flex gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">{t("seller.inn.errorTitle")}:</span>{" "}
            <span className="block sm:inline">{activeError}</span>
          </div>
        </div>
      )}

      {isVerified && statusData && (
        <div className="space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {t("seller.inn.fields.inn")}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {statusData.inn || t("seller.inn.placeholders.noData")}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {t("seller.inn.fields.verifiedAt")}
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {statusData.checkedAt ? statusData.checkedAt.split("T")[0] : t("seller.inn.placeholders.noData")}
              </span>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Building2 className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">{t("seller.inn.fields.companyName")}</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {statusData.companyName || t("seller.inn.placeholders.noData")}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <User className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">{t("seller.inn.fields.ownerName")}</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {statusData.ownerName || t("seller.inn.placeholders.noData")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(!isVerified) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="innInput" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("seller.inn.fields.inn")}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="innInput"
                  type="text"
                  inputMode="numeric"
                  maxLength={INN_LENGTH}
                  disabled={disabled || readOnly || isVerified || isPending || isVerifying}
                  {...register("inn", {
                    required: t("seller.inn.validation.required"),
                    validate: (value) => validateInn(value) || t("seller.inn.validation.invalid"),
                  })}
                  className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${
                    errors.inn ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="123456789"
                  aria-invalid={errors.inn ? "true" : "false"}
                  aria-describedby={errors.inn ? "innError" : undefined}
                />
              </div>
              {!isVerified && !readOnly && (
                <div className="flex gap-2 flex-shrink-0">
                  {isRejected && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={disabled || isVerifying}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("seller.inn.actions.retry")}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={disabled || isPending || isVerifying || !isValid}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 flex-1 sm:flex-initial"
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("seller.inn.actions.checking")}
                      </span>
                    ) : (
                      t("seller.inn.actions.verify")
                    )}
                  </button>
                </div>
              )}
            </div>
            {errors.inn && (
              <p id="innError" className="text-xs text-red-500 font-medium mt-1">
                {errors.inn.message}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  )
}