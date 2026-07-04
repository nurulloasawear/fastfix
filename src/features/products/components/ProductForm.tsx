import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useCategoryTree } from '../api/products.queries'
import type { ProductFormData, SkuRow, VariationGroup } from '../types/products.types'
import type { LangTab } from './ProductFormShared'
import { BasicSection, onImgError } from './ProductFormBasic'
import { SalesSection } from './ProductFormSales'
import { ShippingSection, SpecSection, DescSection, OthersSection } from './ProductFormSections'

// A single blank pricing row so non-variant products always expose price/stock inputs.
const blankSku = (): SkuRow => ({ variation1: '', variation2: '', priceUzs: '', stock: '', sellerSku: '', available: true })

// ── Cartesian product helper ──────────────────────────────────────────────────
function buildSkus(groups: VariationGroup[]): SkuRow[] {
  // No variation groups → keep one plain row so price/stock stays editable.
  if (groups.length === 0) return [blankSku()]
  const g1 = groups[0]?.options ?? []
  const g2 = groups[1]?.options ?? []
  if (g2.length === 0) {
    return g1.map((v1) => ({ variation1: v1, variation2: '', priceUzs: '', stock: '', sellerSku: '', available: true }))
  }
  return g1.flatMap((v1) =>
    g2.map((v2) => ({ variation1: v1, variation2: v2, priceUzs: '', stock: '', sellerSku: '', available: true }))
  )
}

// ── Types & defaults ───────────────────────────────────────────────────────────
type Props = {
  initial?: Partial<ProductFormData>
  isEdit?: boolean
  isSaving: boolean
  onSaveDelist: (data: ProductFormData) => void | Promise<void>
  onPublish: (data: ProductFormData) => void | Promise<void>
  onCancel: () => void
}

const EMPTY_FORM: ProductFormData = {
  images: [], promotionImage: '', videoUrl: '',
  nameUz: '', nameRu: '', nameEn: '',
  category: '', categoryId: '', gtin: '', gtinExempt: false,
  brand: '', brandId: '', sizeChartId: '', condition: 'new', colourFamily: '',
  descUz: '', descRu: '', descEn: '',
  variations: [], hasVariants: false, skus: [blankSku()], wholesaleEnabled: false, wholesaleTiers: [],
  weightKg: '', widthCm: '', heightCm: '', lengthCm: '',
  shippingStandard: true, shippingExpress: false, preOrder: false, preOrderDays: '3',
  dangerousGoods: 'none', includedItems: '',
}

