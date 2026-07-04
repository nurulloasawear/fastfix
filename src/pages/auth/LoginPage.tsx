import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth, useRequestOtp, useVerifyOtp } from '@/features/auth'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const requestOtp = useRequestOtp()
  const verifyOtp = useVerifyOtp()

  if (token) return <Navigate to="/seller/verification" replace />

  const fail = (e: unknown) => setError(tError(e instanceof ApiError ? e.code : 'internal_error'))

  function onPhone(e: FormEvent) {
    e.preventDefault()
    setError(null)
    requestOtp.mutate(phone.trim(), { onSuccess: () => setStep('otp'), onError: fail })
  }
  function onOtp(e: FormEvent) {
    e.preventDefault()
    setError(null)
    verifyOtp.mutate({ phone: phone.trim(), code: code.trim() }, {
      onSuccess: () => navigate('/seller/verification', { replace: true }),
      onError: fail,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">OZB</span>
          <span className="text-lg font-semibold text-text">{t('auth.brand')}</span>
        </div>

        {step === 'phone' ? (
          <form onSubmit={onPhone} className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-semibold text-text">{t('auth.loginTitle')}</h1>
              <p className="mt-1 text-sm text-muted">{t('auth.loginSubtitle')}</p>
            </div>
            <Input
              label={t('auth.phone')}
              inputMode="tel"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
            />
            {error && <p className="text-xs text-error-text">{error}</p>}
            <Button type="submit" disabled={!phone.trim() || requestOtp.isPending}>
              {requestOtp.isPending ? t('auth.sending') : t('auth.sendCode')}
            </Button>
          </form>
        ) : (
          <form onSubmit={onOtp} className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-semibold text-text">{t('auth.otpTitle')}</h1>
              <p className="mt-1 text-sm text-muted">{t('auth.otpSubtitle', { phone: phone.trim() })}</p>
            </div>
            <Input
              label={t('auth.code')}
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            {import.meta.env.DEV && <p className="text-xs text-muted">{t('auth.devHint')}</p>}
            {error && <p className="text-xs text-error-text">{error}</p>}
            <Button type="submit" disabled={code.trim().length < 4 || verifyOtp.isPending}>
              {verifyOtp.isPending ? t('auth.verifying') : t('auth.verify')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setStep('phone'); setError(null) }}>
              {t('auth.changePhone')}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
