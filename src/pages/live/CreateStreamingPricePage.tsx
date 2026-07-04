import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  useCreatePromotion,
  ProductPickerModal,
  TrashIcon,
} from '@/features/live'
import { formatUZS } from '@/utils/money'
import type { SellerProduct } from '@/features/live'

interface LocalProduct {
  productId: string
  productName: string
  coverUrl: string
  streamingPriceUzs: number
  originalPriceUzs: number
}

function defaultStart() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}
function defaultEnd() {
  const d = new Date()
  d.setHours(d.getHours() + 1)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function CreateStreamingPricePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createMutation = useCreatePromotion()

  const [name, setName] = useState('')
  const [startAt, setStartAt] = useState(defaultStart())
  const [endAt, setEndAt] = useState(defaultEnd())
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [showPicker, setShowPicker] = useState(false)

  const isValid = name.trim().length > 0 && startAt.length > 0 && endAt.length > 0 && products.length > 0

  function handleAddProduct(product: SellerProduct, streamingPriceUzs: number) {
    setProducts((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        coverUrl: product.coverUrl,
        streamingPriceUzs,
        originalPriceUzs: product.priceUzs,
      },
    ])
    setShowPicker(false)
  }

  function handleRemove(productId: string) {
    setProducts((prev) => prev.filter((p) => p.productId !== productId))
  }

  function handleSubmit() {
    if (!isValid) return
    createMutation.mutate(
      {
        name: name.trim(),
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        products: products.map((p) => ({ productId: p.productId, streamingPriceUzs: p.streamingPriceUzs })),
      },
      { onSuccess: () => navigate('/live/streaming-price') },
    )
  }

  return (
    <>
      <Page>
        <PageHeader
          title={t('live.createPromotion.basicInfo')}
          breadcrumb={t('live.createPromotion.breadcrumb')}
        />

        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="mb-5 text-base font-semibold text-text">{t('live.createPromotion.basicInfo')}</h2>

          <div className="grid gap-5">
            {/* Promotion name */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
              <label className="w-40 shrink-0 pt-1 text-sm font-semibold text-text-secondary">
                <span className="text-error-text">* </span>
                {t('live.createPromotion.promotionName')}
              </label>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    maxLength={40}
                    placeholder={t('live.createPromotion.promotionNamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pr-14"
                    hint={t('live.createPromotion.promotionNameHint')}
                  />
                  <span className="absolute right-3 top-3 text-xs text-muted">
                    {name.length}/40
                  </span>
                </div>
              </div>
            </div>

            {/* Promotion period */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
              <label className="w-40 shrink-0 text-sm font-semibold text-text-secondary">
                <span className="text-error-text">* </span>
                {t('live.createPromotion.promotionPeriod')}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="h-11 rounded-lg border border-border-strong bg-surface px-3 text-sm text-text outline-none focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
                />
                <span className="text-muted">—</span>
                <input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="h-11 rounded-lg border border-border-strong bg-surface px-3 text-sm text-text outline-none focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Add Products */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text">{t('live.createPromotion.addProducts')}</h2>
              <p className="text-xs text-muted">{t('live.createPromotion.addProductsHelper')}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPicker(true)}
              disabled={products.length >= 50}
            >
              {t('live.createPromotion.addProductsBtn', { count: products.length })}
            </Button>
          </div>

          {products.length === 0 ? (
            <EmptyState
              title={t('live.createPromotion.noProductsAdded')}
              className="rounded-lg border border-dashed border-border"
            />
          ) : (
            <Table>
              <thead>
                <Tr>
                  <Th>{t('live.createPromotion.colNo')}</Th>
                  <Th>{t('live.createPromotion.colProduct')}</Th>
                  <Th className="text-right">{t('live.createPromotion.colStreamingPrice')}</Th>
                  <Th className="text-right">{t('live.createPromotion.colOriginalPrice')}</Th>
                  <Th className="text-right">{t('live.createPromotion.colRemove')}</Th>
                </Tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <Tr key={p.productId}>
                    <Td className="text-xs text-muted">{idx + 1}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 shrink-0 rounded bg-bg" />
                        <span className="line-clamp-2 text-xs">{p.productName}</span>
                      </div>
                    </Td>
                    <Td className="text-right text-xs font-medium text-brand">
                      {formatUZS(p.streamingPriceUzs)}
                    </Td>
                    <Td className="text-right text-xs text-text-secondary">
                      {formatUZS(p.originalPriceUzs)}
                    </Td>
                    <Td className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(p.productId)}
                        className="text-muted hover:text-error-text"
                      >
                        <TrashIcon size={15} />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={() => navigate('/live/streaming-price')}>
            {t('live.createPromotion.cancel')}
          </Button>
          <Button disabled={!isValid || createMutation.isPending} onClick={handleSubmit}>
            {t('live.createPromotion.confirm')} &rsaquo;
          </Button>
        </div>
      </Page>

      {showPicker && (
        <ProductPickerModal
          onClose={() => setShowPicker(false)}
          onAdd={handleAddProduct}
          selectedIds={products.map((p) => p.productId)}
        />
      )}
    </>
  )
}
