// PUBLIC API of the finance feature. Pages import ONLY from here
// (`@/features/finance`) — never a deep path.
export {
  financeKeys,
  // New queries
  useIncomeOverview,
  useIncomeDetails,
  useStatements,
  useStatementDownload,
  useWalletOverview,
  useTransactions,
  useTransactionDetail,
  useWithdrawFunds,
  usePaymentAccounts,
  useCreatePaymentAccount,
  useDeletePaymentAccount,
  useSetDefaultPaymentAccount,
} from './api/finance.queries'

export { financeHandlers } from './api/finance.mocks'
export { useFinanceUi } from './stores/finance.store'
export { financeMessages } from './i18n'

// Components — shared across pages
export { FinanceNav } from './components/FinanceNav'

// New components (real-route pages)
export { IncomeOverviewCard } from './components/IncomeOverviewCard'
export { IncomeDetailsTable } from './components/IncomeDetailsTable'
export { IncomeSidebarPanel } from './components/IncomeSidebarPanel'
export { StatementsLatestPanel } from './components/StatementsLatestPanel'
export { TransactionFilters } from './components/TransactionFilters'
export { TransactionTable } from './components/TransactionTable'
export { WalletOverviewCard } from './components/WalletOverviewCard'
export { PaymentAccountCard } from './components/PaymentAccountCard'

export type {
  IncomeTab,
  IncomeStatus,
  IncomeOverview,
  IncomeItem,
  IncomeListQuery,
  IncomeListResponse,
  IncomeStatement,
  StatementsListResponse,
  WalletOverview,
  WalletTransaction,
  TransactionDetail,
  TransactionQuery,
  TransactionListResponse,
  TransactionType,
  TransactionStatus,
  MoneyFlow,
  PaymentAccount,
  AccountType,
  AccountStatus,
  CreateAccountInput,
  PaymentMethod,
} from './types/finance.types'
