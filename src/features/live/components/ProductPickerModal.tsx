import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { useSellerProducts } from '../api/live.queries'
import { formatUZS } from '@/utils/money'
import { SearchIcon } from './icons'
import type { SellerProduct } from '../types/live.types'

type Props = {
  onClose: () => void
  onAdd: (product: SellerProduct, streamingPriceUzs: number) => void
  selectedIds: string[]
}

export function ProductPickerModal({ onClose, onAdd, selectedIds }: Props) {
  const { t } = useTranslation()
  const { data: products = [] } = useSellerProducts()
  const [search, setSearch] = useState('')
  const [prices, setPrices] = useState<Record<string, string>>({})

  const filtered = products.filter(
    (p) =>
      !selectedIds.includes(p.id) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  )

  function handleAdd(p: SellerProduct) {
    const raw = prices[p.id] ?? ''
    const price = parseInt(raw.replace(/\D/g, ''), 10)
    if (isNaN(price) || price <= 0) return
    onAdd(p, price)
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('live.createPromotion.modalTitle')}
      size="lg"
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
          <Table>
            <thead>
              <Tr>
                <Th>{t('live.createPromotion.colProduct')}</Th>
                <Th className="text-right">{t('live.createPromotion.colOriginalPrice')}</Th>
                <Th className="text-right">{t('live.createPromotion.colStreamingPrice')}</Th>
                <Th className="text-right">{t('live.createPromotion.colActions', { defaultValue: '' })}</Th>
              </Tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 flex-shrink-0 rounded bg-bg" />
                      <span className="line-clamp-2 text-xs">{p.name}</span>
                    </div>
                  </Td>
                  <Td className="text-right text-xs">{formatUZS(p.priceUzs)}</Td>
                  <Td className="text-right">
                    <input
                      type="number"
                      className="w-28 rounded-lg border border-border-strong bg-surface px-2 py-1 text-xs outline-none focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
                      placeholder={t('live.createPromotion.streamingPricePlaceholder')}
                      value={prices[p.id] ?? ''}
                      onChange={(e) => setPrices((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    />
                  </Td>
                  <Td className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAdd(p)}
                    >
                      {t('live.createPromotion.modalAdd')}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Modal>
  )
}
