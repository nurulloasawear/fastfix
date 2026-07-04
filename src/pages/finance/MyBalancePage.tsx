import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import {
  TransactionFilters,
  TransactionTable,
  WalletOverviewCard,
  useFinanceUi,
  useTransactions,
  useWalletOverview,
} from '@/features/finance'
import type { MoneyFlow, TransactionType } from '@/features/finance'

// Thin page
export function MyBalancePage() {
  const { t } = useTranslation()

  const txMoneyFlow    = useFinanceUi((s) => s.txMoneyFlow)
  const txTypes        = useFinanceUi((s) => s.txTypes)
  const setTxMoneyFlow = useFinanceUi((s) => s.setTxMoneyFlow)
  const setTxTypes     = useFinanceUi((s) => s.setTxTypes)
  const resetTxFilters = useFinanceUi((s) => s.resetTxFilters)
  const applyTxFilters = useFinanceUi((s) => s.applyTxFilters)
  const appliedFilters = useFinanceUi((s) => s.appliedTxFilters)

  const overviewQ = useWalletOverview()
  const txQ = useTransactions({
    moneyFlow: appliedFilters.moneyFlow,
    types: appliedFilters.types,
    from: appliedFilters.from,
    to: appliedFilters.to,
  })

  const totalPages = Math.max(1, Math.ceil((txQ.data?.total ?? 0) / 20))

  return (
    <Page>
      <PageHeader
        title={t('finance.walletCard.title')}
        breadcrumb={
          <span>
            <a href="/" className="hover:underline">{t('finance.txDetail.breadcrumbHome')}</a>
            {' › '}
            {t('finance.walletCard.title')}
          </span>
        }
      />

      <WalletOverviewCard overview={overviewQ.data} isLoading={overviewQ.isLoading} />

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-text">{t('finance.txTable.recentTitle')}</h2>
        <TransactionFilters
          moneyFlow={txMoneyFlow}
          txTypes={txTypes}
          onMoneyFlowChange={(f: MoneyFlow) => setTxMoneyFlow(f)}
          onTxTypesChange={(types: TransactionType[]) => setTxTypes(types)}
          onReset={resetTxFilters}
          onApply={applyTxFilters}
        />
      </div>

      <Card className="overflow-hidden">
        <TransactionTable
          items={txQ.data?.items ?? []}
          isLoading={txQ.isLoading}
          total={txQ.data?.total ?? 0}
          totalAmountUzs={txQ.data?.totalAmountUzs ?? 0}
        />
        <Pagination
          page={1}
          totalPages={totalPages}
          onChange={() => {}}
          className="border-t border-border px-4 py-3"
        />
      </Card>
    </Page>
  )
}
