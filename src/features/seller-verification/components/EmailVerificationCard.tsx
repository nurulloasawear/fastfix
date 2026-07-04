import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getEmailVerificationStatus,
  sendVerificationEmail,
  verifyEmailOtp,
} from "../queries/email.queries"
import type {
  EmailVerificationState,
  SendVerificationEmailPayload,
  VerifyEmailOtpPayload,
} from "../types/seller-verification.types"

interface EmailVerificationCardProps {
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

interface EmailFormValues {
  email: string
}

export function EmailVerificationCard({
  disabled = false,
  readOnly = false,
  className = "",
}: EmailVerificationCardProps): React.JSX.Element {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [step, setStep] = React.useState<"email" | "otp">("email")
  const [activeEmail, setActiveEmail] = React.useState<string>("")
  const [countdown, setCountdown] = React.useState<number>(0)
  const otpInputsRef = React.useRef<HTMLInputElement[]>([])

  const {
    data: statusData,
    isLoading: isFetchLoading,
    error: fetchError,
  } = useQuery<EmailVerificationState, Error>({
    queryKey: ["seller", "email", "status"],
    queryFn: getEmailVerificationStatus,
  })

  const {
    mutate: sendEmailMutate,
    isPending: isSending,
    error: sendError,
    reset: resetSendError,
  } = useMutation<void, Error, SendVerificationEmailPayload>({
    mutationFn: sendVerificationEmail,
    onSuccess: (_, variables) => {
      setActiveEmail(variables.email)
      setStep("otp")
      setCountdown(60)
    },
  })

  const {
    mutate: verifyOtpMutate,
    isPending: isVerifying,
    error: verifyError,
    reset: resetVerifyError,
  } = useMutation<{ verified: boolean; message: string }, Error, VerifyEmailOtpPayload>({
    mutationFn: verifyEmailOtp,
    onSuccess: (data) => {
      if (data.verified) {
        queryClient.invalidateQueries({ queryKey: ["seller", "email", "status"] })
        setStep("email")
        resetOtpForm()
      }
    },
  })

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<EmailFormValues>({
    defaultValues: { email: "" },
  })

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    reset: resetOtpForm,
    watch: watchOtp,
  } = useForm<{ otp: string[] }>({
    defaultValues: { otp: Array(6).fill("") },
  })

  const currentOtpArray = watchOtp("otp") || []

  React.useEffect(() => {
    if (statusData?.email) {
      resetEmailForm({ email: statusData.email })
      setActiveEmail(statusData.email)
    }
  }, [statusData, resetEmailForm])

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleEmailFormSubmit = (values: EmailFormValues): void => {
    if (disabled || readOnly || isSending) return
    resetSendError()
    resetVerifyError()
    sendEmailMutate({ email: values.email })
  }

  const handleOtpFormSubmit = (values: { otp: string[] }): void => {
    if (disabled || readOnly || isVerifying) return
    resetVerifyError()
    const codeStr = values.otp.join("")
    if (codeStr.length !== 6) return
    verifyOtpMutate({ email: activeEmail, code: codeStr })
  }

  const handleOtpChange = (
    index: number,
    value: string,
    onChange: (val: string[]) => void
  ): void => {
    const numericVal = value.replace(/\D/g, "").slice(-1)
    const newOtp = [...currentOtpArray]
    newOtp[index] = numericVal
    onChange(newOtp)

    if (numericVal && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    onChange: (val: string[]) => void
  ): void => {
    if (e.key === "Backspace") {
      const newOtp = [...currentOtpArray]
      if (!newOtp[index] && index > 0) {
        newOtp[index - 1] = ""
        onChange(newOtp)
        otpInputsRef.current[index - 1]?.focus()
      } else {
        newOtp[index] = ""
        onChange(newOtp)
      }
    }
  }

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    onChange: (val: string[]) => void
  ): void => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...currentOtpArray]
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i] || ""
    }
    onChange(newOtp)
    const nextFocusIndex = Math.min(pasteData.length, 5)
    otpInputsRef.current[nextFocusIndex]?.focus()
  }

  const handleResend = (): void => {
    if (countdown > 0 || !activeEmail || disabled || readOnly || isSending) return
    resetSendError()
    resetVerifyError()
    sendEmailMutate({ email: activeEmail })
  }

  if (isFetchLoading) {
    return (
      <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-900" />
          <div className="h-10 w-full rounded-lg bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    )
  }

  const activeError = sendError?.message || verifyError?.message || fetchError?.message
  const isVerified = statusData?.verified || false

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t("seller.email.title")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("seller.email.subtitle")}
          </p>
        </div>
        <div>
          {isVerified ? (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
              {t("seller.email.verified")}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              {t("seller.email.pending")}
            </span>
          )}
        </div>
      </div>

      {activeError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400" role="alert">
          <span className="font-semibold">{t("seller.email.errorTitle")}:</span> {activeError}
        </div>
      )}

      {statusData?.verifiedAt && (
        <div className="mb-4 text-xs text-slate-400 dark:text-slate-500">
          {t("seller.email.verifiedAt")}: {statusData.verifiedAt.split("T")[0]}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleEmailSubmit(handleEmailFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="emailInput" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("seller.email.label")}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="emailInput"
                  type="email"
                  disabled={disabled || readOnly || isVerified || isSending}
                  {...registerEmail("email", {
                    required: t("seller.email.required"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("seller.email.invalid"),
                    },
                  })}
                  className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 ${
                    emailErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="example@domain.com"
                />
              </div>
              {!isVerified && !readOnly && (
                <button
                  type="submit"
                  disabled={disabled || isSending}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 flex-shrink-0"
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("seller.email.sending")}
                    </span>
                  ) : (
                    t("seller.email.sendCode")
                  )}
                </button>
              )}
            </div>
            {emailErrors.email && (
              <p className="text-xs text-red-500 mt-1">{emailErrors.email.message}</p>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit(handleOtpFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("seller.email.enterOtp")}
              </label>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("seller.email.changeEmail")}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("seller.email.sentTo")} <span className="font-semibold text-slate-700 dark:text-slate-300">{activeEmail}</span>
            </p>

            <Controller
              name="otp"
              control={otpControl}
              render={({ field: { onChange, value } }) => (
                <div className="flex items-center justify-between gap-2 max-w-xs mx-auto pt-2">
                  {Array(6)
                    .fill(0)
                    .map((_, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          if (el) otpInputsRef.current[idx] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        disabled={disabled || readOnly || isVerifying}
                        value={value[idx] || ""}
                        onChange={(e) => handleOtpChange(idx, e.target.value, onChange)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e, onChange)}
                        onPaste={(e) => handleOtpPaste(e, onChange)}
                        className="w-10 h-12 text-center text-lg font-semibold border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
                      />
                    ))}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {countdown > 0 ? (
                <span>
                  {t("seller.email.resendIn")} <span className="font-mono font-medium">{countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={disabled || readOnly || isSending}
                  onClick={handleResend}
                  className="text-blue-600 font-medium hover:underline disabled:no-underline disabled:opacity-50 dark:text-blue-400"
                >
                  {t("seller.email.resendCode")}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={disabled || isVerifying || currentOtpArray.join("").length !== 6}
              className="w-full sm:w-auto inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t("seller.email.verifying")}
                </span>
              ) : (
                t("seller.email.verify")
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}