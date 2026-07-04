import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import type { DiscountStatus } from '../types/discounts.types'

const TONE: Record<DiscountStatus, 'success' | 'warning'> = {
  active: 'success',
  expired: 'warning',
}

const DOT: Record<DiscountStatus, string> = {
  active: 'bg-success',
  expired: 'bg-warning',
}

// Clickable status pill: toggles active ⇄ expired on click.
export function DiscountStatusBadge({
  status,
  onClick,
}: {
  status: DiscountStatus
  onClick: () => void
}) {
  const { t } = useTranslation()
  return (
    <button type="button" onClick={onClick} className="transition-opacity hover:opacity-80">
      <Badge tone={TONE[status]}>
        <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
        {t(`discounts.status.${status}`)}
      </Badge>
    </button>
  )
}
