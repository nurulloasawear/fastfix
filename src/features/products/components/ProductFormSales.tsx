// SalesSection — variations, SKU table, wholesale tiers.
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/Input'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { uploadProductFile } from '../api/products.api'
import { Plus, Trash2, ImagePlus, X } from './icons'
import { SectionBlock } from './ProductFormShared'
import { onImgError } from './ProductFormBasic'
import type { ProductFormData, SkuRow, VariationGroup, WholesaleTier } from '../types/products.types'

// Per-variation image cell — uploads to R2 and stores the SKU's image_url.
function VariantImageCell({ url, onSet }: { url?: string; onSet: (u: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  async function pick(file?: File | null) {
    if (!file) return
    setBusy(true)
    try { onSet(await uploadProductFile(file, 'product')) }
    catch { /* surfaced elsewhere */ }
    finally { setBusy(false); if (ref.current) ref.current.value = '' }
  }
  return (
    <div className="relative h-14 w-[42px]">
      {url ? (
        <div className="relative h-full w-full overflow-hidden rounded border border-border">
          <img src={url} alt="" className="h-full w-full object-cover" onError={onImgError} />
          <button type="button" onClick={() => onSet('')} className="absolute right-0 top-0 rounded-bl bg-white/80 p-0.5 text-error"><X size={9} /></button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={busy}
          className="flex h-full w-full items-center justify-center rounded border-2 border-dashed border-border text-muted hover:border-brand disabled:opacity-50">
          {busy ? '…' : <ImagePlus size={14} />}
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => void pick(e.target.files?.[0])} />
    </div>
  )
}

type Props = {
  form: ProductFormData
  onVariationGroupUpdate: (idx: number, patch: Partial<VariationGroup>) => void
  onVariationGroupRemove: (idx: number) => void
  onAddVariationGroup: () => void
  onSkuUpdate: (idx: number, patch: Partial<SkuRow>) => void
  onTierUpdate: (idx: number, patch: Partial<WholesaleTier>) => void
  onTierRemove: (idx: number) => void
  onAddTier: () => void
  onUpdate: <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => void
}

export function SalesSection({
  form, onVariationGroupUpdate, onVariationGroupRemove, onAddVariationGroup,
  onSkuUpdate, onTierUpdate, onTierRemove, onAddTier, onUpdate,
}: Props) {
  const { t } = useTranslation()
  const locked = !(form.categoryId || form.category)

  return (
    <SectionBlock title={t('products.add_page.salesInfo')} locked={locked}>
      {/* Variation groups */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-text">{t('products.add_page.variations')}</h3>
        {form.variations.map((g, idx) => (
          <div key={idx} className="mb-3 rounded-lg border border-border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Input type="text" placeholder={t('products.add_page.variationGroupName')} value={g.name}
                onChange={(e) => onVariationGroupUpdate(idx, { name: e.target.value })}
                className="flex-1" />
              <button type="button" onClick={() => onVariationGroupRemove(idx)} className="text-error hover:opacity-70">
                <Trash2 size={16} />
              </button>
            </div>
            <Input type="text" placeholder={t('products.add_page.variationOptions')}
              value={g.options.join(', ')}
              onChange={(e) => onVariationGroupUpdate(idx, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
          </div>
        ))}
        {form.variations.length < 2 && (
          <button type="button" onClick={onAddVariationGroup}
            className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-accent">
            <Plus size={14} /> {t('products.add_page.addVariationGroup')}
          </button>
        )}
      </div>

      {/* SKU table */}
      {form.skus.length > 0 && (
        <div className="mb-6">
          <Table>
            <thead>
              <Tr>
                {form.variations[0] && <Th>{form.variations[0].name || t('products.add_page.skuTableVar1')}</Th>}
                {form.variations[1] && <Th>{form.variations[1].name || t('products.add_page.skuTableVar2')}</Th>}
                {form.variations.length > 0 && <Th>{t('products.add_page.variantImage')}</Th>}
                <Th>{t('products.add_page.skuTablePrice')}</Th>
                <Th>{t('products.add_page.skuTableStock')}</Th>
                <Th>{t('products.add_page.skuTableSku')}</Th>
                <Th>{t('products.add_page.skuTableAvailable')}</Th>
              </Tr>
            </thead>
            <tbody>
              {form.skus.map((sku, idx) => (
                <Tr key={idx}>
                  {form.variations[0] && <Td className="text-muted">{sku.variation1}</Td>}
                  {form.variations[1] && <Td className="text-muted">{sku.variation2}</Td>}
                  {form.variations.length > 0 && (
                    <Td>
                      <VariantImageCell url={sku.imageUrl} onSet={(u) => onSkuUpdate(idx, { imageUrl: u })} />
                    </Td>
                  )}
                  <Td>
                    <Input type="number" min="100" placeholder="0" value={sku.priceUzs}
                      onChange={(e) => onSkuUpdate(idx, { priceUzs: e.target.value })}
                      className="w-24" />
                  </Td>
                  <Td>
                    <Input type="number" min="0" placeholder="0" value={sku.stock}
                      onChange={(e) => onSkuUpdate(idx, { stock: e.target.value })}
                      className="w-20" />
                  </Td>
                  <Td>
                    <Input type="text" value={sku.sellerSku}
                      onChange={(e) => onSkuUpdate(idx, { sellerSku: e.target.value })}
                      className="w-24" />
                  </Td>
                  <Td>
                    <input type="checkbox" checked={sku.available}
                      onChange={(e) => onSkuUpdate(idx, { available: e.target.checked })} className="rounded" />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Wholesale */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">
          <input type="checkbox" checked={form.wholesaleEnabled}
            onChange={(e) => onUpdate('wholesaleEnabled', e.target.checked)} className="rounded" />
          {t('products.add_page.wholesaleToggle')}
        </label>
        {form.wholesaleEnabled && (
          <div>
            {form.wholesaleTiers.map((tier, idx) => (
              <div key={idx} className="mb-2 flex items-center gap-2">
                <Input type="number" placeholder={t('products.add_page.wholesaleMinQty')} value={tier.minQty}
                  onChange={(e) => onTierUpdate(idx, { minQty: e.target.value })}
                  className="w-20" />
                <span className="text-muted">—</span>
                <Input type="number" placeholder={t('products.add_page.wholesaleMaxQty')} value={tier.maxQty}
                  onChange={(e) => onTierUpdate(idx, { maxQty: e.target.value })}
                  className="w-20" />
                <Input type="number" placeholder={t('products.add_page.wholesalePrice')} value={tier.priceUzs}
                  onChange={(e) => onTierUpdate(idx, { priceUzs: e.target.value })}
                  className="w-24" />
                <button type="button" onClick={() => onTierRemove(idx)} className="text-error hover:opacity-70 transition-opacity"><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={onAddTier}
              className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-accent">
              <Plus size={14} /> {t('products.add_page.addTier')}
            </button>
          </div>
        )}
      </div>
    </SectionBlock>
  )
}
