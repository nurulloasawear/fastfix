
// PersonalInfoForm.tsx
import * as React from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { User, Phone, Mail, MapPin, Edit2, CheckCircle2, AlertCircle, X, Save, Loader2 } from "lucide-react"
import { useSellerProfile, useUpdateSellerProfile } from "../queries/seller.queries"
import { validateFullName, validatePhone, validateEmail, isRequired } from "../utils/validators"
import { FULL_NAME_MAX_LENGTH, PHONE_MAX_LENGTH, EMAIL_MAX_LENGTH, LEGAL_ADDRESS_MAX_LENGTH } from "../utils/constants"
import type { SellerProfile, SellerProfileUpdate } from "../types/seller-verification.types"

interface PersonalInfoFormProps {
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

export function PersonalInfoForm({
  disabled = false,
  readOnly = false,
  className = "",
}: PersonalInfoFormProps): React.JSX.Element {
  const { t } = useTranslation()
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false)

  const {
    data: profile,
    isLoading: isFetchLoading,
    error: fetchError,
    refetch,
  } = useSellerProfile()

  const {
    mutate: updateProfile,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateSellerProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<Required<SellerProfileUpdate>>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
    },
    mode: "onChange",
  })

  const syncFormValues = React.useCallback((data: SellerProfile | undefined) => {
    if (data) {
      reset({
        fullName: data.fullName || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
      })
    }
  }, [reset])

  React.useEffect(() => {
    syncFormValues(profile)
  }, [profile, syncFormValues])

  const handleCancel = React.useCallback(() => {
    resetUpdateError()
    syncFormValues(profile)
    setIsEditMode(false)
  }, [profile, syncFormValues, resetUpdateError])

  const onSubmit = React.useCallback(
    (values: Required<SellerProfileUpdate>) => {
      if (disabled || readOnly || isUpdating || !isDirty) return
      resetUpdateError()

      const payload: SellerProfileUpdate = {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
      }

      updateProfile(payload, {
        onSuccess: () => {
          setIsEditMode(false)
        },
      })
    },
    [disabled, readOnly, isUpdating, isDirty, updateProfile, resetUpdateError]
  )

  if (isFetchLoading) {
    return (
      <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-900" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="h-10 rounded bg-slate-100 dark:bg-slate-900" />
            <div className="h-10 rounded bg-slate-100 dark:bg-slate-900" />
          </div>
        </div>
      </div>
    )
  }

  const activeError = updateError?.message || fetchError?.message
  const canEdit = !readOnly && !disabled

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-100 pb-4 dark:border-slate-900">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t("seller.profile.title")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("seller.profile.subtitle")}
          </p>
        </div>
        {canEdit && !isEditMode && (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {t("seller.profile.actions.edit")}
          </button>
        )}
      </div>

      {activeError && (
        <div className="mb-6 flex gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">{t("seller.profile.errorTitle")}:</span> {activeError}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-400" />
              {t("seller.profile.fields.fullName")}
            </label>
            {isEditMode ? (
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  maxLength={FULL_NAME_MAX_LENGTH}
                  disabled={disabled || isUpdating}
                  {...register("fullName", {
                    required: t("seller.profile.validation.required"),
                    validate: (val) => validateFullName(val) || t("seller.profile.validation.invalidFullName"),
                  })}
                  className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${
                    errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-500 font-medium mt-1">{errors.fullName.message}</p>}
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 min-h-10 flex items-center">
                {profile?.fullName || t("seller.profile.placeholders.noData")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-slate-400" />
              {t("seller.profile.fields.phone")}
            </label>
            {isEditMode ? (
              <div className="relative">
                <input
                  id="phone"
                  type="text"
                  maxLength={PHONE_MAX_LENGTH}
                  disabled={disabled || isUpdating}
                  {...register("phone", {
                    required: t("seller.profile.validation.required"),
                    validate: (val) => validatePhone(val) || t("seller.profile.validation.invalidPhone"),
                  })}
                  className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${
                    errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="+998901234567"
                />
                {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone.message}</p>}
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 min-h-10 flex items-center">
                {profile?.phone || t("seller.profile.placeholders.noData")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-slate-400" />
              {t("seller.profile.fields.email")}
            </label>
            {isEditMode ? (
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  maxLength={EMAIL_MAX_LENGTH}
                  disabled={disabled || isUpdating}
                  {...register("email", {
                    required: t("seller.profile.validation.required"),
                    validate: (val) => validateEmail(val) || t("seller.profile.validation.invalidEmail"),
                  })}
                  className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>}
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 min-h-10 flex items-center">
                {profile?.email || t("seller.profile.placeholders.noData")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              {t("seller.profile.fields.address")}
            </label>
            {isEditMode ? (
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  maxLength={LEGAL_ADDRESS_MAX_LENGTH}
                  disabled={disabled || isUpdating}
                  {...register("address", {
                    required: t("seller.profile.validation.required"),
                    validate: (val) => isRequired(val) || t("seller.profile.validation.required"),
                  })}
                  className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${
                    errors.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.address && <p className="text-xs text-red-500 font-medium mt-1">{errors.address.message}</p>}
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 min-h-10 flex items-center">
                {profile?.address || t("seller.profile.placeholders.noData")}
              </p>
            )}
          </div>
        </div>

        {isEditMode && (
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-900">
            <button
              type="button"
              onClick={handleCancel}
              disabled={disabled || isUpdating}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <X className="h-4 w-4 mr-2" />
              {t("seller.profile.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={disabled || isUpdating || !isDirty || !isValid}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("seller.profile.actions.updating")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t("seller.profile.actions.save")}
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}