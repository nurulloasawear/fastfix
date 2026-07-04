import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Image } from '@/components/ui/Image'
import { useToast } from '@/components/ui/Toast'
import { tError, LANGUAGES, type Language } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { uploadMediaUrl } from '../api/setting.api'
import { useAccount, useUpdateAccount } from '../api/setting.queries'

// Edit the USER profile only — avatar, full name, username, language (PUT /me).
// The SHOP entity (name/logo) is edited separately in ShopProfileModal — a user and a
// shop are distinct: a user can belong to many shops; a shop has many users.
interface ProfileEditModalProps {
  onClose: () => void
}

export function ProfileEditModal({ onClose }: ProfileEditModalProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: account } = useAccount()
  const updateAccount = useUpdateAccount()
  const fileRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState(account?.fullName ?? '')
  const [username, setUsername] = useState(account?.username ?? '')
  const [language, setLanguage] = useState<Language>((account?.language ?? 'uz') as Language)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(account?.avatarUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const { uploadUrl, publicUrl } = await uploadMediaUrl(file.type, 'avatar')
      const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      if (!res.ok) throw new Error('upload_failed')
      setAvatarUrl(publicUrl)
    } catch {
      setError(t('setting.account.uploadFailed', { defaultValue: 'Rasm yuklanmadi' }))
    } finally {
      setUploading(false)
    }
  }

  async function onSave() {
    if (!account) return
    setError(null)
    try {
      await updateAccount.mutateAsync({
        fullName, username, language, avatarUrl,
        email: account.email, shopName: account.shopName, gender: account.gender, dateOfBirth: account.dateOfBirth,
      })
      toast.success(t('setting.account.profileSaved', { defaultValue: 'Profil saqlandi' }))
      onClose()
    } catch (e) {
      setError(tError(e instanceof ApiError ? e.code : 'internal_error'))
    }
  }

  const busy = updateAccount.isPending || uploading

  return (
    <Modal
      open
      onClose={onClose}
      title={t('setting.accountInfo.myProfile')}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t('setting.common.cancel')}</Button>
          <Button disabled={busy} onClick={onSave}>
            {busy ? t('setting.common.loading') : t('setting.common.save')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Image src={avatarUrl ?? undefined} className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border" alt="avatar" />
          <div className="flex flex-col gap-1">
            <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? t('setting.common.loading') : t('setting.account.changePhoto', { defaultValue: 'Rasmni oʻzgartirish' })}
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
          </div>
        </div>

        <Input label={t('setting.account.fullName', { defaultValue: 'Toʻliq ism' })} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label={t('setting.account.username', { defaultValue: 'Foydalanuvchi nomi' })} value={username} onChange={(e) => setUsername(e.target.value)} />
        <Select label={t('setting.account.language', { defaultValue: 'Til' })} value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </Select>

        {error && <p className="text-xs text-error-text">{error}</p>}
      </div>
    </Modal>
  )
}
