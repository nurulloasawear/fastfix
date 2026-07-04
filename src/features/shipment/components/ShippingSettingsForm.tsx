import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import { useUpdateShippingSettings } from '../api/shipment.queries'
import type { ShippingSettings } from '../types/shipment.types'
import { Toggle } from './Toggle'
import { WarehouseIcon } from './icons'

type Props = { settings: ShippingSettings }

export function ShippingSettingsForm({ settings }: Props) {
  const { t } = useTranslation()
  const update = useUpdateShippingSettings()
  const [form, setForm] = useState<ShippingSettings>(settings)
  const [success, setSuccess] = useState(false)

  function setWarehouse(warehouseAddress: string) {
    setForm((prev) => ({ ...prev, warehouseAddress }))
    setSuccess(false)
  }

  function toggleCourier(id: string, enabled: boolean) {
    setForm((prev) => ({
      ...prev,
      couriers: prev.couriers.map((c) => (c.id === id ? { ...c, enabled } : c)),
    }))
    setSuccess(false)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    update.mutate(form, { onSuccess: () => setSuccess(true) })
  }

  return (
    <Card className="max-w-2xl p-6">
      {success && (
        <div className="mb-5 rounded-lg border border-border bg-success-bg p-3 text-sm font-medium text-success">
          {t('shipment.settings.success')}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
            <WarehouseIcon size={14} className="text-muted" />
            {t('shipment.settings.warehouse')}
          </label>
          <Textarea
            rows={3}
            value={form.warehouseAddress}
            onChange={(e) => setWarehouse(e.target.value)}
            required
            className="resize-none"
          />
        </div>

        <div className="space-y-4 border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-text">{t('shipment.settings.couriers')}</h3>
          {form.couriers.map((courier) => (
            <div
              key={courier.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-text">{courier.name}</p>
                <p className="text-xs text-muted">{courier.description}</p>
              </div>
              <Toggle
                checked={courier.enabled}
                onChange={(v) => toggleCourier(courier.id, v)}
                label={courier.name}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-5">
          <Button type="submit" disabled={update.isPending} className="w-full">
            {update.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4" />
                {t('shipment.settings.saving')}
              </span>
            ) : (
              t('shipment.settings.save')
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
