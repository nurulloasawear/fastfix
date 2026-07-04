import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Discount } from '../types/discounts.types'
import { formatDiscountValue } from './formatValue'
import { DiscountStatusBadge } from './DiscountStatusBadge'
import { Edit3, Trash2 } from './icons'

type Props = {
  discounts: Discount[]
  onToggle: (id: string) => void
  onEdit: (discount: Discount) => void
  onDelete: (id: string) => void
}

// Card layout for small screens (hidden from md up — DiscountTable covers those).
export function DiscountMobileList({ discounts, onToggle, onEdit, onDelete }: Props) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {discounts.map((d) => (
        <Card key={d.id} className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-bg px-2 py-1 font-mono font-semibold text-text">
              {d.code}
            </span>
            <DiscountStatusBadge status={d.status} onClick={() => onToggle(d.id)} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted">{t('discounts.col.type')}</p>
              <p className="font-medium text-text">{t(`discounts.type.${d.type}`)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">{t('discounts.col.value')}</p>
              <p className="font-semibold text-text">{formatDiscountValue(d)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">{t('discounts.col.usage')}</p>
              <p className="font-medium text-text">
                {d.usageLimit === null
                  ? t('discounts.usage.unlimited', { used: d.usedCount })
                  : t('discounts.usage.used', { used: d.usedCount, limit: d.usageLimit })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">{t('discounts.col.expiry')}</p>
              <p className="font-medium text-text">{d.expiryDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(d)} className="flex-1">
              <Edit3 size={15} /> {t('discounts.actions.edit')}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(d.id)} className="flex-1">
              <Trash2 size={15} /> {t('discounts.actions.delete')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
