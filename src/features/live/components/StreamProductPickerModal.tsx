import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useSellerProducts } from '../api/live.queries'
import { formatUZS } from '@/utils/money'
import { SearchIcon } from './icons'
import type { SellerProduct } from '../types/live.types'

type Props = {
  onClose: () => void
  onAdd: (product: SellerProduct) => void
  selectedIds: string[]
}

export function StreamProductPickerModal({ onClose, onAdd, selectedIds }: Props) {
  const { t } = useTranslation()
  const { data: products = [] } = useSellerProducts()
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      !selectedIds.includes(p.id) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Modal
      open
      onClose={onClose}
      title={t('live.createStream.relatedProducts')}
      size="md"
      footer={
        <Button variant="outline" size="sm" onClick={onClose}>
          {t('live.createPromotion.modalClose')}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder={t('live.createPromotion.modalSearch')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          trailing={<SearchIcon size={16} />}
        />

        {filtered.length === 0 ? (
          <EmptyState title={t('live.createPromotion.noProductsAdded')} className="py-8" />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-bg" />
                  <div>
                    <p className="line-clamp-1 text-xs font-medium text-text">{p.name}</p>
                    <p className="text-xs text-muted">{formatUZS(p.priceUzs)}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => onAdd(p)}>
                  {t('live.createPromotion.modalAdd')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
