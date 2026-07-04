import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import type { VoucherType, DiscountType } from '@/features/marketing'

type Props = {
  voucherType: VoucherType
  discountType: DiscountType
  discountValue: string
  minBasket: string
  name: string
}

export function VoucherPreviewCard({ voucherType, discountType, discountValue, minBasket, name }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Card className="h-fit p-5">
        <h3 className="mb-4 text-sm font-semibold text-text">Preview</h3>
        <div className="rounded-lg border border-border bg-bg p-4 text-center">
          <p className="mb-2 text-xs text-muted">{t(`marketing.vouchers.typeDesc.${voucherType}`)}</p>
          <div className="rounded-md border border-brand bg-surface p-3">
            <p className="text-sm font-semibold text-brand">
              {discountType === 'fixed' && discountValue
                ? `${Number(discountValue).toLocaleString('ru-RU')} soʻm OFF`
                : discountValue
                ? `${discountValue}% OFF`
                : '—'}
            </p>
            {minBasket && (
              <p className="mt-1 text-xs text-muted">
                Min: {Number(minBasket).toLocaleString('ru-RU')} soʻm
              </p>
            )}
          </div>
          {name && <p className="mt-3 text-xs font-medium text-text">{name}</p>}
        </div>
      </Card>

      <Card className="h-fit p-5">
        <h3 className="mb-3 text-sm font-semibold text-text">
          {t('marketing.vouchers.education.title')}
        </h3>
        <ul className="space-y-1.5 text-xs text-muted">
          <li>• {t('marketing.vouchers.education.link1')}</li>
          <li>• {t('marketing.vouchers.education.link2')}</li>
        </ul>
      </Card>
    </div>
  )
}
