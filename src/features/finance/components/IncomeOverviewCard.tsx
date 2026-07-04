import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { formatUZS } from '@/utils/money'
import type { IncomeOverview } from '../types/finance.types'

type Props = { overview: IncomeOverview | undefined; isLoading: boolean }

export function IncomeOverviewCard({ overview, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-10">
        <Spinner />
      </Card>
    )
  }

  const ov: IncomeOverview = overview ?? {
    pendingTotalUzs: 0,
    releasedWeekUzs: 0,
    releasedMonthUzs: 0,
    releasedTotalUzs: 0,
    lifetimeRefundedUzs: 0,
    maskedBankAccount: '',
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-5 pt-4 pb-1">
        <h2 className="text-base font-semibold text-text">{t('finance.incomeOverview.title')}</h2>
      </div>

      {/* Info banner */}
      <div className="mx-5 mb-3 flex items-start gap-2 rounded-lg border border-border bg-bg px-3 py-2.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-brand" aria-hidden="true">
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
          <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <p className="text-xs text-text-secondary">{t('finance.incomeOverview.banner')}</p>
      </div>

      {/* Two-pane row */}
      <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
        {/* Pending pane */}
        <div className="px-5 py-4">
          <p className="mb-2 text-sm font-medium text-text-secondary">{t('finance.incomeOverview.pending')}</p>
          <div>
            <span className="text-xs uppercase tracking-wide text-muted">{t('finance.incomeOverview.total')}</span>
            <p className="text-xl font-semibold text-text">{formatUZS(ov.pendingTotalUzs)}</p>
          </div>
        </div>
        {/* Released pane */}
        <div className="px-5 py-4">
          <p className="mb-2 text-sm font-medium text-text-secondary">{t('finance.incomeOverview.released')}</p>
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="text-xs uppercase tracking-wide text-muted">{t('finance.incomeOverview.thisWeek')}</span>
              <p className="text-base font-semibold text-text">{formatUZS(ov.releasedWeekUzs)}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-muted">{t('finance.incomeOverview.thisMonth')}</span>
              <p className="text-base font-semibold text-text">{formatUZS(ov.releasedMonthUzs)}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-muted">{t('finance.incomeOverview.total')}</span>
              <p className="text-base font-semibold text-text">{formatUZS(ov.releasedTotalUzs)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <span className="text-sm text-text-secondary">
          {t('finance.incomeOverview.myBankAccount')}{' '}
          <span className="font-semibold text-text">{ov.maskedBankAccount}</span>
        </span>
        <Link to="/finance/balance" className="text-sm font-semibold text-brand hover:underline">
          {t('finance.incomeOverview.myBalance')} &rsaquo;
        </Link>
      </div>
    </Card>
  )
}
