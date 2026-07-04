import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import type { IncomeItem, IncomeStatus } from '../types/finance.types'

type Props = { items: IncomeItem[]; isLoading: boolean }

function statusTone(s: IncomeStatus): 'success' | 'warning' | 'error' | 'gray' {
  if (s === 'released') return 'success'
  if (s === 'pending') return 'warning'
  if (s === 'cancelled') return 'error'
  return 'gray'
}

export function IncomeDetailsTable({ items, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('finance.incomeDetails.empty')}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        }
      />
    )
  }

  return (
    <Table>
      <thead>
        <Tr>
          <Th>{t('finance.incomeDetails.col.order')}</Th>
          <Th>{t('finance.incomeDetails.col.releasedOn')}</Th>
          <Th>{t('finance.incomeDetails.col.status')}</Th>
          <Th>{t('finance.incomeDetails.col.paymentMethod')}</Th>
          <Th className="text-right">{t('finance.incomeDetails.col.releasedAmount')}</Th>
        </Tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <Tr key={item.id} className="hover:bg-bg/50">
            <Td className="font-medium">{item.orderId}</Td>
            <Td className="text-muted">{item.releasedAt ?? '—'}</Td>
            <Td>
              <Badge tone={statusTone(item.status)}>
                {t(`finance.incomeDetails.status.${item.status}`)}
              </Badge>
            </Td>
            <Td className="text-text-secondary">
              {t(`finance.incomeDetails.method.${item.paymentMethod}`)}
            </Td>
            <Td className="text-right font-semibold text-success">
              +{formatUZS(item.releasedAmountUzs)}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
