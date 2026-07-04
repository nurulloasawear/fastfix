import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { ChevronRight, MarketingNav, ZapIcon, AlertIcon, useCreateFlashDeal } from '@/features/marketing'
import { FlashDealProductTable } from './FlashDealProductTable'
import type { ProductRow } from './FlashDealProductTable'

const SAMPLE_SLOTS = [
  { id: 'slot-1', label: '2026-07-01 · 10:00 — 12:00' },
  { id: 'slot-2', label: '2026-07-01 · 14:00 — 16:00' },
  { id: 'slot-3', label: '2026-07-02 · 10:00 — 12:00' },
  { id: 'slot-4', label: '2026-07-02 · 18:00 — 20:00' },
]

const CRITERIA_KEYS = [
  'criteriaPromoStock', 'criteriaDiscountLimit', 'criteriaPromoPrice', 'criteriaRating',
  'criteriaLikes', 'criteriaPreOrder', 'criteriaOrders', 'criteriaDaysToShip', 'criteriaRepetition',
] as const

export function CreateFlashDealPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createMutation = useCreateFlashDeal()

  const [timeSlot, setTimeSlot] = useState('')
  const [slotPickerOpen, setSlotPickerOpen] = useState(false)
  const [products, setProducts] = useState<ProductRow[]>([])

  const hasMissingPrice = products.some((p) => !p.promoPriceUzs || Number(p.promoPriceUzs) <= 0)
  const hasMissingStock = products.some((p) => !p.promoStock || Number(p.promoStock) <= 0)
  const canConfirm = timeSlot && products.length > 0 && !hasMissingPrice && !hasMissingStock

  function addMockProduct() {
    setProducts((prev) => [
      ...prev,
      { id: `product-${Date.now()}`, name: `Sample Product ${prev.length + 1}`, originalPriceUzs: 150000, promoPriceUzs: '', promoStock: '' },
    ])
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function updateProduct(id: string, field: 'promoPriceUzs' | 'promoStock', val: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: val } : p)))
  }

  function handleConfirm() {
    if (!canConfirm) return
    createMutation.mutate(
      {
        timeSlot,
        products: products.map((p) => ({ productId: p.id, promoPriceUzs: Number(p.promoPriceUzs), promoStock: Number(p.promoStock) })),
      },
      { onSuccess: () => navigate('/marketing/flash-deals') },
    )
  }

  return (
    <Page>
      <PageHeader
        title={t('marketing.flashDeals.createNew')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span>{t('marketing.flashDeals.title')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.flashDeals.createNew')}</span>
          </span>
        }
      />

      <MarketingNav />

      {/* Step 1 — Time Slot */}
      <Card className="p-6">
        <h2 className="mb-1 text-base font-semibold text-text">{t('marketing.flashDeals.form.basicInfo')}</h2>
        <p className="mb-5 text-sm text-muted">{t('marketing.flashDeals.step1Desc')}</p>

        <label className="mb-1.5 block text-sm font-semibold text-text-secondary">
          {t('marketing.flashDeals.form.timeSlot')}
        </label>

        {timeSlot ? (
          <div className="flex items-center gap-2">
            <Badge tone="info" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold">
              <ZapIcon size={14} />
              {timeSlot}
            </Badge>
            <Button type="button" variant="outline" size="sm" onClick={() => { setTimeSlot(''); setSlotPickerOpen(true) }}>
              {t('common.change') || 'Change'}
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={() => setSlotPickerOpen((v) => !v)}>
            <ZapIcon size={16} />
            {t('marketing.flashDeals.form.selectTimeSlot')}
          </Button>
        )}

        {slotPickerOpen && !timeSlot && (
          <div className="mt-2 w-72 rounded-lg border border-border bg-surface shadow-xs">
            {SAMPLE_SLOTS.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => { setTimeSlot(slot.label); setSlotPickerOpen(false) }}
                className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-sm text-text transition-colors hover:bg-bg last:border-0"
              >
                <ZapIcon size={14} className="text-brand" />
                {slot.label}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Step 2 — Criteria */}
      <Card className="p-6">
        <h2 className="mb-1 text-base font-semibold text-text">{t('marketing.flashDeals.form.productCriteria')}</h2>
        <p className="mb-4 text-sm text-muted">{t('marketing.flashDeals.form.allCriteria')}</p>
        <div className="rounded-lg border border-border bg-bg p-4">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-xs text-text-secondary">
            {CRITERIA_KEYS.map((key) => (
              <span key={key} className="flex items-center gap-1.5">
                <AlertIcon size={12} className="shrink-0 text-warning" />
                {t(`marketing.flashDeals.form.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Step 3 — Products */}
      <FlashDealProductTable
        products={products}
        timeSlotSelected={!!timeSlot}
        onAdd={addMockProduct}
        onRemove={removeProduct}
        onUpdate={updateProduct}
      />

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 flex justify-end gap-3 border-t border-border bg-bg py-4">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          {t('marketing.flashDeals.form.cancel')}
        </Button>
        <Button type="button" disabled={!canConfirm || createMutation.isPending} onClick={handleConfirm}>
          {createMutation.isPending
            ? <><Spinner className="h-4 w-4" /> {t('marketing.flashDeals.form.confirm')}…</>
            : t('marketing.flashDeals.form.confirm')}
        </Button>
      </div>
    </Page>
  )
}
