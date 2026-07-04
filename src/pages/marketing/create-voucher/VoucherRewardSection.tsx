import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { DiscountType } from '@/features/marketing'

type Props = {
  discountType: DiscountType; onDiscountType: (v: DiscountType) => void
  discountValue: string; onDiscountValue: (v: string) => void
  minBasket: string; onMinBasket: (v: string) => void
  usageQty: string; onUsageQty: (v: string) => void
  usagePerBuyer: string; onUsagePerBuyer: (v: string) => void
  isFollowPrize: boolean
}

export function VoucherRewardSection({
  discountType, onDiscountType, discountValue, onDiscountValue,
  minBasket, onMinBasket, usageQty, onUsageQty,
  usagePerBuyer, onUsagePerBuyer, isFollowPrize,
}: Props) {
  const { t } = useTranslation()

  return (
    <Card className="p-6">
      <h2 className="mb-5 text-base font-semibold text-text">
        {t('marketing.vouchers.create_form.rewardSection')}
      </h2>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-text-secondary">
          {t('marketing.vouchers.create_form.rewardType')}
        </label>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="radio" name="reward" defaultChecked className="accent-brand" />
            <span className="text-text">{t('marketing.vouchers.create_form.rewardDiscount')}</span>
          </label>
          <label className="flex cursor-not-allowed items-center gap-1.5 opacity-50">
            <input type="radio" name="reward" disabled className="accent-brand" />
            <span className="text-muted">{t('marketing.vouchers.create_form.rewardPoints')}</span>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label={t('marketing.vouchers.create_form.discountTypeAmount')}
          value={discountType}
          onChange={(e) => onDiscountType(e.target.value as DiscountType)}
        >
          <option value="fixed">{t('marketing.vouchers.create_form.fixAmount')}</option>
          <option value="percent">{t('marketing.vouchers.create_form.percent')}</option>
        </Select>

        <Input
          label=" "
          type="number"
          value={discountValue}
          onChange={(e) => onDiscountValue(e.target.value)}
          placeholder="0"
          trailing={<span className="text-xs text-muted">{discountType === 'fixed' ? 'soʻm' : '%'}</span>}
          min="0"
          required
        />

        <Input
          label={t('marketing.vouchers.create_form.minBasket')}
          type="number"
          value={minBasket}
          onChange={(e) => onMinBasket(e.target.value)}
          placeholder="0"
          trailing={<span className="text-xs text-muted">soʻm</span>}
          min="0"
        />

        <div>
          <Input
            label={t('marketing.vouchers.create_form.usageQty')}
            type="number"
            value={usageQty}
            onChange={(e) => onUsageQty(e.target.value)}
            placeholder="0"
            min="0"
          />
          <p className="mt-1 text-xs text-muted">{t('marketing.vouchers.create_form.usageQtyHint')}</p>
        </div>

        {!isFollowPrize && (
          <Input
            label={t('marketing.vouchers.create_form.usagePerBuyer')}
            type="number"
            value={usagePerBuyer}
            onChange={(e) => onUsagePerBuyer(e.target.value)}
            min="1"
          />
        )}
      </div>
    </Card>
  )
}
