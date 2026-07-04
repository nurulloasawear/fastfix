import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Image } from '@/components/ui/Image'
import { useToast } from '@/components/ui/Toast'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { uploadMediaUrl } from '../api/setting.api'
import { useSeller, useUpdateShop } from '../api/setting.queries'

// Edit the SHOP entity (name + logo) — distinct from the user profile. Backed by
// PUT /sellers/me. A shop is its own entity with many members; this edits the shop,
// not the person.
interface ShopProfileModalProps {
  onClose: () => void
}

export function ShopProfileModal({ onClose }: ShopProfileModalProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: seller } = useSeller()
  const updateShop = useUpdateShop()
  const fileRef = useRef<HTMLInputElement>(null)

  const [shopName, setShopName] = useState(seller?.shopName ?? '')
  const [logoUrl, setLogoUrl] = useState<string | null>(seller?.logoUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const { uploadUrl, publicUrl } = await uploadMediaUrl(file.type, 'avatar')
      const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      if (!res.ok) throw new Error('upload_failed')
      setLogoUrl(publicUrl)
    } catch {
      setError(t('setting.account.uploadFailed', { defaultValue: 'Rasm yuklanmadi' }))
    } finally {
      setUploading(false)
    }
  }

  function onSave() {
    if (!shopName.trim()) {
      setError(t('setting.shop.nameRequired', { defaultValue: 'Doʻkon nomi kerak' }))
      return
    }
    setError(null)
    updateShop.mutate(
      { shopName: shopName.trim(), logoUrl: logoUrl ?? undefined },
      {
        onSuccess: () => {
          toast.success(t('setting.shop.saved', { defaultValue: 'Doʻkon saqlandi' }))
          onClose()
        },
        onError: (e) => setError(tError(e instanceof ApiError ? e.code : 'internal_error')),
      },
    )
  }

  const busy = updateShop.isPending || uploading

  return (
    <Modal
      open
      onClose={onClose}
      title={t('setting.shop.editTitle', { defaultValue: 'Doʻkon profili' })}
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
        {/* Shop logo */}
        <div className="flex items-center gap-4">
          <Image src={logoUrl ?? undefined} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border" alt="shop logo" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted">{t('setting.shop.logo', { defaultValue: 'Doʻkon rasmi' })}</span>
            <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? t('setting.common.loading') : t('setting.account.changePhoto', { defaultValue: 'Rasmni oʻzgartirish' })}
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickLogo} />
          </div>
        </div>

        <Input
          label={t('setting.account.shopName', { defaultValue: 'Doʻkon nomi' })}
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />

        {error && <p className="text-xs text-error-text">{error}</p>}
      </div>
    </Modal>
  )
}
