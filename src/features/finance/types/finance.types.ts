// Finance domain types — NO enums; string-union + as-const arrays only.

// ── Income ────────────────────────────────────────────────────────────────────
export type IncomeTab = 'pending' | 'released'
export type IncomeStatus = 'pending' | 'released' | 'on_hold' | 'cancelled'
export type PaymentMethod = 'atmos' | 'payme' | 'ozb_wallet'

export interface IncomeOverview {
  pendingTotalUzs: number
  releasedWeekUzs: number
  releasedMonthUzs: number
  releasedTotalUzs: number          // ← backend lifetime_earned_uzs
  lifetimeRefundedUzs: number       // ← backend lifetime_refunded_uzs (new; refunds deducted from lifetime)
  maskedBankAccount: string // "**** 4385"  [PENDING BACKEND] — no payout/bank table yet
}

export interface IncomeItem {
  id: string
  orderId: string
  releasedAt: string | null      // ISO date
  status: IncomeStatus
  paymentMethod: PaymentMethod
  releasedAmountUzs: number
}

export interface IncomeListQuery {
  tab: IncomeTab
  from?: string
  to?: string
  orderId?: string
  page?: number
  pageSize?: number
}

export interface IncomeListResponse {
  items: IncomeItem[]
  total: number
  page: number
  pageSize: number
}

// ── Income Statements ─────────────────────────────────────────────────────────
export interface IncomeStatement {
  id: string
  periodFrom: string   // YYYY-MM-DD
  periodTo: string     // YYYY-MM-DD
  totalPayoutUzs: number
  statementDate: string  // YYYY-MM-DD
  downloadedAt: string | null
  filename: string
}

export interface StatementsListResponse {
  items: IncomeStatement[]
  total: number
  page: number
  pageSize: number
}

// ── Balance ───────────────────────────────────────────────────────────────────
export type TransactionType =
  | 'order_income'
  | 'adjustment'
  | 'refund'
  | 'withdrawal'
  | 'platform_fee'

export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface WalletOverview {
  balanceUzs: number
  autoWithdrawalEnabled: boolean
  bankAccount: {
    name: string
    maskedNumber: string
    status: 'verified' | 'checked' | 'pending' | 'error'
    isDefault: boolean
  } | null
}

export interface WalletTransaction {
  id: string                 // backend ledger row id (UUIDv7) — used for detail routing
  txnId?: string             // backend txn_id — human-facing reference (display)
  createdAt: string          // ISO timestamp
  description: string        // ← backend memo
  orderId: string | null     // ← backend order_id (links the order)
  type: TransactionType      // derived from backend direction + memo
  amountUzs: number          // signed: positive = in, negative = out ← backend signed_amount_uzs
  status: TransactionStatus
}

export type MoneyFlow = 'all' | 'money_in' | 'money_out'

export interface TransactionQuery {
  from?: string
  to?: string
  moneyFlow?: MoneyFlow
  types?: TransactionType[]
  orderId?: string
  page?: number
  pageSize?: number
}

export interface TransactionListResponse {
  items: WalletTransaction[]
  total: number
  totalAmountUzs: number
  page: number
  pageSize: number
}

export interface TransactionDetail extends WalletTransaction {
  balanceAfterUzs: number
  buyerUsername: string | null
  buyerAvatar: string | null
}

// ── Bank Accounts ─────────────────────────────────────────────────────────────
export type AccountType = 'atmos_card' | 'payme_card' | 'bank_transfer'
export type AccountStatus = 'verified' | 'checked' | 'pending' | 'error'

export interface PaymentAccount {
  id: string
  type: AccountType
  maskedNumber: string   // "**** 4385"
  holderName: string     // CAPS
  bankName: string       // "KAPITALBANK", "ATMOS", "PAYME"
  isDefault: boolean
  status: AccountStatus
}

export interface CreateAccountInput {
  type: AccountType
  cardNumber: string
  holderName: string
  bankName: string
}

// Legacy aliases kept so existing pages do not break
export type IncomeFilter = 'all' | 'atmos' | 'payme' | 'ozb_wallet'
export interface IncomeSummary { all: number; card: number; cash: number; invoice: number }
// LegacyIncomeItem: old shape used by IncomeTable component (pre-rebuild)
export interface LegacyIncomeItem {
  id: string
  source: string
  orderId: string
  amountUzs: number
  method: string
  date: string
}
export interface Balance {
  availableUzs: number
  holdUzs: number
  withdrawnThisMonthUzs: number
  lastWithdrawAt: string | null
}
export interface WithdrawRequest { accountId: string; amountUzs: number }
export interface WithdrawResponse { balance: Balance; accountId: string; amountUzs: number }
export interface BankAccount {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  mfo: string
  isPrimary: boolean
}
export interface CreateBankAccountInput {
  bankName: string
  accountName: string
  accountNumber: string
  mfo: string
}
export type WithdrawPeriod = 'daily' | 'weekly' | 'monthly'
export interface PaymentSettings {
  autoWithdraw: boolean
  withdrawPeriod: WithdrawPeriod
  notifyOnWithdraw: boolean
}
