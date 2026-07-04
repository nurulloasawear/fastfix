import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useConfirmEmail, useRequestEmailCode } from '../api/setting.queries'
import { CheckCircleIcon } from './icons'

// Email-change flow wired to the OTP /account/email API: a code is sent to the
// account's CURRENT phone (authorizes the change); confirming it sets the email.
type Step = 'request' | 'verify' | 'done'
const CODE_LENGTH = 6

interface EmailModalProps {
  currentEmail: string
  onClose: () => void
}

export function EmailModal({ currentEmail, onClose }: EmailModalProps) {
  const { t } = useTranslation()
  const requestCode = useRequestEmailCode()
  const confirm = useConfirmEmail()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState(currentEmail)
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)

  const setDigit = (idx: number, value: string) =>
    setCode((prev) => prev.map((d, i) => (i === idx ? value.slice(-1) : d)))

  function sendCode() {
    setError(null)
    requestCode.mutate(email.trim(), {
      onSuccess: () => setStep('verify'),
      onError: (e) => setError(tError(e instanceof ApiError ? e.code : 'internal_error')),
    })
  }
  function verify() {
    setError(null)
    confirm.mutate({ email: email.trim(), code: code.join('') }, {
      onSuccess: () => setStep('done'),
      onError: (e) => setError(tError(e instanceof ApiError ? e.code : 'internal_error')),
    })
  }

  return (
    <Modal open onClose={onClose} size="sm">
      {step === 'request' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold text-text">{t('setting.account.changeEmail', { defaultValue: 'Email oʻzgartirish' })}</h3>
            <p className="text-sm text-muted">{t('setting.account.changeEmailDesc', { defaultValue: 'Tasdiqlash kodi telefon raqamingizga yuboriladi.' })}</p>
          </div>
          <Input
            label={t('setting.accountInfo.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {error && <p className="text-xs text-error-text">{error}</p>}
          <Button className="w-full" disabled={requestCode.isPending || !email.includes('@')} onClick={sendCode}>
            {requestCode.isPending ? t('setting.common.loading') : t('setting.account.sendCode', { defaultValue: 'Kod yuborish' })}
          </Button>
        </div>
      )}

      {step === 'verify' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold text-text">{t('setting.account.verificationCodeTitle')}</h3>
            <p className="text-sm text-muted">{t('setting.account.verificationCodeDesc')}</p>
          </div>
          <div className="flex justify-between gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                value={digit}
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => setDigit(idx, e.target.value)}
                className="h-11 w-11 rounded-lg border border-border-strong bg-surface text-center text-sm text-text outline-none transition focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
              />
            ))}
          </div>
          {error && <p className="text-xs text-error-text">{error}</p>}
          <div className="flex flex-col gap-2">
            <Button className="w-full" disabled={confirm.isPending || code.join('').length < CODE_LENGTH} onClick={verify}>
              {confirm.isPending ? t('setting.common.loading') : t('setting.account.confirm')}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-muted hover:text-text" disabled={requestCode.isPending} onClick={sendCode}>
              {t('setting.account.resend')}
            </Button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success">
            <CheckCircleIcon size={32} />
          </span>
          <h3 className="text-base font-semibold text-text">{t('setting.account.emailChanged', { defaultValue: 'Email yangilandi' })}</h3>
          <Button className="w-full" onClick={onClose}>{t('setting.account.done')}</Button>
        </div>
      )}
    </Modal>
  )
}
