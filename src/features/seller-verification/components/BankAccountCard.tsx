// BankAccountCard.tsx
import * as React from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  useBankAccount,
  useCreateBankAccount,
  useUpdateBankAccount,
  useDeleteBankAccount,
} from "../queries/bank.queries"
import type {
  VerificationCardProps,
  SaveBankAccountPayload,
  UpdateBankAccountPayload,
} from "../types/seller-verification.types"

export function BankAccountCard({
  disabled = false,
  readOnly = false,
  className = "",
}: VerificationCardProps): React.JSX.Element {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = React.useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false)

  const {
    data: bankAccount,
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useBankAccount()

  const {
    mutate: createBankAccount,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreateBankAccount()

  const {
    mutate: updateBankAccount,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateBankAccount()

  const {
    mutate: deleteBankAccount,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDeleteError,
  } = useDeleteBankAccount()

  const isMutationPending = isCreating || isUpdating || isDeleting
  const isInteractionDisabled = disabled || readOnly || isMutationPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaveBankAccountPayload>()

  React.useEffect(() => {
    if (bankAccount) {
      reset({
        cardHolder: bankAccount.cardHolder,
        cardNumber: bankAccount.cardNumber,
        accountNumber: bankAccount.accountNumber || "",
        bankName: bankAccount.bankName,
        bankCode: bankAccount.bankCode || "",
      })
    } else {
      reset({
        cardHolder: "",
        cardNumber: "",
        accountNumber: "",
        bankName: "",
        bankCode: "",
      })
    }
  }, [bankAccount, reset])

  const clearErrors = (): void => {
    resetCreateError()
    resetUpdateError()
    resetDeleteError()
  }

  const onSubmit = (data: SaveBankAccountPayload): void => {
    if (isInteractionDisabled) return
    clearErrors()

    if (bankAccount) {
      const updatePayload: UpdateBankAccountPayload = {
        cardHolder: data.cardHolder,
        cardNumber: data.cardNumber,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        bankCode: data.bankCode,
      }
      updateBankAccount(updatePayload, {
        onSuccess: () => setIsEditing(false),
      })
    } else {
      createBankAccount(data, {
        onSuccess: () => setIsEditing(false),
      })
    }
  }

  const confirmDelete = (): void => {
    if (isInteractionDisabled) return
    clearErrors()
    deleteBankAccount(undefined, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setIsEditing(false)
        reset({
          cardHolder: "",
          cardNumber: "",
          accountNumber: "",
          bankName: "",
          bankCode: "",
        })
      },
    })
  }

  if (isFetchLoading) {
    return (
      <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-2/4 rounded bg-slate-100 dark:bg-slate-900" />
          <div className="h-32 w-full rounded-lg bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    )
  }

  const combinedError = createError?.message || updateError?.message || deleteError?.message || fetchError?.message

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t("seller.bank.title")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("seller.bank.subtitle")}
          </p>
        </div>
        {bankAccount && !readOnly && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => setIsEditing(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {t("seller.bank.edit")}
            </button>
            <button
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              {t("seller.bank.delete")}
            </button>
          </div>
        )}
      </div>

      {combinedError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400" role="alert">
          <div className="flex items-start space-x-2">
            <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-semibold">{t("seller.bank.errorTitle")}:</span> {combinedError}
            </div>
          </div>
        </div>
      )}

      {isFetchError && !bankAccount && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{t("seller.bank.errorTitle")}</p>
        </div>
      )}

      {!bankAccount && !isEditing && !isFetchError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/20">
          <svg className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">{t("seller.bank.emptyTitle")}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
            {t("seller.bank.emptyDesc")}
          </p>
          {!readOnly && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsEditing(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {t("seller.bank.create")}
            </button>
          )}
        </div>
      )}

      {bankAccount && !isEditing && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">{bankAccount.bankName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {bankAccount.cardNumber}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {bankAccount.isPrimary && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                  {t("seller.bank.primary")}
                </span>
              )}
              {bankAccount.verified ? (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                  {t("seller.bank.verified")}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  {t("seller.bank.pending")}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.bank.cardHolder")}</span>
              <span className="mt-0.5 block font-medium text-slate-800 dark:text-slate-200">{bankAccount.cardHolder}</span>
            </div>
            {bankAccount.accountNumber && (
              <div>
                <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.bank.accountNumber")}</span>
                <span className="mt-0.5 block font-mono font-medium text-slate-800 dark:text-slate-200">{bankAccount.accountNumber}</span>
              </div>
            )}
            {bankAccount.bankCode && (
              <div>
                <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.bank.bankCode")}</span>
                <span className="mt-0.5 block font-mono font-medium text-slate-800 dark:text-slate-200">{bankAccount.bankCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="cardHolder" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.bank.cardHolder")} *
              </label>
              <input
                id="cardHolder"
                type="text"
                disabled={isInteractionDisabled}
                {...register("cardHolder", { required: t("seller.bank.requiredField") })}
                className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.cardHolder ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.cardHolder && (
                <p className="text-xs text-red-500">{errors.cardHolder.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cardNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.bank.cardNumber")} *
              </label>
              <input
                id="cardNumber"
                type="text"
                disabled={isInteractionDisabled}
                {...register("cardNumber", { required: t("seller.bank.requiredField") })}
                className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.cardNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-500">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bankName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.bank.bankName")} *
              </label>
              <input
                id="bankName"
                type="text"
                disabled={isInteractionDisabled}
                {...register("bankName", { required: t("seller.bank.requiredField") })}
                className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.bankName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.bankName && (
                <p className="text-xs text-red-500">{errors.bankName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bankCode" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.bank.bankCode")}
              </label>
              <input
                id="bankCode"
                type="text"
                disabled={isInteractionDisabled}
                {...register("bankCode")}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="accountNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.bank.accountNumber")}
              </label>
              <input
                id="accountNumber"
                type="text"
                disabled={isInteractionDisabled}
                {...register("accountNumber")}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-900">
            <button
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => {
                clearErrors()
                setIsEditing(false)
              }}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {t("seller.bank.cancel")}
            </button>
            <button
              type="submit"
              disabled={isInteractionDisabled}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isMutationPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t("seller.bank.saving")}
                </span>
              ) : (
                t("seller.bank.save")
              )}
            </button>
          </div>
        </form>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {t("seller.bank.deleteTitle")}
            </h4>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {t("seller.bank.deleteConfirm")}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDialogOpen(false)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {t("seller.bank.cancel")}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-400"
              >
                {isDeleting ? t("seller.bank.deleting") : t("seller.bank.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}