// Remaining form sections: Spec, Description, Shipping, Others, Preview, FillingSuggestion.
// Basic and Sales sections are in ProductFormBasic.tsx and ProductFormSales.tsx.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { SectionBlock, LangTabs, type LangTab } from './ProductFormShared'
import { BrandPicker } from './BrandPicker'
import { useSizeCharts } from '../api/products.queries'
import type { ProductFormData } from '../types/products.types'

// ── Spec section ────────────────────────────────────────────────────────────────
export function SpecSection({ form, onUpdate, locked }: {
  form: ProductFormData
  onUpdate: <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => void
  locked: boolean
}) {
  const { t } = useTranslation()
  const [showBrand, setShowBrand] = useState(false)
  const { data: sizeChartsData } = useSizeCharts()
  const sizeCharts = sizeChartsData?.sizeCharts ?? []
  return (
    <SectionBlock title={t('products.add_page.specification')} locked={locked}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('products.add_page.brand')}</label>
          <button
            type="button"
            onClick={() => setShowBrand(true)}
            className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 text-left text-sm transition-colors hover:border-brand"
          >
            <span className={form.brand ? 'text-text' : 'text-muted'}>
              {form.brand || t('products.brandPicker.placeholder')}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>
        <Select label={t('products.add_page.condition')} value={form.condition}
          onChange={(e) => onUpdate('condition', e.target.value as 'new' | 'used')}>
          <option value="new">{t('products.add_page.conditionNew')}</option>
          <option value="used">{t('products.add_page.conditionUsed')}</option>
        </Select>
        <Input label={t('products.add_page.colourFamily')} value={form.colourFamily} onChange={(e) => onUpdate('colourFamily', e.target.value)} />
        <Select label={t('products.size.title')} value={form.sizeChartId} onChange={(e) => onUpdate('sizeChartId', e.target.value)}>
          <option value="">{t('products.size.none')}</option>
          {sizeCharts.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </div>
      <BrandPicker
        open={showBrand}
        onClose={() => setShowBrand(false)}
        onSelect={(b) => {
          onUpdate('brand', b?.name ?? '')
          onUpdate('brandId', b?.id ?? '')
        }}
      />
    </SectionBlock>
  )
}

// ── Description section ─────────────────────────────────────────────────────────
export function DescSection({ form, descLang, onDescLangChange, onUpdate, locked }: {
  form: ProductFormData
  descLang: LangTab
  onDescLangChange: (l: LangTab) => void
  onUpdate: <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => void
  locked: boolean
}) {
  const { t } = useTranslation()
  const descValue = descLang === 'uz' ? form.descUz : descLang === 'ru' ? form.descRu : form.descEn
  const setDesc = (v: string) => {
    if (descLang === 'uz') onUpdate('descUz', v)
    else if (descLang === 'ru') onUpdate('descRu', v)
    else onUpdate('descEn', v)
  }
  return (
    <SectionBlock title={t('products.add_page.description')} locked={locked}>
      <LangTabs active={descLang} onChange={onDescLangChange} />
      <div className="relative mt-2">
        <Textarea rows={6} placeholder={t('products.add_page.descPlaceholder')} value={descValue}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full pr-24" />
        <button type="button" title={t('products.add_page.descAiTooltip')}
          className="absolute bottom-3 right-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white opacity-50 cursor-not-allowed">
          {t('products.add_page.descAiCta')}
        </button>
      </div>
    </SectionBlock>
  )
}

// ── Shipping section ────────────────────────────────────────────────────────────
export function ShippingSection({ form, onUpdate, locked }: {
  form: ProductFormData
  onUpdate: <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => void
  locked: boolean
}) {
  const { t } = useTranslation()
  return (
    <SectionBlock title={t('products.add_page.shipping')} locked={locked}>
      <div className="grid grid-cols-2 gap-4">
        <Input label={t('products.add_page.weight')} placeholder={t('products.add_page.weightPlaceholder')}
          type="number" value={form.weightKg} onChange={(e) => onUpdate('weightKg', e.target.value)} />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text-secondary">{t('products.add_page.dimensions')}</label>
          <div className="flex gap-2">
            {(['widthCm', 'heightCm', 'lengthCm'] as const).map((k, i) => (
              <Input key={k} type="number" value={form[k]}
                placeholder={[t('products.add_page.widthPlaceholder'), t('products.add_page.heightPlaceholder'), t('products.add_page.lengthPlaceholder')][i]}
                onChange={(e) => onUpdate(k, e.target.value)}
                className="flex-1" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('products.add_page.shippingMethods')}</label>
        <div className="flex gap-4">
          {(['shippingStandard', 'shippingExpress'] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form[k]} onChange={(e) => onUpdate(k, e.target.checked)} className="rounded" />
              {t(`products.add_page.shipping${k === 'shippingStandard' ? 'Standard' : 'Express'}`)}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
          <input type="checkbox" checked={form.preOrder} onChange={(e) => onUpdate('preOrder', e.target.checked)} className="rounded" />
          {t('products.add_page.preOrder')}
        </label>
        {form.preOrder && (
          <div className="mt-2">
            <Input label={t('products.add_page.preOrderDays')} type="number" min="1" max="7"
              value={form.preOrderDays} onChange={(e) => onUpdate('preOrderDays', e.target.value)} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <Select label={t('products.add_page.dangerousGoods')} value={form.dangerousGoods}
          onChange={(e) => onUpdate('dangerousGoods', e.target.value)}>
          <option value="none">None</option>
          <option value="batteries">Batteries</option>
          <option value="flammable">Flammable</option>
          <option value="fragile">Fragile</option>
        </Select>
      </div>
    </SectionBlock>
  )
}

// ── Others section ──────────────────────────────────────────────────────────────
export function OthersSection({ form, onUpdate, locked }: {
  form: ProductFormData
  onUpdate: <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => void
  locked: boolean
}) {
  const { t } = useTranslation()
  return (
    <SectionBlock title={t('products.add_page.others')} locked={locked}>
      <Input label={t('products.add_page.includedItems')} value={form.includedItems}
        onChange={(e) => onUpdate('includedItems', e.target.value)} />
    </SectionBlock>
  )
}

// ── Preview panel ───────────────────────────────────────────────────────────────
export function PreviewPanel({ form }: { form: ProductFormData }) {
  const { t } = useTranslation()
  return (
    <Card className="p-4">
      <p className="mb-2 text-sm font-semibold text-text">{t('products.add_page.preview')}</p>
      <p className="mb-3 text-xs text-muted">{t('products.add_page.previewDetail')}</p>
      <div className="mb-3 aspect-square w-full rounded-md bg-bg" />
      <p className="mb-1 text-xs text-muted">{form.variations.length} {t('products.add_page.variationsAvailable')}</p>
      <div className="mb-2 h-3 w-3/4 rounded bg-border" />
      <div className="mb-3 h-3 w-1/2 rounded bg-border" />
      <div className="flex gap-2">
        <div className="flex-1 rounded-full border border-border py-2 text-center text-xs text-muted">Chat</div>
        <div className="flex-1 rounded-full border border-border py-2 text-center text-xs text-muted">Cart</div>
        <div className="flex-1 rounded-full bg-brand py-2 text-center text-xs text-white">Buy</div>
      </div>
      <p className="mt-3 text-xs text-muted">{t('products.add_page.previewCaption')}</p>
    </Card>
  )
}

// Re-export LangTab so ProductForm can import it from here
export type { LangTab }
