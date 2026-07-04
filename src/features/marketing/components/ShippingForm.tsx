import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { useSaveMarketingShipping } from '../api/marketing.queries'
import { SHIPPING_REGIONS, type MarketingShipping, type ShippingRegion } from '../types/marketing.types'

type Props = { initial: MarketingShipping }

export function ShippingForm({ initial }: Props) {
  const { t } = useTranslation()
  const save = useSaveMarketingShipping()
  const [active, setActive] = useState(initial.freeShippingActive)
  const [minOrder, setMinOrder] = useState(String(initial.minOrderUzs))
  const [region, setRegion] = useState<ShippingRegion>(initial.region)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save.mutate({ freeShippingActive: active, minOrderUzs: Number(minOrder) || 0, region })
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={onSubmit} className="space-y-6 p-6">
        {save.isSuccess && (
          <div className="rounded-lg border border-success bg-success-bg p-3 text-sm font-medium text-success">
            {t('marketing.shipping.saved')}
          </div>
        )}

        {/* Toggle row */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-text">{t('marketing.shipping.toggleLabel')}</span>
            <p className="text-xs text-muted">{t('marketing.shipping.toggleHint')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => setActive((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${active ? 'bg-brand' : 'bg-border-strong'}`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-6' : 'left-1'}`}
            />
          </button>
        </div>

        {active && (
          <div className="space-y-4">
            <Input
              label={t('marketing.shipping.minOrder')}
              hint={t('marketing.shipping.minOrderHint')}
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              inputMode="numeric"
              required
            />

            <Select
              label={t('marketing.shipping.region')}
              value={region}
              onChange={(e) => setRegion(e.target.value as ShippingRegion)}
            >
              {SHIPPING_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {t(`marketing.shipping.regionOpt.${r}`)}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <Button type="submit" disabled={save.isPending} className="w-full">
            {save.isPending
              ? <><Spinner className="h-4 w-4" /> {t('marketing.shipping.saving')}</>
              : t('marketing.shipping.save')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
