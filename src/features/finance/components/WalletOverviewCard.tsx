import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { formatUZS } from '@/utils/money'
import type { AccountStatus, WalletOverview } from '../types/finance.types'

type Props = { overview: WalletOverview | undefined; isLoading: boolean }

function accountStatusTone(s: AccountStatus): 'success' | 'warning' | 'error' | 'info' {
  if (s === 'verified' || s === 'checked') return 'success'
  if (s === 'pending') return 'warning'
  return 'error'
}

export function WalletOverviewCard({ overview, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-10">
        <Spinner />
      </Card>
    )
  }

  const ov = overview

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-base font-semibold text-text">{t('finance.walletCard.title')}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Balance + withdraw */}
        <div>
          <span className="text-xs font-medium text-muted">
            {t('finance.walletCard.walletBalance')}
            {' · '}
            {ov?.autoWithdrawalEnabled
              ? t('finance.walletCard.autoWithdrawOn')
              : t('finance.walletCard.autoWithdrawOff')}
          </span>
          <p className="my-2 text-2xl font-bold text-text">{formatUZS(ov?.balanceUzs ?? 0)}</p>
          <Button size="sm">{t('finance.walletCard.withdraw')}</Button>
        </div>

        {/* Bank account */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-text">{t('finance.walletCard.myBankAccount')}</span>
            <Link to="/finance/bank-accounts" className="text-xs font-semibold text-brand hover:underline">
              {t('finance.walletCard.more')} &rsaquo;
            </Link>
          </div>
          {ov?.bankAccount ? (
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold ${ov.bankAccount.status === 'error' ? 'bg-error' : 'bg-success'}`}>
                {ov.bankAccount.status === 'error' ? '✕' : '✓'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text">{ov.bankAccount.name}</span>
                  {ov.bankAccount.isDefault && (
                    <Badge tone="info" className="text-[10px]">{t('finance.walletCard.default')}</Badge>
                  )}
                  <span className="text-sm text-text-secondary">{ov.bankAccount.maskedNumber}</span>
                </div>
                <Badge tone={accountStatusTone(ov.bankAccount.status)} className="mt-1">
                  {t(`finance.walletCard.accountStatus.${ov.bankAccount.status}`)}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">{t('finance.walletCard.noAccount')}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
