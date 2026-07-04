import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { TicketIcon } from '@/features/marketing'
import type { VoucherType } from '@/features/marketing'

const ALL_TYPES: VoucherType[] = [
  'shop', 'product', 'private', 'live', 'video', 'new_buyer', 'repeat_buyer', 'follow_prize',
]

type Props = {
  value: VoucherType
  onChange: (t: VoucherType) => void
}

export function VoucherTypeSelector({ value, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-base font-semibold text-text">
        {t('marketing.vouchers.create_form.voucherType')}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ALL_TYPES.map((type) => {
          const active = value === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors ${
                active
                  ? 'border-brand bg-accent/30'
                  : 'border-border bg-bg hover:border-brand hover:bg-surface'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${active ? 'bg-brand text-white' : 'bg-accent text-brand'}`}>
                <TicketIcon size={14} />
              </div>
              <p className="text-xs font-semibold text-text leading-snug">
                {t(`marketing.vouchers.type.${type}`)}
              </p>
              {active && <Badge tone="info" className="self-start text-xs">Selected</Badge>}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-muted">{t(`marketing.vouchers.typeDesc.${value}`)}</p>
    </Card>
  )
}
