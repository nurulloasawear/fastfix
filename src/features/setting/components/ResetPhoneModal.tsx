import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useConfirmPhone, useRequestPhoneCode } from '../api/setting.queries'
import { CheckCircleIcon } from './icons'

// Phone-change flow (request → verify → done) wired to the OTP /account/phone API:
// an OTP is sent to the NEW phone; confirming it updates the account phone.
type Step = 'request' | 'verify' | 'done'
const CODE_LENGTH = 6

interface ResetPhoneModalProps {
  phone: string
  onClose: () => void
}

export function ResetPhoneModal({ phone, onClose }: ResetPhoneModalProps) {
  const { t } = useTranslation()
  const requestCode = useRequestPhoneCode()
  const confirm = useConfirmPhone()
  const [step, setStep] = useState<Step>('request')
  const [nextPhone, setNextPhone] = useState(phone)
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)

  const setDigit = (idx: number, value: string) =>
    setCode((prev) => prev.map((d, i) => (i === idx ? value.slice(-1) : d)))

  function sendCode() {
    setError(null)
    requestCode.mutate(nextPhone, {
      onSuccess: () => setStep('verify'),
      onError: (e) => setError(tError(e instanceof ApiError ? e.code : 'internal_error')),
    })
  }
  function verify() {
    setError(null)
    confirm.mutate({ newPhone: nextPhone, code: code.join('') }, {
      onSuccess: () => setStep('done'),
      onError: (e) => setError(tError(e instanceof ApiError ? e.code : 'internal_error')),
    })
  }

  return (
    <Modal open onClose={onClose} size="sm">
      {step === 'request' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold text-text">{t('setting.account.resetPhone')}</h3>
            <p className="text-sm text-muted">{t('setting.account.resetPhoneDesc')}</p>
          </div>
          <Input
            label={t('setting.account.phoneNumber')}
            value={nextPhone}
            onChange={(e) => setNextPhone(e.target.value)}
            placeholder="+998 ..."
          />
          {error && <p className="text-xs text-error-text">{error}</p>}
          <Button className="w-full" disabled={requestCode.isPending || !nextPhone.trim()} onClick={sendCode}>
            {requestCode.isPending ? t('setting.common.loading') : t('setting.account.resetPhone')}
          </Button>
        </div>
      )}

      {step === 'verify' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold text-text">{t('setting.account.verificationCodeTitle')}</h3>
            <p className="text-sm text-muted">{t('setting.account.verificationCodeDesc')}</p>
            <span className="text-xs font-semibold text-text">{nextPhone}</span>
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
          <h3 className="text-base font-semibold text-text">{t('setting.account.phoneChanged')}</h3>
          <Button className="w-full" onClick={onClose}>
            {t('setting.account.done')}
          </Button>
        </div>
      )}
    </Modal>
  )
}
