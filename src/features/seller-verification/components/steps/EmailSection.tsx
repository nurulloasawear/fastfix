import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import {
  useEmailVerification,
  useSellerProfile,
  useSendEmailOtp,
  useVerifyEmailOtp,
} from '../../api/seller-verification.queries'
import { OTP_LENGTH, OTP_RESEND_SECONDS } from '../../lib/constants'
import { validateEmail, validateRequired } from '../../lib/validators'
import type { EmailVerification } from '../../types/seller-verification.types'
import { StatusBadge } from '../StatusBadge'

const K = 'sellerVerification.emailVerify'

export function EmailSection() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useEmailVerification()
  const profileQuery = useSellerProfile()

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text">{t(`${K}.heading`)}</h2>
          <p className="mt-1 text-sm text-muted">{t(`${K}.description`)}</p>
        </div>
        <StatusBadge status={data?.status ?? 'idle'} />
      </div>

      {isLoading || profileQuery.isLoading ? (
        <CardSkeleton lines={3} />
      ) : isError || !data ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-error-text">{t('sellerVerification.loadFailed')}</span>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>{t('sellerVerification.retry')}</Button>
        </div>
      ) : (
        /* key: re-capture the form's default email after the profile saves —
           the merged step promises the user never retypes their address. */
        <EmailContent
          key={profileQuery.data?.email ?? ''}
          verification={data}
          profileEmail={profileQuery.data?.email ?? ''}
        />
      )}
    </section>
  )
}

function EmailContent(props: { verification: EmailVerification; profileEmail: string }) {
  const { verification, profileEmail } = props
  const { t } = useTranslation()
  const sendOtp = useSendEmailOtp()
  const verifyOtp = useVerifyEmailOtp()
  const [changingEmail, setChangingEmail] = useState(false)
  // Resend gate is a deadline timestamp (set in event handlers, never in an
  // effect); the interval only advances the clock the countdown derives from.
  const [deadline, setDeadline] = useState(() =>
    verification.status === 'otp_sent' ? Date.now() + OTP_RESEND_SECONDS * 1000 : 0,
  )
  const [now, setNow] = useState(() => Date.now())
  const sendForm = useForm<{ email: string }>({ defaultValues: { email: verification.email || profileEmail } })
  const otpForm = useForm<{ code: string }>({ defaultValues: { code: '' } })
  const showOtp = verification.status === 'otp_sent' && !changingEmail

  useEffect(() => {
    if (!showOtp) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [showOtp])

  const secondsLeft = Math.max(0, Math.ceil((deadline - now) / 1000))

  if (verification.status === 'verified') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-success-bg p-4">
        <span className="text-sm font-medium text-text">{verification.email}</span>
        <span className="text-sm font-semibold text-success">{t(`${K}.verified`)}</span>
      </div>
    )
  }

  const send = (email: string) =>
    sendOtp.mutate(email, {
      onSuccess: () => {
        setChangingEmail(false)
        otpForm.reset()
        setDeadline(Date.now() + OTP_RESEND_SECONDS * 1000)
        setNow(Date.now())
      },
    })
  const sendError = sendOtp.error && (
    <p className="text-sm text-error-text">
      {sendOtp.error instanceof ApiError ? tError(sendOtp.error.code) : t('sellerVerification.common.error')}
    </p>
  )

  if (!showOtp) {
    const emailError = sendForm.formState.errors.email?.message
    const onSend = sendForm.handleSubmit(({ email }) => send(email.trim()))
    return (
      <form onSubmit={onSend} className="max-w-md space-y-4" noValidate>
        <Input
          label={t(`${K}.emailLabel`)} type="email" error={emailError ? t(emailError) : undefined}
          {...sendForm.register('email', { validate: (v) => validateEmail(v) ?? true })}
        />
        {sendError}
        <Button type="submit" disabled={sendOtp.isPending}>
          {t(sendOtp.isPending ? `${K}.sending` : `${K}.sendCode`)}
        </Button>
      </form>
    )
  }

  const codeError = otpForm.formState.errors.code?.message
  const onVerify = otpForm.handleSubmit(({ code }) =>
    verifyOtp.mutate({ email: verification.email, code: code.trim() }),
  )
  return (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-text-secondary">
        {t(`${K}.otpSentTo`)} <span className="font-medium text-text">{verification.email}</span>
      </p>
      <form onSubmit={onVerify} className="space-y-4" noValidate>
        <Input
          label={t(`${K}.otpLabel`)} inputMode="numeric" maxLength={OTP_LENGTH}
          autoComplete="one-time-code" className="text-center tracking-widest"
          error={codeError ? t(codeError) : undefined}
          {...otpForm.register('code', { validate: (v) => validateRequired(v) ?? true })}
        />
        {verifyOtp.isError && <p className="text-sm text-error-text">{t(`${K}.invalidCode`)}</p>}
        <Button type="submit" disabled={verifyOtp.isPending}>
          {t(verifyOtp.isPending ? `${K}.verifying` : `${K}.verify`)}
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {secondsLeft > 0 ? (
          <span className="text-muted">{t(`${K}.resendIn`, { seconds: secondsLeft })}</span>
        ) : (
          <button type="button" disabled={sendOtp.isPending} onClick={() => send(verification.email)}
            className="font-semibold text-brand hover:underline disabled:opacity-50">
            {t(`${K}.resendCode`)}
          </button>
        )}
        <button type="button" onClick={() => setChangingEmail(true)}
          className="font-semibold text-text-secondary hover:underline">
          {t(`${K}.changeEmail`)}
        </button>
      </div>
      {sendError}
    </div>
  )
}