// ── Main form ─────────────────────────────────────────────────────────────────
export function ProductForm({ initial = {}, isSaving, onSaveDelist, onPublish, onCancel }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState<ProductFormData>({ ...EMPTY_FORM, ...initial })
  const [nameLang, setNameLang] = useState<LangTab>('uz')
  const [descLang, setDescLang] = useState<LangTab>('uz')
  const [activeSection, setActiveSection] = useState('basic')
  const [valErrors, setValErrors] = useState<string[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)

  const locked = !(form.categoryId || form.category)

  // Does the chosen category (or any ancestor) require a size chart? (fashion/footwear)
  const { data: catTree = [] } = useCategoryTree()
  const catNeedsChart = useMemo(() => {
    if (!form.categoryId) return false
    const byId = new Map(catTree.map((n) => [n.id, n]))
    let cur = byId.get(form.categoryId)
    while (cur) {
      if (cur.requires_size_chart) return true
      cur = cur.parent_id ? byId.get(cur.parent_id) : undefined
    }
    return false
  }, [catTree, form.categoryId])

  // Required-field checks mirror the backend (title, price>0, etc.) so the seller
  // sees exactly what is missing instead of a silent rejection.
  function validate(f: ProductFormData): string[] {
    const errs: string[] = []
    if (f.images.length === 0) errs.push(t('products.add_page.valImages'))
    if (!f.nameUz.trim()) errs.push(t('products.add_page.valName'))
    if (!(f.categoryId || f.category)) errs.push(t('products.add_page.valCategory'))
    if (catNeedsChart && !f.sizeChartId) errs.push(t('products.size.valRequired'))
    if (f.hasVariants && f.skus.length > 0) {
      if (f.skus.some((s) => !(Number(s.priceUzs) > 0))) errs.push(t('products.add_page.valVariantPrice'))
      if (f.skus.some((s) => String(s.stock).trim() === '')) errs.push(t('products.add_page.valVariantStock'))
    } else {
      const first = f.skus[0]
      if (!first || !(Number(first.priceUzs) > 0)) errs.push(t('products.add_page.valPrice'))
      if (!first || String(first.stock).trim() === '') errs.push(t('products.add_page.valStock'))
    }
    return errs
  }

  async function submit(publish: boolean) {
    setSaveError(null)
    const errs = validate(form)
    if (errs.length > 0) {
      setValErrors(errs)
      // Pop the first issue up top so it's seen without scrolling to the footer.
      toast.error(errs[0] ?? t('products.add_page.valFix'))
      return
    }
    setValErrors([])
    try {
      await (publish ? onPublish(form) : onSaveDelist(form))
    } catch (e) {
      const code = e instanceof ApiError ? e.code : ((e as { code?: string })?.code ?? 'internal_error')
      const msg = tError(code)
      setSaveError(msg)
      toast.error(msg) // popup so the seller sees the reason immediately
    }
  }

  function update<K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function updateVariationGroup(idx: number, patch: Partial<VariationGroup>) {
    const updated = form.variations.map((g, i) => i === idx ? { ...g, ...patch } : g)
    setForm((prev) => ({ ...prev, variations: updated, skus: buildSkus(updated) }))
  }

  function removeVariationGroup(idx: number) {
    const updated = form.variations.filter((_, i) => i !== idx)
    setForm((prev) => ({ ...prev, variations: updated, skus: buildSkus(updated) }))
  }

  function addVariationGroup() {
    if (form.variations.length >= 2) return
    const newGroups = [...form.variations, { name: '', options: [] }]
    setForm((prev) => ({ ...prev, variations: newGroups, skus: buildSkus(newGroups) }))
  }

  function updateSku(idx: number, patch: Partial<SkuRow>) {
    update('skus', form.skus.map((s, i) => i === idx ? { ...s, ...patch } : s))
  }

  const NAV = [
    { key: 'basic', label: t('products.add_page.navBasic') },
    { key: 'description', label: t('products.add_page.navDescription') },
    { key: 'sales', label: t('products.add_page.navSales') },
    { key: 'shipping', label: t('products.add_page.navShipping') },
    { key: 'others', label: t('products.add_page.navOthers') },
  ]

  // Section anchors so the nav tabs scroll to their section (single long form).
  const sectionRefs = {
    basic: useRef<HTMLDivElement>(null),
    description: useRef<HTMLDivElement>(null),
    sales: useRef<HTMLDivElement>(null),
    shipping: useRef<HTMLDivElement>(null),
    others: useRef<HTMLDivElement>(null),
  }
  const goTo = (key: string) => {
    setActiveSection(key)
    sectionRefs[key as keyof typeof sectionRefs]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Live preview (updates as the seller types) ──────────────────────────────
  const previewImg = form.images[0] || form.promotionImage || ''
  const previewName = form.nameUz || form.nameRu || form.nameEn || ''
  const previewPrices = form.skus.map((s) => Number(s.priceUzs)).filter((n) => n > 0)
  const previewPrice = previewPrices.length ? Math.min(...previewPrices) : 0
  const priceLabel = previewPrice
    ? `${previewPrice.toLocaleString('ru-RU')} ${t('products.add_page.currencySom', { defaultValue: 'soʻm' })}`
    : ''

  return (
    <div className="flex gap-4">
      {/* Left: filling tips + COMPACT live preview (moved here so the form is wider) */}
      <aside className="hidden w-52 shrink-0 flex-col gap-4 self-start lg:flex">
        <div className="sticky top-0 rounded-lg border border-border bg-surface p-4">
          <p className="mb-2 text-xs font-semibold text-text-secondary">{t('products.add_page.fillingSuggestion')}</p>
          <ul className="flex flex-col gap-2 text-xs text-muted">
            <li>• {t('products.add_page.tipImages')}</li>
            <li>• {t('products.add_page.tipName')}</li>
            <li>• {t('products.add_page.tipPrice')}</li>
            <li>• {t('products.add_page.tipCategory')}</li>
          </ul>
          <p className="mb-2 mt-4 text-xs font-semibold text-text">{t('products.add_page.preview')}</p>
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className={`relative w-full bg-bg ${form.videoUrl ? 'aspect-[3/4]' : 'aspect-square'}`}>
              {previewImg ? (
                <img src={previewImg} alt="" className="h-full w-full object-cover" onError={onImgError} />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-muted">{t('products.add_page.previewNoImage', { defaultValue: 'Rasm yuklang' })}</div>
              )}
              {form.videoUrl && <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">▶</span>}
            </div>
            <div className="p-2">
              <p className="line-clamp-2 text-xs font-medium text-text">{previewName || t('products.add_page.previewNoName', { defaultValue: 'Mahsulot nomi' })}</p>
              <p className="mt-0.5 text-sm font-bold text-brand">{priceLabel || '—'}</p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-muted">{t('products.add_page.previewCaption')}</p>
        </div>
      </aside>

      {/* Centre: sectioned form (takes the freed width) */}
      <div className="flex min-w-0 flex-1 flex-col gap-0">
        {/* Sticky section nav — solid bg + z so scrolled content can't bleed through */}
        <div className="sticky top-0 z-20 flex flex-wrap border-b border-border bg-bg">
          {NAV.map((n) => (
            <button key={n.key} type="button" onClick={() => goTo(n.key)}
              className={`px-4 py-3 text-sm font-semibold transition-colors ${
                activeSection === n.key ? 'border-b-2 border-brand text-brand' : 'text-text-secondary hover:text-text'
              }`}>{n.label}</button>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <div ref={sectionRefs.basic} className="scroll-mt-16"><BasicSection form={form} nameLang={nameLang} onNameLangChange={setNameLang} onUpdate={update} /></div>
          <SpecSection form={form} onUpdate={update} locked={locked} />
          <div ref={sectionRefs.description} className="scroll-mt-16"><DescSection form={form} descLang={descLang} onDescLangChange={setDescLang} onUpdate={update} locked={locked} /></div>
          <div ref={sectionRefs.sales} className="scroll-mt-16">
            <SalesSection form={form}
              onVariationGroupUpdate={updateVariationGroup}
              onVariationGroupRemove={removeVariationGroup}
              onAddVariationGroup={addVariationGroup}
              onSkuUpdate={updateSku}
              onTierUpdate={(idx, patch) => update('wholesaleTiers', form.wholesaleTiers.map((t, i) => i === idx ? { ...t, ...patch } : t))}
              onTierRemove={(idx) => update('wholesaleTiers', form.wholesaleTiers.filter((_, i) => i !== idx))}
              onAddTier={() => update('wholesaleTiers', [...form.wholesaleTiers, { minQty: '', maxQty: '', priceUzs: '' }])}
              onUpdate={update}
            />
          </div>
          <div ref={sectionRefs.shipping} className="scroll-mt-16"><ShippingSection form={form} onUpdate={update} locked={locked} /></div>
          <div ref={sectionRefs.others} className="scroll-mt-16"><OthersSection form={form} onUpdate={update} locked={locked} /></div>
        </div>

        {/* Validation / save error banner */}
        {(valErrors.length > 0 || saveError) && (
          <div className="mb-2 rounded-lg border border-error-text bg-error-bg p-3 text-sm text-error-text">
            {valErrors.length > 0 && (
              <>
                <p className="font-semibold">{t('products.add_page.valFix')}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {valErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </>
            )}
            {saveError && <p className={valErrors.length > 0 ? 'mt-2 font-semibold' : 'font-semibold'}>{saveError}</p>}
          </div>
        )}

        {/* Sticky footer — solid bg */}
        <div className="sticky bottom-0 z-20 flex items-center justify-end gap-3 border-t border-border bg-bg px-4 py-4">
          <Button variant="outline" onClick={onCancel}>{t('products.add_page.cancel')}</Button>
          <Button variant="outline" disabled={isSaving} onClick={() => void submit(false)}>{t('products.add_page.saveDelist')}</Button>
          <Button disabled={isSaving} onClick={() => void submit(true)}>
            {isSaving ? t('products.add_page.publishing') : t('products.add_page.publish')}
          </Button>
        </div>
      </div>
    </div>
  )
}
