import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import type { Voucher } from '../types/marketing.types'
import { Trash2, TicketIcon } from './icons'

type Props = {
  vouchers: Voucher[]
  isLoading: boolean
  deletingId?: string
  onDelete: (id: string) => void
}

export function VoucherTable({ vouchers, isLoading, deletingId, onDelete }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }
  if (vouchers.length === 0) {
    return (
      <EmptyState
        icon={<TicketIcon size={24} />}
        title={t('marketing.vouchers.empty')}
      />
    )
  }

  return (
    <Table>
      <thead>
        <Tr>
          <Th>{t('marketing.vouchers.col.nameCode')}</Th>
          <Th>{t('marketing.vouchers.col.type')}</Th>
          <Th>{t('marketing.vouchers.col.discountAmount')}</Th>
          <Th>{t('marketing.vouchers.col.claimPeriod')}</Th>
          <Th>{t('marketing.vouchers.col.action')}</Th>
        </Tr>
      </thead>
      <tbody>
        {vouchers.map((v) => (
          <Tr key={v.id}>
            <Td>
              <p className="font-medium text-text">{v.name}</p>
              <p className="font-mono text-xs text-muted">{v.code}</p>
            </Td>
            <Td className="text-text-secondary">
              {t(`marketing.vouchers.type.${v.type}`)}
            </Td>
            <Td className="font-semibold text-success">
              {v.discountType === 'fixed' ? formatUZS(v.discountValue) : `${v.discountValue}%`}
            </Td>
            <Td className="text-xs text-muted">
              {v.claimStart} — {v.claimEnd}
            </Td>
            <Td>
              <div className="flex flex-col items-start gap-1.5">
                <Badge tone={v.status === 'ongoing' || v.status === 'active' ? 'success' : 'gray'}>
                  {t(`marketing.vouchers.status.${v.status}`)}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === v.id}
                  onClick={() => onDelete(v.id)}
                >
                  {deletingId === v.id ? <Spinner className="h-3 w-3" /> : <Trash2 size={13} />}
                  {t('marketing.vouchers.delete')}
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
