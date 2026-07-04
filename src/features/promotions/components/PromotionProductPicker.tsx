import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useProducts } from '@/features/products'

export interface PickedProduct {
  id: string
  name: string
  image: string
  price: number
  hasVariants: boolean
}

export function PromotionProductPicker({ open, existingIds, onClose, onConfirm }: {
  open: boolean
  existingIds: string[]
  onClose: () => void
  onConfirm: (products: PickedProduct[]) => void
}) {
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Record<string, PickedProduct>>({})
  const { data, isLoading } = useProducts({ status: 'live', q, page: 1, limit: 30 })
  const products = data?.products ?? []

  function toggle(p: PickedProduct) {
    setSel((s) => {
      const n = { ...s }
      if (n[p.id]) delete n[p.id]
      else n[p.id] = p
      return n
    })
  }
  function confirm() {
    onConfirm(Object.values(sel))
    setSel({})
    onClose()
  }

  const count = Object.keys(sel).length
  return (
    <Modal open={open} onClose={onClose} title={t('promotions.pickTitle')} size="lg"
      footer={<>
        <Button variant="outline" onClick={onClose}>{t('promotions.cancel')}</Button>
        <Button disabled={count === 0} onClick={confirm}>{t('promotions.pickAdd')}{count > 0 ? ` (${count})` : ''}</Button>
      </>}>
      <Input type="search" value={q} placeholder={t('promotions.pickSearch')} onChange={(e) => setQ(e.target.value)} className="mb-3" />
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">{t('promotions.pickNone')}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {products.map((p) => {
            const picked: PickedProduct = { id: p.id, name: p.name, image: p.thumbnails[0] ?? '', price: p.minPriceUzs, hasVariants: p.hasVariants }
            const already = existingIds.includes(p.id)
            const checked = Boolean(sel[p.id]) || already
            return (
              <li key={p.id}>
                <label className={`flex items-center gap-3 py-2 ${already ? 'opacity-50' : 'cursor-pointer'}`}>
                  <input type="checkbox" disabled={already} checked={checked} onChange={() => toggle(picked)} className="rounded" />
                  <div className="h-10 w-10 overflow-hidden rounded border border-border bg-bg">
                    {picked.image && <img src={picked.image} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-text">{p.name}</p>
                    <p className="text-xs text-muted">{p.minPriceUzs.toLocaleString('ru-RU')} soʻm{p.hasVariants ? ' · variatsiyali' : ''}</p>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </Modal>
  )
}
