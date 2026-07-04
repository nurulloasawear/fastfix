// Identity Verification panel — read-only, shows KYC status badge + fields.
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { ShopKyc } from '../types/shop.types'

type Tone = 'success' | 'warning' | 'error'

const STATUS_TONE: Record<ShopKyc['status'], Tone> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
}

type Props = { kyc: ShopKyc }

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-56 shrink-0 text-sm text-text-secondary">{label}</span>
      <span className="text-sm text-text">{value}</span>
    </div>
  )
}

export function ShopInfoKycPanel({ kyc }: Props) {
  const { t } = useTranslation()

  function fmtDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const statusLabel = t(`shop.shopInfo.kycStatus.${kyc.status}`)
  const tone = STATUS_TONE[kyc.status]
  const sellerTypeLabel = t(`shop.shopInfo.sellerTypeVal.${kyc.sellerType}`)
  const idTypeLabel = t(`shop.shopInfo.idTypeVal.${kyc.idType}`)

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-base font-semibold text-text">
          {t('shop.shopInfo.kycTitle')}
        </h2>
        <Badge tone={tone}>{statusLabel}</Badge>
      </div>

      <div className="space-y-4">
        <Row label={t('shop.shopInfo.submissionTime')} value={fmtDate(kyc.submittedAt)} />
        <Row label={t('shop.shopInfo.verificationMethod')} value={kyc.verificationMethod} />
        <Row label={t('shop.shopInfo.sellerType')} value={sellerTypeLabel} />
        <Row label={t('shop.shopInfo.fullName')} value={kyc.fullName} />
        <Row label={t('shop.shopInfo.idType')} value={idTypeLabel} />
        <Row
          label={t('shop.shopInfo.idLastFour')}
          value={kyc.idLastFour}
        />
        <Row label={t('shop.shopInfo.address')} value={kyc.addressMasked} />
      </div>
    </Card>
  )
}
