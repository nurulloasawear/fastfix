import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatUZS } from '@/utils/money'
import { useTransactionDetail } from '@/features/finance'
import type { TransactionStatus, TransactionType } from '@/features/finance'

// Icon per transaction type (inline SVG)
function TxIcon({ type }: { type: TransactionType }) {
  const configs: Record<TransactionType, { bgClass: string; path: string }> = {
    order_income: {
      bgClass: 'bg-[#e0f2fe]',
      path: 'M3 6h8M3 10h5M7 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L7 2z',
    },
    refund: {
      bgClass: 'bg-warning-bg',
      path: 'M4 6h8M4 6l3-3M4 6l3 3M10 12a4 4 0 0 1-4-4',
    },
    withdrawal: {
      bgClass: 'bg-[#eff8ff]',
      path: 'M2 8h10M9 5l3 3-3 3M6 12H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3',
    },
    adjustment: {
      bgClass: 'bg-bg',
      path: 'M8 3l-5 5 2 2 5-5-2-2zm-5 5L2 11h3l1-3z',
    },
    platform_fee: {
      bgClass: 'bg-bg',
      path: 'M8 3l-5 5 2 2 5-5-2-2zm-5 5L2 11h3l1-3z',
    },
  }
  const cfg = configs[type]
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${cfg.bgClass}`}>
      <svg width="24" height="24" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d={cfg.path} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function statusTone(s: TransactionStatus): 'success' | 'warning' | 'error' {
  if (s === 'completed') return 'success'
  if (s === 'pending') return 'warning'
  return 'error'
}

function fmtDatetime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Thin page
export function TransactionDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { data: tx, isLoading } = useTransactionDetail(id)

  return (
    <Page>
      <PageHeader
        title={t('finance.txDetail.breadcrumb')}
        breadcrumb={
          <span>
            <a href="/" className="hover:underline">{t('finance.txDetail.breadcrumbHome')}</a>
            {' › '}
            <Link to="/finance/balance" className="hover:underline">{t('finance.txDetail.breadcrumbBalance')}</Link>
            {' › '}
            {t('finance.txDetail.breadcrumb')}
          </span>
        }
      />

      {isLoading ? (
        <Card className="flex items-center justify-center p-16">
          <Spinner />
        </Card>
      ) : !tx ? (
        <Card className="p-6">
          <EmptyState title={t('finance.txDetail.notFound')} />
        </Card>
      ) : (
        <Card>
          {/* Transaction header */}
          <div className="flex items-start justify-between border-b border-border p-6">
            <div className="flex items-start gap-4">
              <TxIcon type={tx.type} />
              <div>
                <h2 className="text-xl font-bold text-text">
                  {t('finance.txDetail.incomeTitle', { orderId: tx.orderId ?? id })}
                </h2>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge tone={statusTone(tx.status)}>
                    {t(`finance.txDetail.status.${tx.status}`)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${tx.amountUzs >= 0 ? 'text-success' : 'text-error-text'}`}>
                {tx.amountUzs >= 0 ? '+' : '–'}{formatUZS(Math.abs(tx.amountUzs))}
              </p>
              <p className="mt-1 text-sm text-muted">
                {t('finance.txDetail.walletBalance')}{' '}
                <span className="font-medium text-text">{formatUZS(tx.balanceAfterUzs)}</span>
              </p>
            </div>
          </div>

          {/* Detail fields */}
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[180px_1fr] items-center px-6 py-3">
              <span className="text-sm text-muted">{t('finance.txDetail.createTime')}</span>
              <span className="text-sm text-text">{fmtDatetime(tx.createdAt)}</span>
            </div>

            {tx.buyerUsername && (
              <div className="grid grid-cols-[180px_1fr] items-center px-6 py-3">
                <span className="text-sm text-muted">{t('finance.txDetail.buyer')}</span>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-border text-xs font-semibold text-white">
                    {tx.buyerUsername.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-text">{tx.buyerUsername}</span>
                </div>
              </div>
            )}

            {tx.orderId && (
              <div className="grid grid-cols-[180px_1fr] items-center px-6 py-3">
                <span className="text-sm text-muted">{t('finance.txDetail.orderId')}</span>
                <Link to={`/orders/${tx.orderId}`} className="text-sm font-semibold text-brand hover:underline">
                  {tx.orderId}
                </Link>
              </div>
            )}
          </div>
        </Card>
      )}
    </Page>
  )
}
