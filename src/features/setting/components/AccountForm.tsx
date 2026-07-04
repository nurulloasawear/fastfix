import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { LANGUAGES, tError } from '@/i18n'
import type { Language } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useAccount, useUpdateAccount } from '../api/setting.queries'
import { GENDERS } from '../types/setting.types'
import type { Account, AccountUpdate, Gender } from '../types/setting.types'
import { EditIcon, ImageIcon } from './icons'
import { ResetPhoneModal } from './ResetPhoneModal'

function toDraft(a: Account): AccountUpdate {
  return {
    fullName: a.fullName,
    username: a.username,
    email: a.email,
    shopName: a.shopName,
    language: a.language,
    avatarUrl: a.avatarUrl,
    gender: a.gender,
    dateOfBirth: a.dateOfBirth,
  }
}

export function AccountForm() {
  const { data: account, isLoading } = useAccount()

  if (isLoading || !account) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }
  // Key on identity so the draft re-initialises from scratch if the account changes.
  return <AccountFormInner account={account} key={account.phone} />
}

function AccountFormInner({ account }: { account: Account }) {
  const { t } = useTranslation()
  const update = useUpdateAccount()

  const [draft, setDraft] = useState<AccountUpdate>(() => toDraft(account))
  const [error, setError] = useState<string | null>(null)
  const [phoneModalOpen, setPhoneModalOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof AccountUpdate>(key: K, value: AccountUpdate[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  const onAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) set('avatarUrl', URL.createObjectURL(file))
  }

  const onSave = () => {
    setError(null)
    update.mutate(draft, {
      onError: (err) => setError(tError(err instanceof ApiError ? err.code : 'internal_error')),
    })
  }

  return (
    <Card className="flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-text">{t('setting.account.cardTitle')}</h2>
        <p className="mt-0.5 text-sm text-muted">{t('setting.account.cardSubtitle')}</p>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatar} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-square w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-bg text-muted transition-colors hover:border-brand"
          >
            {draft.avatarUrl ? (
              <img src={draft.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <>
                <ImageIcon size={28} />
                <span className="px-4 text-center text-xs">{t('setting.account.dragDropAvatar')}</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label={t('setting.account.username')}
            value={draft.username}
            onChange={(e) => set('username', e.target.value)}
            trailing={<EditIcon size={14} className="text-muted" />}
          />
          <Input label={t('setting.account.name')} value={draft.fullName} disabled readOnly />
          <Input
            label={t('setting.account.email')}
            type="email"
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
            trailing={<EditIcon size={14} className="text-muted" />}
          />

          <div className="flex items-end gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-sm font-semibold text-text-secondary">{t('setting.account.phoneNumber')}</span>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text">
                {account.phone}
                <span
                  className={`ml-auto inline-flex items-center gap-1 text-xs ${account.phoneVerified ? 'text-success' : 'text-muted'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${account.phoneVerified ? 'bg-success' : 'bg-muted'}`} />
                  {account.phoneVerified ? t('setting.account.verified') : t('setting.account.notVerified')}
                </span>
              </div>
            </div>
            <Button variant="outline" className="inline-flex items-center gap-1.5" onClick={() => setPhoneModalOpen(true)}>
              <EditIcon size={14} />
              {t('setting.common.edit')}
            </Button>
          </div>

          <Input
            label={t('setting.account.shopName')}
            value={draft.shopName}
            onChange={(e) => set('shopName', e.target.value)}
            trailing={<EditIcon size={14} className="text-muted" />}
          />

          <Select
            label={t('setting.account.language')}
            value={draft.language}
            onChange={(e) => set('language', e.target.value as Language)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-secondary">{t('setting.account.gender')}</span>
            <div className="flex flex-wrap gap-4">
              {GENDERS.map((g) => (
                <label key={g} className="flex cursor-pointer items-center gap-2 text-sm text-text">
                  <input
                    type="radio"
                    name="gender"
                    checked={draft.gender === g}
                    onChange={() => set('gender', g as Gender)}
                    className="h-4 w-4 accent-brand"
                  />
                  {t(`setting.account.${g}`)}
                </label>
              ))}
            </div>
          </div>

          <div className="w-48">
            <Input
              type="date"
              label={t('setting.account.dateOfBirth')}
              value={draft.dateOfBirth}
              onChange={(e) => set('dateOfBirth', e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-error-text">{error}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Button variant="outline" onClick={() => account && setDraft(toDraft(account))}>
          {t('setting.common.cancel')}
        </Button>
        <Button disabled={update.isPending} onClick={onSave}>
          {update.isPending ? t('setting.common.loading') : t('setting.common.save')}
        </Button>
      </div>

      {phoneModalOpen && <ResetPhoneModal phone={account.phone} onClose={() => setPhoneModalOpen(false)} />}
    </Card>
  )
}
