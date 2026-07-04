import { Badge } from '@/components/ui/Badge'
import type { PromotionStatus } from '../types/live.types'
import { useTranslation } from 'react-i18next'
import type { ComponentProps } from 'react'

type Tone = ComponentProps<typeof Badge>['tone']

const STATUS_TONE: Record<PromotionStatus, Tone> = {
  upcoming: 'info',
  active: 'success',
  ended: 'gray',
  cancelled: 'error',
}

export function PromotionStatusBadge({ status }: { status: PromotionStatus }) {
  const { t } = useTranslation()
  const labelMap: Record<PromotionStatus, string> = {
    upcoming: t('live.streamingPrice.statusUpcoming'),
    active: t('live.streamingPrice.statusActive'),
    ended: t('live.streamingPrice.statusEnded'),
    cancelled: t('live.streamingPrice.statusCancelled'),
  }
  return <Badge tone={STATUS_TONE[status]}>{labelMap[status]}</Badge>
}
