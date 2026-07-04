import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useChangePassword } from '../api/setting.queries'
import type { PasswordChangeInput } from '../types/setting.types'

const EMPTY: PasswordChangeInput = { currentPassword: '', newPassword: '', confirmPassword: '' }

type Notice = { kind: 'error' | 'ok'; text: string }

export function PasswordForm() {
  const { t } = useTranslation()
  const change = useChangePassword()
  const [form, setForm] = useState<PasswordChangeInput>(EMPTY)
  const [notice, setNotice] = useState<Notice | null>(null)

  const set = <K extends keyof PasswordChangeInput>(key: K, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onReset = () => { setForm(EMPTY); setNotice(null) }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setNotice(null)
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setNotice({ kind: 'error', text: t('setting.security.fillAllFields') })
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setNotice({ kind: 'error', text: t('setting.security.passwordsMismatch') })
      return
    }
    change.mutate(form, {
      onSuccess: () => {
        setForm(EMPTY)
        setNotice({ kind: 'ok', text: t('setting.security.passwordUpdated') })
      },
      onError: (err) =>
        setNotice({ kind: 'error', text: tError(err instanceof ApiError ? err.code : 'internal_error') }),
    })
  }

  const fields: { key: keyof PasswordChangeInput; label: string }[] = [
    { key: 'currentPassword', label: t('setting.security.currentPassword') },
    { key: 'newPassword', label: t('setting.security.newPassword') },
    { key: 'confirmPassword', label: t('setting.security.confirmPassword') },
  ]

  return (
    <Card className="flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-text">{t('setting.security.updatePassword')}</h2>
      </div>
      <form id="password-form" onSubmit={onSubmit} className="flex flex-col gap-4 px-6 py-5">
        {fields.map((f) => (
          <Input
            key={f.key}
            type="password"
            label={f.label}
            placeholder={t('setting.security.passwordPlaceholder')}
            value={form[f.key]}
            onChange={(e) => set(f.key, e.target.value)}
          />
        ))}
        {notice && (
          <p className={`text-xs ${notice.kind === 'ok' ? 'text-success' : 'text-error-text'}`}>{notice.text}</p>
        )}
      </form>
      <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Button variant="outline" type="button" onClick={onReset}>
          {t('setting.common.cancel')}
        </Button>
        <Button type="submit" form="password-form" disabled={change.isPending}>
          {change.isPending ? t('setting.common.loading') : t('setting.security.updatePassword')}
        </Button>
      </div>
    </Card>
  )
}
