import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { DISCOUNT_TYPES, type Discount, type DiscountInput, type DiscountType } from '../types/discounts.types'
import { Dice } from './icons'

type Props = {
  initial?: Discount | null
  todayStr: string
  isPending: boolean
  submitLabel: string
  onSubmit: (input: DiscountInput) => void
  onCancel?: () => void
}

function randomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// Controlled form body shared by the modal and the standalone create page.
export function DiscountForm({ initial, todayStr, isPending, submitLabel, onSubmit, onCancel }: Props) {
  const { t } = useTranslation()
  const [code, setCode] = useState(initial?.code ?? '')
  const [type, setType] = useState<DiscountType>(initial?.type ?? 'percentage')
  const [value, setValue] = useState(
    initial ? String(initial.valuePercent ?? initial.valueUzs ?? '') : '',
  )
  const [limit, setLimit] = useState(initial?.usageLimit != null ? String(initial.usageLimit) : '')
  const [expiry, setExpiry] = useState(initial?.expiryDate ?? '')
  const [error, setError] = useState('')

  const typeItems: TabItem[] = DISCOUNT_TYPES.map((ty) => ({
    key: ty,
    label: ty === 'percentage' ? t('discounts.form.typePercent') : t('discounts.form.typeFixed'),
  }))

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isPending) return
    const num = Number(value)
    if (!code || !value || !expiry || num < 1) return
    if (type === 'percentage' && num > 99) {
      setError(t('discounts.form.maxPercent'))
      return
    }
    onSubmit({
      code: code.toUpperCase().trim(),
      type,
      value: num,
      usageLimit: limit ? Number(limit) : null,
      expiryDate: expiry,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {/* Code field with random generator */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text-secondary">{t('discounts.form.code')}</span>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            placeholder={t('discounts.form.codePh')}
            maxLength={25}
            required
            className="font-mono"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setCode(randomCode())}
            className="shrink-0 whitespace-nowrap"
          >
            <Dice size={16} /> {t('discounts.form.randomShort')}
          </Button>
        </div>
      </label>

      {/* Discount type selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text-secondary">{t('discounts.form.typeLabel')}</span>
        <Tabs
          items={typeItems}
          value={type}
          onChange={(k) => { setType(k as DiscountType); setValue(''); setError('') }}
        />
      </div>

      {/* Value field */}
      <Input
        type="number"
        label={type === 'percentage' ? t('discounts.form.percentLabel') : t('discounts.form.fixedLabel')}
        min={1}
        max={type === 'percentage' ? 99 : undefined}
        value={value}
        onChange={(e) => { setValue(e.target.value); setError('') }}
        placeholder={type === 'percentage' ? t('discounts.form.percentPh') : t('discounts.form.fixedPh')}
        required
        error={error || undefined}
        trailing={
          <span className="text-sm font-semibold text-muted">
            {type === 'percentage' ? '%' : 'soʻm'}
          </span>
        }
        className="font-semibold pr-12"
      />

      {/* Usage limit */}
      <Input
        type="number"
        label={t('discounts.form.limitLabel')}
        min={1}
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        placeholder={t('discounts.form.limitPh')}
      />

      {/* Expiry date */}
      <Input
        type="date"
        label={t('discounts.form.expiryLabel')}
        min={todayStr}
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        required
        className="cursor-pointer"
      />

      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {t('discounts.form.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? <Spinner className="h-4 w-4" /> : null}
          {isPending ? t('discounts.form.submitting') : submitLabel}
        </Button>
      </div>
    </form>
  )
}
