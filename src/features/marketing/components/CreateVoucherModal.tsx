import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useCreateVoucher } from '../api/marketing.queries'

type Props = { onClose: () => void }

// Legacy quick-create modal (kept for backward compat). Full create flow lives in CreateVoucherPage.
export function CreateVoucherModal({ onClose }: Props) {
  const { t } = useTranslation()
  const create = useCreateVoucher()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [worth, setWorth] = useState('')
  const [minSpend, setMinSpend] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name || !code || !worth) return
    create.mutate(
      {
        type: 'shop',
        name,
        code: code.toUpperCase().trim(),
        discountType: 'fixed',
        discountValue: Number(worth),
        minBasketUzs: minSpend ? Number(minSpend) : 0,
        usageQtyTotal: 100,
        usagePerBuyer: 1,
        claimStart: new Date().toISOString(),
        claimEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        displayEarly: false,
        displayChannel: 'all_pages',
        applicableProducts: 'all',
        productIds: [],
        targetBuyerConfig: {},
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('marketing.vouchers.modal.title')}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('marketing.vouchers.modal.cancel')}
          </Button>
          <Button type="submit" form="create-voucher-modal-form" disabled={create.isPending}>
            {create.isPending
              ? <><Spinner className="h-4 w-4" /> {t('marketing.vouchers.modal.submitting')}</>
              : t('marketing.vouchers.modal.submit')}
          </Button>
        </>
      }
    >
      <form id="create-voucher-modal-form" onSubmit={onSubmit} className="space-y-4">
        <Input
          label={t('marketing.vouchers.modal.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('marketing.vouchers.modal.namePlaceholder')}
          required
        />
        <Input
          label={t('marketing.vouchers.modal.code')}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t('marketing.vouchers.modal.codePlaceholder')}
          className="font-mono font-semibold"
          required
        />
        <Input
          label={t('marketing.vouchers.modal.worth')}
          value={worth}
          onChange={(e) => setWorth(e.target.value)}
          inputMode="numeric"
          placeholder={t('marketing.vouchers.modal.worthPlaceholder')}
          required
        />
        <Input
          label={t('marketing.vouchers.modal.minSpend')}
          value={minSpend}
          onChange={(e) => setMinSpend(e.target.value)}
          inputMode="numeric"
          placeholder={t('marketing.vouchers.modal.minSpendPlaceholder')}
        />
      </form>
    </Modal>
  )
}
