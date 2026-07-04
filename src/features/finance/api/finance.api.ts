// Finance API boundary.
// ✅ = real backend route wired to live /api/v1 (2026-06-17).
// [MOCK] = MSW-only — backend endpoint not ready or 500s.
import { apiClient } from '@/lib/axios'
import type {
  CreateAccountInput,
  IncomeListQuery,
  IncomeListResponse,
  IncomeOverview,
  IncomeStatus,
  PaymentAccount,
  PaymentMethod,
  StatementsListResponse,
  TransactionDetail,
  TransactionListResponse,
  TransactionQuery,
  WalletOverview,
  WalletTransaction,
} from '../types/finance.types'

export const PATHS = {
  // ✅ Real backend routes (wired 2026-06-17)
  incomeOverview: '/sellers/me/income/overview',
  incomeDetails: '/sellers/me/income/details',
  statements: '/sellers/me/income/statements',
  statementDownload: (id: string) => `/sellers/me/income/statements/${id}/download`,
  statementDownloadAll: '/sellers/me/income/statements/download-all',
  wallet: '/sellers/me/wallet',
  transactions: '/sellers/me/transactions',
  transaction: (id: string) => `/sellers/me/transactions/${id}`,
  withdraw: '/sellers/me/wallet/withdraw',
  paymentAccounts: '/sellers/me/payment-accounts',
  paymentAccount: (id: string) => `/sellers/me/payment-accounts/${id}`,
  paymentAccountDefault: (id: string) => `/sellers/me/payment-accounts/${id}/default`,
  // [PENDING BACKEND] Atmos OTP confirm returns 500 server-side — MSW intercepts this path until fixed.
  paymentAccountConfirm: (id: string) => `/finance/bank-accounts/${id}/confirm`,
} as const

// ── Backend DTOs (stay inside this file — never leak past the api boundary) ─────

// GET /sellers/me/income/overview
interface BackendIncomeOverview {
  pending_total_uzs: number
  released_week_uzs: number
  released_month_uzs: number
  released_total_uzs: number
  masked_bank_account: string | null
}

// GET /sellers/me/income/details → items[]
interface BackendIncomeItem {
  id: string
  order_id: string
  released_at: string | null
  status: string
  payment_method: string
  gross_uzs: number
  platform_fee_uzs: number
  payment_fee_uzs: number
  net_uzs: number
  created_at: string
}

interface BackendIncomeDetails {
  items: BackendIncomeItem[]
  total: number
  page: number
  page_size: number
}

// GET /sellers/me/income/statements
interface BackendStatement {
  id: string
  period_from: string
  period_to: string
  total_payout_uzs: number
  statement_date: string
  downloaded_at: string | null
  filename: string
}

interface BackendStatementsResponse {
  items: BackendStatement[]
  total: number
  page: number
  page_size: number
  unread_count: number
}

// GET /sellers/me/wallet
interface BackendWallet {
  available_uzs: number
  auto_withdrawal_enabled: boolean
  bank_account: {
    id: string
    name: string
    masked_number: string
    status: 'verified' | 'checked' | 'pending' | 'error'
    is_default: boolean
  } | null
}

// GET /sellers/me/transactions → items[]
interface BackendTransaction {
  id: string
  txn_id: string
  created_at: string
  type: string
  description: string
  order_id: string | null
  amount_uzs: number
  status: string
}

interface BackendTransactionsResponse {
  items: BackendTransaction[]
  total: number
  total_amount_uzs: number
  page: number
  page_size: number
}

// GET /sellers/me/transactions/:id
interface BackendTransactionDetail extends BackendTransaction {
  balance_after_uzs: number
  buyer_id: string | null
  buyer_username: string | null
  buyer_avatar_url: string | null
}

// GET /sellers/me/payment-accounts → []
interface BackendPaymentAccount {
  id: string
  type: string
  masked_number: string
  holder_name: string
  bank_name: string
  is_default: boolean
  status: string
}

// POST /sellers/me/wallet/withdraw
interface BackendWithdrawResponse {
  withdrawal_id: string
  status: string
  amount_uzs: number
  available_uzs: number
  auto_withdrawal_enabled: boolean
}

// ── Mappers ─────────────────────────────────────────────────────────────────

