import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import type { VoucherType } from '@/features/marketing'

type Props = {
  voucherType: VoucherType
  applicableProducts: 'all' | 'specific'
  onApplicableProducts: (v: 'all' | 'specific') => void
  allProductsForced: boolean
}

export function VoucherDisplaySection({
  voucherType, applicableProducts, onApplicableProducts, allProductsForced,
}: Props) {
  const { t } = useTranslation()

  const showProductScope = !['shop', 'new_buyer', 'repeat_buyer'].includes(voucherType)

  const displayText =
    voucherType === 'private' ? t('marketing.vouchers.create_form.displayCodeOnly')
    : voucherType === 'live' ? t('marketing.vouchers.create_form.displayLiveOnly')
    : voucherType === 'video' ? t('marketing.vouchers.create_form.displayVideoOnly')
    : null

  return (
    <Card className="p-6">
      <h2 className="mb-5 text-base font-semibold text-text">
        {t('marketing.vouchers.create_form.displaySection')}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-secondary">
            {t('marketing.vouchers.create_form.displaySetting')}
          </label>
          {displayText ? (
            <div className="flex h-11 items-center rounded-lg border border-border bg-bg px-3 text-sm text-text-secondary">
              {displayText}
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="display" defaultChecked className="accent-brand" />
                <span>{t('marketing.vouchers.create_form.displayAllPages')}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="display" className="accent-brand" />
                <span>{t('marketing.vouchers.create_form.displayCodeOnly')}</span>
              </label>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-text-secondary">
            {t('marketing.vouchers.create_form.applicableProducts')}
          </label>
          {allProductsForced ? (
            <div className="flex h-11 items-center rounded-lg border border-border bg-bg px-3 text-sm text-text-secondary">
              {t('marketing.vouchers.create_form.allProducts')}
            </div>
          ) : showProductScope ? (
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="products" checked={applicableProducts === 'all'} onChange={() => onApplicableProducts('all')} className="accent-brand" />
                <span>{t('marketing.vouchers.create_form.allProducts')}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="products" checked={applicableProducts === 'specific'} onChange={() => onApplicableProducts('specific')} className="accent-brand" />
                <span>{t('marketing.vouchers.create_form.specificProducts')}</span>
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
