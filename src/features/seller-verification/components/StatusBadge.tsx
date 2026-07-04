import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'

type BadgeableStatus =
  | 'idle'
  | 'unverified'
  | 'otp_sent'
  | 'pending'
  | 'processing'
  | 'verified'
  | 'approved'
  | 'rejected'

const TONES = {
  idle: 'gray',
  unverified: 'gray',
  otp_sent: 'warning',
  pending: 'warning',
  processing: 'info',
  verified: 'success',
  approved: 'success',
  rejected: 'error',
} as const

// idle / otp_sent are transport states — show them as their user-facing phase.
const LABEL_KEYS: Record<BadgeableStatus, string> = {
  idle: 'sellerVerification.status.unverified',
  unverified: 'sellerVerification.status.unverified',
  otp_sent: 'sellerVerification.status.pending',
  pending: 'sellerVerification.status.pending',
  processing: 'sellerVerification.status.processing',
  verified: 'sellerVerification.status.verified',
  approved: 'sellerVerification.status.approved',
  rejected: 'sellerVerification.status.rejected',
}

export function StatusBadge({ status }: { status: BadgeableStatus }) {
  const { t } = useTranslation()
  return <Badge tone={TONES[status]}>{t(LABEL_KEYS[status])}</Badge>
}