function mapTransaction(raw: BackendTransaction): WalletTransaction {
  // BE now has an explicit type column — map to FE TransactionType; unknown types → 'adjustment'
  const knownTypes = new Set(['order_income', 'adjustment', 'refund', 'withdrawal', 'platform_fee'])
  return {
    id: raw.id,
    txnId: raw.txn_id,
    createdAt: raw.created_at,
    description: raw.description,
    orderId: raw.order_id,
    type: knownTypes.has(raw.type) ? (raw.type as WalletTransaction['type']) : 'adjustment',
    amountUzs: raw.amount_uzs,   // signed: + credit, – debit
    status: (raw.status as WalletTransaction['status']) ?? 'completed',
  }
}

function mapPaymentAccount(raw: BackendPaymentAccount): PaymentAccount {
  return {
    id: raw.id,
    type: raw.type as PaymentAccount['type'],
    maskedNumber: raw.masked_number,
    holderName: raw.holder_name,
    bankName: raw.bank_name,
    isDefault: raw.is_default,
    status: (raw.status as PaymentAccount['status']) ?? 'pending',
  }
}

// ── Income ────────────────────────────────────────────────────────────────────
// ✅ GET /sellers/me/income/overview
export async function getIncomeOverview(): Promise<IncomeOverview> {
  const { data } = await apiClient.get<BackendIncomeOverview>(PATHS.incomeOverview)
  return {
    pendingTotalUzs: data.pending_total_uzs,
    releasedWeekUzs: data.released_week_uzs,
    releasedMonthUzs: data.released_month_uzs,
    releasedTotalUzs: data.released_total_uzs,
    lifetimeRefundedUzs: 0,             // not in this endpoint; balance endpoint no longer used here
    maskedBankAccount: data.masked_bank_account ?? '',
  }
}

// ✅ GET /sellers/me/income/details
export async function getIncomeDetails(query: IncomeListQuery): Promise<IncomeListResponse> {
  const { data } = await apiClient.get<BackendIncomeDetails>(PATHS.incomeDetails, {
    params: {
      tab: query.tab,
      from: query.from,
      to: query.to,
      order_id: query.orderId,
      page: query.page,
      page_size: query.pageSize,
    },
  })
  return {
    items: data.items.map((raw) => ({
      id: raw.id,
      orderId: raw.order_id,
      releasedAt: raw.released_at,
      status: raw.status as IncomeStatus,
      paymentMethod: raw.payment_method as PaymentMethod,
      releasedAmountUzs: raw.net_uzs,  // net after fees = what's credited to wallet
    })),
    total: data.total,
    page: data.page,
    pageSize: data.page_size,
  }
}

// ── Statements ────────────────────────────────────────────────────────────────
// ✅ GET /sellers/me/income/statements
export async function getStatements(params: { from?: string; to?: string; page?: number; pageSize?: number }): Promise<StatementsListResponse> {
  const { data } = await apiClient.get<BackendStatementsResponse>(PATHS.statements, {
    params: { from: params.from, to: params.to, page: params.page, page_size: params.pageSize },
  })
  return {
    items: data.items.map((raw) => ({
      id: raw.id,
      periodFrom: raw.period_from,
      periodTo: raw.period_to,
      totalPayoutUzs: raw.total_payout_uzs,
      statementDate: raw.statement_date,
      downloadedAt: raw.downloaded_at,
      filename: raw.filename,
    })),
    total: data.total,
    page: data.page,
    pageSize: data.page_size,
  }
}

// ✅ GET /sellers/me/income/statements/:id/download
export async function getStatementDownloadUrl(id: string): Promise<{ url: string }> {
  const { data } = await apiClient.get<{ url: string }>(PATHS.statementDownload(id))
  return data
}

// ── Balance ───────────────────────────────────────────────────────────────────
// ✅ GET /sellers/me/wallet
export async function getWalletOverview(): Promise<WalletOverview> {
  const { data } = await apiClient.get<BackendWallet>(PATHS.wallet)
  return {
    balanceUzs: data.available_uzs,
    autoWithdrawalEnabled: data.auto_withdrawal_enabled,
    bankAccount: data.bank_account
      ? {
          name: data.bank_account.name,
          maskedNumber: data.bank_account.masked_number,
          status: data.bank_account.status,
          isDefault: data.bank_account.is_default,
        }
      : null,
  }
}

