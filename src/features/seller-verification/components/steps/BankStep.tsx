import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { useBankAccount } from '../../api/seller-verification.queries'
import type { BankAccount } from '../../types/seller-verification.types'
import { StatusBadge } from '../StatusBadge'
import { BankForm } from './BankForm'

/** Show only the last 4 digits of a stored card number. */
function maskCardNumber(cardNumber: string): string {
  return `•••• •••• •••• ${cardNumber.replace(/\D/g, '').slice(-4)}`
}

const SUMMARY_FIELDS = [
  'cardHolder',
  'cardNumber',
  'accountNumber',
  'bankName',
  'bankCode',
] as const

function summaryValue(account: BankAccount, field: (typeof SUMMARY_FIELDS)[number]): string {
  return field === 'cardNumber' ? maskCardNumber(account.cardNumber) : account[field]
}

export function BankStep() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useBankAccount()
  const [editing, setEditing] = useState(false)

  if (isLoading) {
    return <CardSkeleton lines={6} />
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-error-text">{t('sellerVerification.loadFailed')}</p>
        <Button variant="outline" size="sm" onClick={() => { void refetch() }}>
          {t('sellerVerification.retry')}
        </Button>
      </div>
    )
  }

  const account = data ?? null

  if (account && !editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-text">{t('sellerVerification.bank.heading')}</h2>
            <StatusBadge status={account.verified ? 'verified' : 'pending'} />
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            {t('sellerVerification.common.edit')}
          </Button>
        </div>

        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SUMMARY_FIELDS.map((field) => (
            <div key={field}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                {t(`sellerVerification.bank.${field}`)}
              </dt>
              <dd className="mt-1 text-sm font-medium text-text">
                {summaryValue(account, field) || t('sellerVerification.common.noData')}
              </dd>
            </div>
          ))}
        </dl>

        {account.verified && (
          <div className="flex items-center gap-2 rounded-lg bg-success-bg p-4">
            <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
            <p className="text-sm font-medium text-success">
              {t('sellerVerification.bank.verified')}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text">{t('sellerVerification.bank.heading')}</h2>
        {!account && (
          <p className="mt-1 text-sm text-muted">{t('sellerVerification.bank.description')}</p>
        )}
      </div>
      <BankForm account={account} onDone={() => setEditing(false)} />
    </div>
  )
}
