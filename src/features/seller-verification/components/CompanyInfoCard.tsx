// CompanyInfoCard.tsx
import * as React from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  useCompany,
  useRefreshCompany,
} from "../queries/company.queries"
import type {
  SellerCompany,
  SaveCompanyPayload,
  UpdateCompanyPayload,
} from "../types/seller-verification.types"

// Not: company.queries.ts faylida mutation hooklarining aniq nomlari mutatsiyalar
// sifatida belgilangan yoki custom useMutation orqali implement qilingan. Loyiha arxitekturasiga ko'ra
// tanlangan React Query standart mutatsiyalarini va useCompany hooklarini import qilamiz.
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { saveCompany, updateCompany, deleteCompany } from "../api/company.api"
import { sellerKeys } from "../queries/seller.query-keys"

interface CompanyInfoCardProps {
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

export function CompanyInfoCard({
  disabled = false,
  readOnly = false,
  className = "",
}: CompanyInfoCardProps): React.JSX.Element {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const refreshCompany = useRefreshCompany()
  
  const [isEditing, setIsEditing] = React.useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false)

  const {
    data: company,
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useCompany()

  const {
    mutate: createCompanyMutate,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useMutation({
    mutationFn: saveCompany,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.company() })
      qc.invalidateQueries({ queryKey: sellerKeys.status() })
      setIsEditing(false)
    },
  })

  const {
    mutate: updateCompanyMutate,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.company() })
      setIsEditing(false)
    },
  })

  const {
    mutate: deleteCompanyMutate,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDeleteError,
  } = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      qc.removeQueries({ queryKey: sellerKeys.company() })
      qc.invalidateQueries({ queryKey: sellerKeys.status() })
      setIsDialogOpen(false)
      setIsEditing(false)
    },
  })

  const isMutationPending = isCreating || isUpdating || isDeleting
  const isInteractionDisabled = disabled || readOnly || isMutationPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaveCompanyPayload>()

  React.useEffect(() => {
    if (company) {
      reset({
        companyName: company.companyName,
        directorName: company.directorName,
        inn: company.inn,
        registrationNumber: company.registrationNumber,
        legalAddress: company.legalAddress,
        businessType: company.businessType,
      })
    } else {
      reset({
        companyName: "",
        directorName: "",
        inn: "",
        registrationNumber: "",
        legalAddress: "",
        businessType: "",
      })
    }
  }, [company, reset])

  const clearErrors = (): void => {
    resetCreateError()
    resetUpdateError()
    resetDeleteError()
  }

  const onSubmit = (data: SaveCompanyPayload): void => {
    if (isInteractionDisabled) return
    clearErrors()

    if (company) {
      const updatePayload: UpdateCompanyPayload = {
        companyName: data.companyName,
        directorName: data.directorName,
        inn: data.inn,
        registrationNumber: data.registrationNumber,
        legalAddress: data.legalAddress,
        businessType: data.businessType,
      }
      updateCompanyMutate(updatePayload)
    } else {
      createCompanyMutate(data)
    }
  }

  const confirmDelete = (): void => {
    if (isInteractionDisabled) return
    clearErrors()
    deleteCompanyMutate()
  }

  if (isFetchLoading) {
    return (
      <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-900" />
          <div className="h-40 w-full rounded-lg bg-slate-100 dark:bg-slate-900" />
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
            {t("seller.company.title")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("seller.company.subtitle")}
          </p>
        </div>
        {company && !readOnly && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => setIsEditing(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {t("seller.company.edit")}
            </button>
            <button
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              {t("seller.company.delete")}
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
              <span className="font-semibold">{t("seller.company.errorTitle")}:</span> {combinedError}
            </div>
          </div>
        </div>
      )}

      {!company && !isEditing && !isFetchError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/20">
          <svg className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v16.5m16.5-16.5v16.5m-13.5-13.5h10.5M6.75 12h10.5m-10.5 3.75h10.5m-10.5 3.75h10.5M12 3v18" />
          </svg>
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">{t("seller.company.emptyTitle")}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
            {t("seller.company.emptyDesc")}
          </p>
          {!readOnly && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsEditing(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {t("seller.company.create")}
            </button>
          )}
        </div>
      )}

      {company && !isEditing && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">{company.companyName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("seller.company.businessType")}: {company.businessType}
                </p>
              </div>
            </div>
            <div>
              {company.verified ? (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                  {t("seller.company.verified")}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  {t("seller.company.pending")}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.company.directorName")}</span>
              <span className="mt-0.5 block font-medium text-slate-800 dark:text-slate-200">{company.directorName}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.company.inn")}</span>
              <span className="mt-0.5 block font-mono font-medium text-slate-800 dark:text-slate-200">{company.inn}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.company.registrationNumber")}</span>
              <span className="mt-0.5 block font-mono font-medium text-slate-800 dark:text-slate-200">{company.registrationNumber}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("seller.company.legalAddress")}</span>
              <span className="mt-0.5 block font-medium text-slate-800 dark:text-slate-200">{company.legalAddress}</span>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="companyName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.company.companyName")} *
              </label>
              <input
                id="companyName"
                type="text"
                disabled={isInteractionDisabled}
                {...register("companyName", { required: t("seller.company.requiredField") })}
                className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.companyName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.companyName && (
                <p className="text-xs text-red-500">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="directorName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.company.directorName")} *
              </label>
              <input
                id="directorName"
                type="text"
                disabled={isInteractionDisabled}
                {...register("directorName", { required: t("seller.company.requiredField") })}
                className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.directorName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.directorName && (
                <p className="text-xs text-red-500">{errors.directorName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="inn" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.company.inn")} *
              </label>
              <input
                id="inn"
                type="text"
                disabled={isInteractionDisabled}
                {...register("inn", { 
                  required: t("seller.company.requiredField"),
                  pattern: { value: /^\d{9}$/, message: t("seller.company.invalidInn") } 
                })}
                className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.inn ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.inn && (
                <p className="text-xs text-red-500">{errors.inn.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="registrationNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.company.registrationNumber")} *
              </label>
              <input
                id="registrationNumber"
                type="text"
                disabled={isInteractionDisabled}
                {...register("registrationNumber", { required: t("seller.company.requiredField") })}
                className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.registrationNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.registrationNumber && (
                <p className="text-xs text-red-500">{errors.registrationNumber.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="businessType" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.company.businessType")} *
              </label>
              <select
                id="businessType"
                disabled={isInteractionDisabled}
                {...register("businessType", { required: t("seller.company.requiredField") })}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
              >
                <option value="LLC">LLC (MCHJ)</option>
                <option value="IE">IE (YATT)</option>
                <option value="JSC">JSC (AJ)</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="legalAddress" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.company.legalAddress")} *
              </label>
              <textarea
                id="legalAddress"
                disabled={isInteractionDisabled}
                {...register("legalAddress", { required: t("seller.company.requiredField") })}
                className={`flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${errors.legalAddress ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.legalAddress && (
                <p className="text-xs text-red-500">{errors.legalAddress.message}</p>
              )}
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
              {t("seller.company.cancel")}
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
                  {t("seller.company.saving")}
                </span>
              ) : (
                t("seller.company.save")
              )}
            </button>
          </div>
        </form>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {t("seller.company.deleteTitle")}
            </h4>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {t("seller.company.deleteConfirm")}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDialogOpen(false)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {t("seller.company.cancel")}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-400"
              >
                {isDeleting ? t("seller.company.deleting") : t("seller.company.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}