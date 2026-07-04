import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import type { TransactionStatus, WalletTransaction } from '../types/finance.types'

type Props = { items: WalletTransaction[]; isLoading: boolean; total: number; totalAmountUzs: number }

function statusTone(s: TransactionStatus): 'success' | 'warning' | 'error' {
  if (s === 'completed') return 'success'
  if (s === 'pending') return 'warning'
  return 'error'
}

function fmtTimestamp(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function TransactionTable({ items, isLoading, total, totalAmountUzs }: Props) {
  const { t } = useTranslation()

  return (
    <div>
      {/* Count row */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-sm font-semibold text-text">
          {t('finance.txTable.count', { count: total, amount: formatUZS(totalAmountUzs) })}
        </span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder={t('finance.txTable.searchPlaceholder')}
              className="h-9 rounded-full border border-border-strong bg-surface pl-3 pr-8 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute right-2.5 top-2.5 text-muted" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <button type="button" className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-4 py-1.5 text-sm font-semibold text-text-secondary hover:bg-bg">
            {t('finance.txTable.export')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={t('finance.txTable.empty')}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('finance.txTable.col.dateTime')}</Th>
              <Th>{t('finance.txTable.col.description')}</Th>
              <Th>{t('finance.txTable.col.txId')}</Th>
              <Th className="text-right">{t('finance.txTable.col.amount')}</Th>
              <Th>{t('finance.txTable.col.status')}</Th>
            </Tr>
          </thead>
          <tbody>
            {items.map((tx) => (
              <Tr key={tx.id} className="hover:bg-bg/50">
                <Td className="whitespace-nowrap text-xs text-muted">{fmtTimestamp(tx.createdAt)}</Td>
                <Td>
                  <div className="text-sm font-medium text-text">{tx.description}</div>
                  {tx.orderId && (
                    <Link to={`/orders/${tx.orderId}`} className="text-xs text-brand hover:underline">
                      {tx.orderId}
                    </Link>
                  )}
                </Td>
                <Td>
                  <Link to={`/finance/balance/transaction/${tx.id}`} className="text-xs text-brand hover:underline">
                    {tx.txnId ?? tx.id}
                  </Link>
                </Td>
                <Td className={`text-right font-semibold ${tx.amountUzs >= 0 ? 'text-success' : 'text-error-text'}`}>
                  {tx.amountUzs >= 0 ? '+' : '–'}{formatUZS(Math.abs(tx.amountUzs))}
                </Td>
                <Td>
                  <Badge tone={statusTone(tx.status)}>
                    {t(`finance.txTable.txStatus.${tx.status}`)}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
