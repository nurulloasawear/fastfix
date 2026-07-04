import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { FormField, SelectField, TextField } from '@/features/products'

export interface Parcel {
  w: string
  l: string
  h: string
}

interface Props {
  weight: string
  setWeight: (v: string) => void
  parcel: Parcel
  setParcel: (fn: (p: Parcel) => Parcel) => void
  homeDelivery: boolean
  setHomeDelivery: (v: boolean) => void
  preOrder: boolean
  setPreOrder: (v: boolean) => void
  daysToShip: string
  setDaysToShip: (v: string) => void
  parentSku: string
  setParentSku: (v: string) => void
}

const card = 'flex flex-col gap-4 p-6'

export function ShippingOthersFields(p: Props) {
  const { t } = useTranslation()

  return (
    <>
      <Card className={card}>
        <h2 className="text-base font-semibold text-text">{t('products.add_page.shipping')}</h2>
        <FormField label={t('products.add_page.weight')}>
          <TextField value={p.weight} onChange={(e) => p.setWeight(e.target.value)} placeholder={t('products.add_page.weightPh')} />
        </FormField>
        <FormField label={t('products.add_page.parcel')}>
          <div className="flex items-center gap-2">
            <TextField value={p.parcel.w} onChange={(e) => p.setParcel((c) => ({ ...c, w: e.target.value }))} placeholder="W" />
            <span className="text-muted">×</span>
            <TextField value={p.parcel.l} onChange={(e) => p.setParcel((c) => ({ ...c, l: e.target.value }))} placeholder="L" />
            <span className="text-muted">×</span>
            <TextField value={p.parcel.h} onChange={(e) => p.setParcel((c) => ({ ...c, h: e.target.value }))} placeholder="H" />
          </div>
        </FormField>
        <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
          <div>
            <div className="text-sm font-semibold text-text">{t('products.add_page.homeDelivery')}</div>
            <p className="text-xs text-muted">{t('products.add_page.homeDeliveryHint')}</p>
          </div>
          <input type="checkbox" checked={p.homeDelivery} onChange={(e) => p.setHomeDelivery(e.target.checked)} className="accent-brand" />
        </label>
      </Card>

      <Card className={card}>
        <h2 className="text-base font-semibold text-text">{t('products.add_page.others')}</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-semibold text-text-secondary">{t('products.add_page.preOrder')}</span>
          <label className="flex items-center gap-2">
            <input type="radio" checked={!p.preOrder} onChange={() => p.setPreOrder(false)} className="accent-brand" /> {t('products.add_page.no')}
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={p.preOrder} onChange={() => p.setPreOrder(true)} className="accent-brand" /> {t('products.add_page.yes')}
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-text">
          <span>{t('products.add_page.shipMe')}</span>
          <input
            value={p.daysToShip}
            onChange={(e) => p.setDaysToShip(e.target.value)}
            inputMode="numeric"
            className="h-11 w-16 rounded-lg border border-border-strong bg-surface px-2 text-center outline-none transition focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
          />
          <span className="text-muted">{t('products.add_page.shipWithin')}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label={t('products.add_page.condition')} value="New" placeholder={t('products.add_page.choose')} />
          <FormField label={t('products.add_page.parentSku')}>
            <TextField value={p.parentSku} onChange={(e) => p.setParentSku(e.target.value)} placeholder={t('products.add_page.parentSku')} />
          </FormField>
        </div>
      </Card>
    </>
  )
}
