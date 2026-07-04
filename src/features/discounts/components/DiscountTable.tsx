import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import type { Discount } from '../types/discounts.types'
import { formatDiscountValue } from './formatValue'
import { DiscountStatusBadge } from './DiscountStatusBadge'
import { Calendar, Edit3, TicketIcon, Trash2 } from './icons'

type Props = {
  discounts: Discount[]
  isLoading: boolean
  onToggle: (id: string) => void
  onEdit: (discount: Discount) => void
  onDelete: (id: string) => void
}

// Desktop table (hidden on small screens — DiscountMobileList covers those).
export function DiscountTable({ discounts, isLoading, onToggle, onEdit, onDelete }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (discounts.length === 0) {
    return (
      <EmptyState
        icon={<TicketIcon size={24} />}
        title={t('discounts.empty.title')}
        description={t('discounts.empty.desc')}
      />
    )
  }

  return (
    <Card className="hidden overflow-hidden md:block">
      <Table>
        <thead>
          <Tr>
            <Th>{t('discounts.col.code')}</Th>
            <Th>{t('discounts.col.type')}</Th>
            <Th>{t('discounts.col.value')}</Th>
            <Th>{t('discounts.col.usage')}</Th>
            <Th>{t('discounts.col.expiry')}</Th>
            <Th>{t('discounts.col.status')}</Th>
            <Th>{t('discounts.col.actions')}</Th>
          </Tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <Tr key={d.id}>
              <Td>
                <span className="rounded-md bg-bg px-2 py-1 font-mono font-semibold text-text">
                  {d.code}
                </span>
              </Td>
              <Td className="text-text-secondary">{t(`discounts.type.${d.type}`)}</Td>
              <Td className="font-medium">{formatDiscountValue(d)}</Td>
              <Td className="text-xs text-muted">
                {d.usageLimit === null
                  ? t('discounts.usage.unlimited', { used: d.usedCount })
                  : t('discounts.usage.used', { used: d.usedCount, limit: d.usageLimit })}
              </Td>
              <Td className="text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-muted" />
                  {d.expiryDate}
                </span>
              </Td>
              <Td>
                <DiscountStatusBadge status={d.status} onClick={() => onToggle(d.id)} />
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(d)}>
                    <Edit3 size={14} /> {t('discounts.actions.edit')}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(d.id)}>
                    <Trash2 size={14} /> {t('discounts.actions.delete')}
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Card>
  )
}
