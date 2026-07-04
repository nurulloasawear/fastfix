// Basic Information panel for Shop Info page — view + edit states.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import type { MultiLang, ShopInfoProfile } from '../types/shop.types'

type Props = {
  profile: ShopInfoProfile
  onSave: (payload: { name: string; logoUrl: string | null; description: MultiLang }) => void
  isSaving: boolean
}

function LangTabs({
  active,
  onChange,
}: {
  active: keyof MultiLang
  onChange: (l: keyof MultiLang) => void
}) {
  const langs: Array<keyof MultiLang> = ['uz', 'ru', 'en']
  return (
    <div className="flex gap-1 rounded-lg border border-border-strong bg-bg p-1">
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
            active === l
              ? 'bg-surface text-text shadow-xs'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export function ShopInfoBasicPanel({ profile, onSave, isSaving }: Props) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [description, setDescription] = useState<MultiLang>({ ...profile.description })
  const [descLang, setDescLang] = useState<keyof MultiLang>('uz')

  function handleSave() {
    onSave({ name, logoUrl: profile.logoUrl, description })
    setEditing(false)
  }

  function handleCancel() {
    setName(profile.name)
    setDescription({ ...profile.description })
    setEditing(false)
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">
          {t('shop.shopInfo.basicTab')}
        </h2>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            {t('shop.shopInfo.edit')}
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {/* Shop Name */}
        <div className="flex items-start gap-4">
          <span className="w-40 shrink-0 pt-2 text-sm text-text-secondary">
            {t('shop.shopInfo.shopName')}
          </span>
          {editing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
          ) : (
            <span className="text-sm font-medium text-text">{profile.name}</span>
          )}
        </div>

        {/* Shop Logo */}
        <div className="flex items-start gap-4">
          <span className="w-40 shrink-0 pt-2 text-sm text-text-secondary">
            {t('shop.shopInfo.shopLogo')}
          </span>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-bg text-xs text-muted">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt="logo"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <LogoPlaceholderIcon />
              )}
            </div>
            <div className="text-xs text-muted leading-relaxed">
              <p>• {t('shop.shopInfo.logoHint')}</p>
            </div>
          </div>
        </div>

        {/* Shop Description */}
        <div className="flex items-start gap-4">
          <span className="w-40 shrink-0 pt-2 text-sm text-text-secondary">
            {t('shop.shopInfo.shopDescription')}
          </span>
          {editing ? (
            <div className="flex flex-1 flex-col gap-2">
              <LangTabs active={descLang} onChange={setDescLang} />
              <Textarea
                value={description[descLang]}
                onChange={(e) =>
                  setDescription((prev) => ({ ...prev, [descLang]: e.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>
          ) : (
            <span className="text-sm text-text">{profile.description.uz}</span>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            {t('shop.shopInfo.cancel')}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                {t('shop.shopInfo.saving')}
              </span>
            ) : (
              t('shop.shopInfo.save')
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}

function LogoPlaceholderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-muted" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