// ✅ PATCH /sellers/me/wallet
export async function updateWallet(body: { autoWithdrawalEnabled: boolean }): Promise<WalletOverview> {
  const { data } = await apiClient.patch<BackendWallet>(PATHS.wallet, {
    auto_withdrawal_enabled: body.autoWithdrawalEnabled,
  })
  return {
    balanceUzs: data.available_uzs,
    autoWithdrawalEnabled: data.auto_withdrawal_enabled,
    bankAccount: data.bank_account
      ? {
          name: data.bank_account.name,
          maskedNumber: data.bank_account.masked_number,
          status: data.bank_account.status,
          isDefault: data.bank_account.is_default,
        }
      : null,
  }
}

// ✅ GET /sellers/me/transactions — server-side filtering; all query params forwarded to BE.
export async function getTransactions(query: TransactionQuery): Promise<TransactionListResponse> {
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 20
  const { data } = await apiClient.get<BackendTransactionsResponse>(PATHS.transactions, {
    params: {
      from: query.from,
      to: query.to,
      money_flow: query.moneyFlow,
      types: query.types?.join(','),
      order_id: query.orderId,
      page,
      page_size: pageSize,
    },
  })
  return {
    items: data.items.map(mapTransaction),
    total: data.total,
    totalAmountUzs: data.total_amount_uzs,
    page: data.page,
    pageSize: data.page_size,
  }
}

// ✅ GET /sellers/me/transactions/:id
export async function getTransactionDetail(id: string): Promise<TransactionDetail> {
  const { data } = await apiClient.get<BackendTransactionDetail>(PATHS.transaction(id))
  return {
    ...mapTransaction(data),
    balanceAfterUzs: data.balance_after_uzs,
    buyerUsername: data.buyer_username,
    buyerAvatar: data.buyer_avatar_url,
  }
}

// ✅ POST /sellers/me/wallet/withdraw
// Returns a partial WalletOverview (available balance after withdrawal).
// The response shape differs from GET /wallet — map to WalletOverview for consistency.
export async function withdrawFunds(body: { accountId: string; amountUzs: number }): Promise<WalletOverview> {
  const { data } = await apiClient.post<BackendWithdrawResponse>(PATHS.withdraw, {
    account_id: body.accountId,
    amount_uzs: body.amountUzs,
  })
  return {
    balanceUzs: data.available_uzs,
    autoWithdrawalEnabled: data.auto_withdrawal_enabled,
    bankAccount: null,   // not included in withdraw response; caller should re-fetch wallet
  }
}

// ── Bank Accounts ─────────────────────────────────────────────────────────────
// ✅ GET /sellers/me/payment-accounts
export async function getPaymentAccounts(): Promise<PaymentAccount[]> {
  const { data } = await apiClient.get<BackendPaymentAccount[]>(PATHS.paymentAccounts)
  return data.map(mapPaymentAccount)
}

// ✅ POST /sellers/me/payment-accounts
export async function createPaymentAccount(input: CreateAccountInput): Promise<PaymentAccount> {
  const { data } = await apiClient.post<BackendPaymentAccount>(PATHS.paymentAccounts, {
    type: input.type,
    card_number: input.cardNumber,
    holder_name: input.holderName,
    bank_name: input.bankName,
  })
  return mapPaymentAccount(data)
}

// [MOCK] POST /sellers/me/payment-accounts/:id/confirm — BE returns 500 (Atmos OTP wiring
// incomplete server-side). MSW intercepts the legacy path until the BE is fixed.
export async function confirmPaymentAccount(id: string, otp: string): Promise<PaymentAccount> {
  const { data } = await apiClient.post<BackendPaymentAccount>(PATHS.paymentAccountConfirm(id), { otp })
  return mapPaymentAccount(data)
}

// ✅ DELETE /sellers/me/payment-accounts/:id
export async function deletePaymentAccount(id: string): Promise<void> {
  await apiClient.delete(PATHS.paymentAccount(id))
}

// ✅ PUT /sellers/me/payment-accounts/:id/default
export async function setDefaultPaymentAccount(id: string): Promise<PaymentAccount[]> {
  const { data } = await apiClient.put<BackendPaymentAccount[]>(PATHS.paymentAccountDefault(id))
  return data.map(mapPaymentAccount)
}

