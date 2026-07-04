import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useProductDetail } from '@/features/products'
import type { DiscountKind, DiscountLine } from '../types/promotions.types'
import { PromotionProductPicker, type PickedProduct } from './PromotionProductPicker'

// Loads a product's variants (child component → hook used unconditionally) and
// reports them up so the editor can expand a product into per-variation rows.
function VariationLoader({ productId, onLoaded }: { productId: string; onLoaded: (rows: { id: string; label: string; price: number }[]) => void }) {
  const { data } = useProductDetail(productId)
  useEffect(() => {
    if (!data) return
    const rows = (data.skus ?? [])
      .filter((s) => s.id)
      .map((s) => ({ id: s.id as string, label: [s.variation1, s.variation2].filter(Boolean).join(' / ') || 'SKU', price: Number(s.priceUzs) || 0 }))
    onLoaded(rows)
  }, [data, onLoaded])
  return null
}

function newPrice(l: DiscountLine): number {
  const base = l.originalPriceUzs
  const v = Number(l.value) || 0
  if (l.discountType === 'percent') return Math.max(0, Math.round(base * (1 - v / 100)))
  return Math.max(0, base - v)
}

export function DiscountProductEditor({ lines, onChange }: { lines: DiscountLine[]; onChange: (lines: DiscountLine[]) => void }) {
  const { t } = useTranslation()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [bulkType, setBulkType] = useState<DiscountKind>('percent')
  const [bulkValue, setBulkValue] = useState('')
  const [expandId, setExpandId] = useState<string | null>(null)
  const [productMeta, setProductMeta] = useState<Record<string, { hasVariants: boolean }>>({})

  const productIds = [...new Set(lines.map((l) => l.productId))]

  function addProducts(picked: PickedProduct[]) {
    const meta = { ...productMeta }
    const next = [...lines]
    for (const p of picked) {
      meta[p.id] = { hasVariants: p.hasVariants }
      if (!next.some((l) => l.productId === p.id)) {
        next.push({
          key: p.id, productId: p.id, variantId: null, title: p.name, image: p.image,
          originalPriceUzs: p.price, discountType: bulkType, value: '', promoStock: '', perOrderLimit: '',
        })
      }
    }
    setProductMeta(meta)
    onChange(next)
  }
  function update(key: string, patch: Partial<DiscountLine>) {
    onChange(lines.map((l) => (l.key === key ? { ...l, ...patch } : l)))
  }
  function removeProduct(productId: string) {
    onChange(lines.filter((l) => l.productId !== productId))
  }
  function applyToAll() {
    onChange(lines.map((l) => ({ ...l, discountType: bulkType, value: bulkValue })))
  }
  function onVariationsLoaded(productId: string, rows: { id: string; label: string; price: number }[]) {
    setExpandId(null)
    if (rows.length === 0) return
    const src = lines.find((l) => l.productId === productId)
    const carryType = src?.discountType ?? bulkType
    const carryVal = src?.value ?? ''
    const others = lines.filter((l) => l.productId !== productId)
    const expanded: DiscountLine[] = rows.map((r) => ({
      key: `${productId}:${r.id}`, productId, variantId: r.id, title: src?.title ?? '', image: src?.image ?? '',
      originalPriceUzs: r.price, variantLabel: r.label, discountType: carryType, value: carryVal, promoStock: '', perOrderLimit: '',
    }))
    onChange([...others, ...expanded])
  }
  function collapseProduct(productId: string) {
    const src = lines.find((l) => l.productId === productId)
    const others = lines.filter((l) => l.productId !== productId)
    onChange([...others, {
      key: productId, productId, variantId: null, title: src?.title ?? '', image: src?.image ?? '',
      originalPriceUzs: src?.originalPriceUzs ?? 0, discountType: src?.discountType ?? bulkType, value: src?.value ?? '',
      promoStock: '', perOrderLimit: '',
    }])
  }

  return (
    <div>
      {/* bulk bar */}
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-bg p-3">
        <span className="text-sm font-medium text-text-secondary">{t('promotions.bulkLabel')}:</span>
        <div className="flex overflow-hidden rounded-md border border-border-strong">
          <button type="button" onClick={() => setBulkType('percent')} className={`px-3 py-1.5 text-xs font-semibold ${bulkType === 'percent' ? 'bg-brand text-white' : 'text-muted'}`}>%</button>
          <button type="button" onClick={() => setBulkType('fixed')} className={`px-3 py-1.5 text-xs font-semibold ${bulkType === 'fixed' ? 'bg-brand text-white' : 'text-muted'}`}>soʻm</button>
        </div>
        <Input type="number" min="0" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)}
          placeholder={bulkType === 'percent' ? '15' : '10000'} className="w-28" />
        <Button variant="outline" disabled={!bulkValue || lines.length === 0} onClick={applyToAll}>{t('promotions.applyAll')}</Button>
        <Button className="ml-auto" onClick={() => setPickerOpen(true)}>+ {t('promotions.addProducts')}</Button>
      </div>

      {lines.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted">{t('promotions.noProducts')}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-bg text-left text-xs text-text-secondary">
              <tr>
                <th className="px-3 py-2">{t('promotions.colImage')}</th>
                <th className="px-3 py-2">{t('promotions.colOriginal')}</th>
                <th className="px-3 py-2">{t('promotions.colDiscount')}</th>
                <th className="px-3 py-2">{t('promotions.colNew')}</th>
                <th className="px-3 py-2">{t('promotions.colStock')}</th>
                <th className="px-3 py-2">{t('promotions.colLimit')}</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productIds.map((pid) => {
                const rows = lines.filter((l) => l.productId === pid)
                const isVariantMode = rows.some((l) => l.variantId)
                const head = rows[0]
                return rows.map((l, idx) => (
                  <tr key={l.key} className="align-top">
                    <td className="px-3 py-2">
                      {idx === 0 ? (
                        <div className="flex items-start gap-2">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded border border-border bg-bg">
                            {head.image && <img src={head.image} alt="" className="h-full w-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 max-w-[180px] text-text">{head.title}</p>
                            {productMeta[pid]?.hasVariants && (
                              isVariantMode
                                ? <button type="button" onClick={() => collapseProduct(pid)} className="text-xs text-brand hover:underline">{t('promotions.allVariations')}</button>
                                : <button type="button" onClick={() => setExpandId(pid)} className="text-xs text-brand hover:underline">{t('promotions.perVariation')}</button>
                            )}
                          </div>
                        </div>
                      ) : null}
                      {l.variantId && <span className="ml-11 text-xs text-muted">{l.variantLabel}</span>}
                    </td>
                    <td className="px-3 py-2 text-muted">{l.originalPriceUzs.toLocaleString('ru-RU')}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <div className="flex overflow-hidden rounded border border-border-strong">
                          <button type="button" onClick={() => update(l.key, { discountType: 'percent' })} className={`px-2 py-1 text-xs ${l.discountType === 'percent' ? 'bg-brand text-white' : 'text-muted'}`}>%</button>
                          <button type="button" onClick={() => update(l.key, { discountType: 'fixed' })} className={`px-2 py-1 text-xs ${l.discountType === 'fixed' ? 'bg-brand text-white' : 'text-muted'}`}>soʻm</button>
                        </div>
                        <Input type="number" min="0" value={l.value} onChange={(e) => update(l.key, { value: e.target.value })} className="w-20" />
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-brand">{l.value ? newPrice(l).toLocaleString('ru-RU') : '—'}</td>
                    <td className="px-3 py-2"><Input type="number" min="1" value={l.promoStock} onChange={(e) => update(l.key, { promoStock: e.target.value })} className="w-20" placeholder="∞" /></td>
                    <td className="px-3 py-2"><Input type="number" min="1" value={l.perOrderLimit} onChange={(e) => update(l.key, { perOrderLimit: e.target.value })} className="w-20" placeholder="∞" /></td>
                    <td className="px-3 py-2">{idx === 0 && <button type="button" onClick={() => removeProduct(pid)} className="text-xs text-error hover:underline">{t('promotions.delete')}</button>}</td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      )}

      {expandId && <VariationLoader productId={expandId} onLoaded={(rows) => onVariationsLoaded(expandId, rows)} />}
      <PromotionProductPicker open={pickerOpen} existingIds={productIds} onClose={() => setPickerOpen(false)} onConfirm={addProducts} />
    </div>
  )
}
