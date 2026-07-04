import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatUZS } from '@/utils/money'
import { GripVerticalIcon, ArrowUpIcon, TrashIcon, TagIcon } from './icons'
import { usePinStreamProduct, useRemoveStreamProduct, useReorderStreamProducts } from '../api/live.queries'
import { StreamProductPickerModal } from './StreamProductPickerModal'
import type { StreamSessionProduct, SellerProduct } from '../types/live.types'

type Props = {
  streamId: string
  products: StreamSessionProduct[]
  onClose: () => void
}

export function ProductsPanelModal({ streamId, products: initialProducts, onClose }: Props) {
  const { t } = useTranslation()
  const [products, setProducts] = useState(initialProducts)
  const [showPicker, setShowPicker] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const pinMutation = usePinStreamProduct()
  const removeMutation = useRemoveStreamProduct()
  const reorderMutation = useReorderStreamProducts()

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handlePin(productId: string) {
    pinMutation.mutate({ streamId, productId })
    setProducts((prev) =>
      prev.map((p) => ({ ...p, pinnedAt: p.productId === productId ? new Date().toISOString() : null })),
    )
  }

  function handleRemove(productId: string) {
    removeMutation.mutate({ streamId, productId })
    setProducts((prev) => prev.filter((p) => p.productId !== productId))
  }

  function handleMoveToTop(productId: string) {
    const sorted = [
      ...products.filter((p) => p.productId === productId),
      ...products.filter((p) => p.productId !== productId),
    ].map((p, i) => ({ ...p, sortOrder: i }))
    setProducts(sorted)
    reorderMutation.mutate({ streamId, items: sorted.map((p) => ({ productId: p.productId, sortOrder: p.sortOrder })) })
  }

  function handleAddProduct(product: SellerProduct) {
    setProducts((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        coverUrl: product.coverUrl,
        priceUzs: product.priceUzs,
        streamingPriceUzs: null,
        commissionRate: product.commissionRate,
        sortOrder: prev.length,
        pinnedAt: null,
      },
    ])
    setShowPicker(false)
  }

  const sorted = [...products].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title={t('live.preview.productsModal', { count: products.length })}
        size="lg"
        footer={
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('live.createPromotion.modalClose')}
          </Button>
        }
      >
        {/* Toolbar */}
        <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <Button variant="outline" size="sm" onClick={() => setShowPicker(true)}>
            {t('live.preview.addRelatedProducts')}
          </Button>
          <span className="text-xs text-muted">
            {t('live.preview.selected', { count: selected.size, total: products.length })}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ArrowUpIcon size={14} /> {t('live.preview.top')}
            </Button>
            <Button variant="ghost" size="sm" className="text-error-text hover:text-error-text">
              <TrashIcon size={14} /> {t('live.preview.delete')}
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon={<TagIcon size={24} />}
            title={t('live.createStream.relatedProducts')}
            description={t('live.createPromotion.noProductsAdded')}
          />
        ) : (
          <Table>
            <thead>
              <Tr>
                <Th className="w-8 px-2" />
                <Th className="w-8 px-2">
                  <input type="checkbox" className="rounded" readOnly />
                </Th>
                <Th className="w-8">#</Th>
                <Th>{t('live.preview.colProduct')}</Th>
                <Th className="text-right">{t('live.preview.colPrice')}</Th>
                <Th className="text-right">{t('live.preview.colActions')}</Th>
              </Tr>
            </thead>
            <tbody>
              {sorted.map((p, idx) => (
                <Tr key={p.productId}>
                  <Td className="px-2 text-muted">
                    <GripVerticalIcon size={14} />
                  </Td>
                  <Td className="px-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selected.has(p.productId)}
                      onChange={() => toggleSelect(p.productId)}
                    />
                  </Td>
                  <Td className="text-xs text-muted">{idx + 1}</Td>
                  <Td>
                    <div className="flex items-start gap-2">
                      <div className="h-10 w-10 flex-shrink-0 rounded bg-bg" />
                      <div>
                        <p className="line-clamp-2 text-xs font-medium text-text">{p.productName}</p>
                        <p className="text-xs text-muted">{p.commissionRate}%</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-right text-xs">
                    {p.streamingPriceUzs ? (
                      <span>{formatUZS(p.streamingPriceUzs)} ~ {formatUZS(p.priceUzs)}</span>
                    ) : (
                      <span>{formatUZS(p.priceUzs)}</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePin(p.productId)}
                        className={p.pinnedAt ? 'text-success hover:text-success' : ''}
                      >
                        {p.pinnedAt ? t('live.preview.showing') : t('live.preview.show')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveToTop(p.productId)}
                      >
                        {t('live.preview.moveToTop')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(p.productId)}
                        className="text-error-text hover:text-error-text"
                      >
                        {t('live.preview.remove')}
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal>

      {showPicker && (
        <StreamProductPickerModal
          onClose={() => setShowPicker(false)}
          onAdd={handleAddProduct}
          selectedIds={products.map((p) => p.productId)}
        />
      )}
    </>
  )
}
