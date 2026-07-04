import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { Plus, ZapIcon } from '@/features/marketing'
import { formatUZS } from '@/utils/money'

export type ProductRow = {
  id: string
  name: string
  originalPriceUzs: number
  promoPriceUzs: string
  promoStock: string
}

type Props = {
  products: ProductRow[]
  timeSlotSelected: boolean
  onAdd: () => void
  onRemove: (id: string) => void
  onUpdate: (id: string, field: 'promoPriceUzs' | 'promoStock', val: string) => void
}

export function FlashDealProductTable({ products, timeSlotSelected, onAdd, onRemove, onUpdate }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-text">{t('marketing.flashDeals.form.products')}</h2>
          <p className="mt-0.5 text-xs text-muted">{t('marketing.flashDeals.form.productsHint')}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onAdd} disabled={!timeSlotSelected}>
          <Plus size={15} />
          {t('marketing.flashDeals.form.addProducts')}
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<ZapIcon size={24} />}
          title={t('marketing.flashDeals.empty')}
          action={
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline" onClick={onAdd} disabled={!timeSlotSelected}>
                <Plus size={16} />
                {t('marketing.flashDeals.form.addProducts')}
              </Button>
              {!timeSlotSelected && (
                <p className="text-xs text-warning">{t('marketing.flashDeals.form.selectTimeSlot')} first</p>
              )}
            </div>
          }
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('common.product') || 'Product'}</Th>
              <Th>{t('marketing.flashDeals.colFlashPrice')}</Th>
              <Th>{t('marketing.flashDeals.colPromoStock')}</Th>
              <Th>Discount</Th>
              <Th>{t('marketing.flashDeals.colActions')}</Th>
            </Tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const promoPrice = Number(p.promoPriceUzs)
              const discountPct = promoPrice > 0 ? Math.round((1 - promoPrice / p.originalPriceUzs) * 100) : 0
              const discountValid = discountPct >= 1 && discountPct <= 99
              const priceError = promoPrice >= p.originalPriceUzs && promoPrice > 0 ? 'Must be lower' : undefined
              const stockError = Number(p.promoStock) > 999 ? 'Max 999' : undefined

              return (
                <Tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-md border border-border bg-bg" />
                      <div>
                        <p className="font-medium text-text">{p.name}</p>
                        <p className="text-xs text-muted">{formatUZS(p.originalPriceUzs)}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={p.promoPriceUzs}
                      onChange={(e) => onUpdate(p.id, 'promoPriceUzs', e.target.value)}
                      placeholder="0"
                      className="w-36"
                      min="0"
                      trailing={<span className="text-xs text-muted">soʻm</span>}
                      error={priceError}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={p.promoStock}
                      onChange={(e) => onUpdate(p.id, 'promoStock', e.target.value)}
                      placeholder="1"
                      className="w-24"
                      min="1"
                      max="999"
                      error={stockError}
                    />
                  </Td>
                  <Td>
                    {discountPct > 0
                      ? <Badge tone={discountValid ? 'success' : 'error'}>-{discountPct}%</Badge>
                      : <span className="text-xs text-muted">—</span>}
                  </Td>
                  <Td>
                    <Button variant="destructive" size="sm" onClick={() => onRemove(p.id)}>
                      {t('common.remove') || 'Remove'}
                    </Button>
                  </Td>
                </Tr>
              )
            })}
          </tbody>
        </Table>
      )}
    </Card>
  )
}
