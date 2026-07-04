import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { PageHeader } from '@/components/ui/PageHeader'
import { ChevronRight, MarketingNav, useCreateVoucher } from '@/features/marketing'
import type { VoucherType, DiscountType } from '@/features/marketing'
import { VoucherTypeSelector } from './create-voucher/VoucherTypeSelector'
import { VoucherBasicSection } from './create-voucher/VoucherBasicSection'
import { VoucherRewardSection } from './create-voucher/VoucherRewardSection'
import { VoucherDisplaySection } from './create-voucher/VoucherDisplaySection'
import { VoucherPreviewCard } from './create-voucher/VoucherPreviewCard'

const AUTO_CODE_TYPES: VoucherType[] = ['live', 'follow_prize']
const CODE_PREFIX = 'OZB'

export function CreateVoucherPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rawType = params.get('type') ?? 'shop'
  const ALL_TYPES: VoucherType[] = ['shop', 'product', 'private', 'live', 'video', 'new_buyer', 'repeat_buyer', 'follow_prize']
  const validInitial: VoucherType = ALL_TYPES.includes(rawType as VoucherType) ? (rawType as VoucherType) : 'shop'

  const createMutation = useCreateVoucher()

  const [voucherType, setVoucherType] = useState<VoucherType>(validInitial)
  const [name, setName] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [discountType, setDiscountType] = useState<DiscountType>('fixed')
  const [discountValue, setDiscountValue] = useState('')
  const [minBasket, setMinBasket] = useState('')
  const [usageQty, setUsageQty] = useState('')
  const [usagePerBuyer, setUsagePerBuyer] = useState('1')
  const [claimStart, setClaimStart] = useState('')
  const [claimEnd, setClaimEnd] = useState('')
  const [displayEarly, setDisplayEarly] = useState(false)
  const [applicableProducts, setApplicableProducts] = useState<'all' | 'specific'>('all')
  const [nameError, setNameError] = useState('')

  const isFollowPrize = voucherType === 'follow_prize'
  const isAutoCode = AUTO_CODE_TYPES.includes(voucherType)

  const CHANNEL_MAP: Record<VoucherType, string> = {
    shop: 'all_pages', product: 'all_pages', new_buyer: 'all_pages', repeat_buyer: 'all_pages',
    private: 'code_only', live: 'live_only', video: 'video_only', follow_prize: 'all_pages',
  }
  const allProductsForced = ['shop', 'new_buyer', 'repeat_buyer'].includes(voucherType)

  function handleTypeChange(t2: VoucherType) {
    setVoucherType(t2)
    setCodeInput('')
    setApplicableProducts('all')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError(t('marketing.vouchers.create_form.voucherName') + ' is required')
      return
    }
    if (!discountValue || Number(discountValue) <= 0) return
    setNameError('')
    createMutation.mutate(
      {
        type: voucherType,
        name: name.trim(),
        code: isAutoCode ? `AUTO_${Date.now()}` : `${CODE_PREFIX}${codeInput}`,
        discountType,
        discountValue: Number(discountValue) || 0,
        minBasketUzs: Number(minBasket) || 0,
        usageQtyTotal: Number(usageQty) || 0,
        usagePerBuyer: Number(usagePerBuyer) || 1,
        claimStart: claimStart || new Date().toISOString(),
        claimEnd: claimEnd || new Date(Date.now() + 30 * 86400000).toISOString(),
        displayEarly,
        displayChannel: CHANNEL_MAP[voucherType],
        applicableProducts: allProductsForced ? 'all' : applicableProducts,
        productIds: [],
        targetBuyerConfig: {},
      },
      { onSuccess: () => navigate('/marketing/vouchers') },
    )
  }

  const showPreview = ['shop', 'product', 'new_buyer', 'repeat_buyer'].includes(voucherType)

  return (
    <Page>
      <PageHeader
        title={t('marketing.vouchers.create_form.title')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span>{t('marketing.vouchers.title')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.vouchers.create_form.title')}</span>
          </span>
        }
      />
      <MarketingNav />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-6">
            <VoucherTypeSelector value={voucherType} onChange={handleTypeChange} />
            <VoucherBasicSection
              voucherType={voucherType}
              name={name} onName={setName} nameError={nameError}
              codeInput={codeInput} onCode={setCodeInput}
              claimStart={claimStart} onClaimStart={setClaimStart}
              claimEnd={claimEnd} onClaimEnd={setClaimEnd}
              displayEarly={displayEarly} onDisplayEarly={setDisplayEarly}
            />
            <VoucherRewardSection
              discountType={discountType} onDiscountType={setDiscountType}
              discountValue={discountValue} onDiscountValue={setDiscountValue}
              minBasket={minBasket} onMinBasket={setMinBasket}
              usageQty={usageQty} onUsageQty={setUsageQty}
              usagePerBuyer={usagePerBuyer} onUsagePerBuyer={setUsagePerBuyer}
              isFollowPrize={isFollowPrize}
            />
            {!isFollowPrize && (
              <VoucherDisplaySection
                voucherType={voucherType}
                applicableProducts={applicableProducts}
                onApplicableProducts={setApplicableProducts}
                allProductsForced={allProductsForced}
              />
            )}
          </div>

          {showPreview && (
            <VoucherPreviewCard
              voucherType={voucherType}
              discountType={discountType}
              discountValue={discountValue}
              minBasket={minBasket}
              name={name}
            />
          )}
        </div>

        <div className="sticky bottom-0 z-10 mt-6 flex justify-end gap-3 border-t border-border bg-bg py-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            {t('marketing.vouchers.create_form.cancel')}
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending
              ? <><Spinner className="h-4 w-4" /> {t('marketing.vouchers.create_form.confirm')}…</>
              : t('marketing.vouchers.create_form.confirm')}
          </Button>
        </div>
      </form>
    </Page>
  )
}
