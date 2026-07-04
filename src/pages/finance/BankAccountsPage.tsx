import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import {
  PaymentAccountCard,
  useDeletePaymentAccount,
  usePaymentAccounts,
  useSetDefaultPaymentAccount,
} from '@/features/finance'

function PlusIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Thin page — card grid matching Shopee Payment Services layout
export function BankAccountsPage() {
  const { t } = useTranslation()
  const { data: accounts, isLoading } = usePaymentAccounts()
  const setDefault = useSetDefaultPaymentAccount()
  const remove     = useDeletePaymentAccount()
  const busy       = setDefault.isPending || remove.isPending

  function handleRemove(id: string) {
    if (window.confirm(t('finance.payAccount.removeConfirm'))) {
      remove.mutate(id)
    }
  }

  function handleAddAccount() {
    // [PENDING BACKEND] add-account flow (card number → OTP → confirm)
    alert('[PENDING BACKEND] Add payment account flow')
  }

  return (
    <Page>
      <PageHeader
        title={t('finance.payAccount.title')}
        breadcrumb={
          <span>
            <a href="/" className="hover:underline">{t('finance.txDetail.breadcrumbHome')}</a>
            {' › '}
            <a href="/finance/balance" className="hover:underline">{t('finance.txDetail.breadcrumbBalance')}</a>
            {' › '}
            {t('finance.payAccount.title')}
          </span>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {/* Add Account card — always first */}
          <button
            type="button"
            onClick={handleAddAccount}
            className="flex h-44 w-56 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border-strong bg-surface text-text-secondary transition-colors hover:border-brand hover:bg-bg hover:text-brand"
          >
            <PlusIcon />
            <span className="text-sm font-semibold">{t('finance.payAccount.addCard')}</span>
          </button>

          {(accounts ?? []).map((account) => (
            <PaymentAccountCard
              key={account.id}
              account={account}
              onSetDefault={(id) => setDefault.mutate(id)}
              onRemove={handleRemove}
              busy={busy}
            />
          ))}
        </div>
      )}
    </Page>
  )
}
