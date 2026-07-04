// MSW handlers for the finance feature.
// ✅ Real backend routes are mocked in BACKEND shape so dev mirrors prod:
//      GET /sellers/me/balance, GET /sellers/me/ledger
// [PENDING BACKEND] — everything else (income details, statements, per-tx detail,
//      withdraw, bank accounts) has no backend route yet; kept mock-only, marked below.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  IncomeItem, IncomeStatement,
  PaymentAccount, TransactionDetail,
} from '../types/finance.types'
import { legacyFinanceHandlers } from './finance.mocks.legacy'

const BASE = env.apiBaseUrl

// ── ✅ Balance (backend shape) ──────────────────────────────────────────────────
// GET /sellers/me/balance → {available_uzs, lifetime_earned_uzs, lifetime_refunded_uzs, currency}
const BALANCE = {
  available_uzs: 2_780_000,
  lifetime_earned_uzs: 6_713_500,
  lifetime_refunded_uzs: 412_000,
  currency: 'UZS',
} as const

// ── ✅ Ledger (backend shape) ─────────────────────────────────────────────────
// GET /sellers/me/ledger?limit&offset → {transactions:[{id, txn_id, direction,
//   amount_uzs, signed_amount_uzs, order_id, memo, created_at}]}
// IDs mimic UUIDv7 (time-ordered); txn_id is the human reference; signed amount
// is + for credit, − for debit.
interface BackendLedgerTxn {
  id: string
  txn_id: string
  direction: 'credit' | 'debit'
  amount_uzs: number
  signed_amount_uzs: number
  order_id: string | null
  memo: string
  created_at: string
}

const LEDGER: BackendLedgerTxn[] = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1
  const isDebit = n % 7 === 0           // every 7th row is a debit (refund/fee)
  const amount = isDebit ? 30_000 + n * 1_000 : 45_000 + n * 1_000
  const day = String(((n - 1) % 28) + 1).padStart(2, '0')
  const orderRef = `ORD-202605${day}-R${n}`
  return {
    id: `0190f${String(n).padStart(3, '0')}-7c3a-7e10-9f21-${String(n).padStart(12, '0')}`,
    txn_id: `TXN-202605${day}-${String(n).padStart(4, '0')}`,
    direction: isDebit ? 'debit' : 'credit',
    amount_uzs: amount,
    signed_amount_uzs: isDebit ? -amount : amount,
    order_id: isDebit ? null : orderRef,
    memo: isDebit ? `Refund for order #${orderRef}` : `Income from order #${orderRef}`,
    created_at: `2026-05-${day}T${String(8 + (n % 12)).padStart(2, '0')}:${String((n * 7) % 60).padStart(2, '0')}:00Z`,
  }
})

// ── [PENDING BACKEND] Income details (no backend route) ─────────────────────────
const INCOME_ITEMS: IncomeItem[] = [
  { id: 'i1', orderId: '#ORD-20260610-A1', releasedAt: '2026-06-10', status: 'released', paymentMethod: 'atmos', releasedAmountUzs: 450_000 },
  { id: 'i2', orderId: '#ORD-20260609-B2', releasedAt: '2026-06-09', status: 'released', paymentMethod: 'payme', releasedAmountUzs: 1_250_000 },
  { id: 'i3', orderId: '#ORD-20260608-C3', releasedAt: '2026-06-08', status: 'released', paymentMethod: 'ozb_wallet', releasedAmountUzs: 890_000 },
  { id: 'i4', orderId: '#ORD-20260607-D4', releasedAt: '2026-06-07', status: 'released', paymentMethod: 'atmos', releasedAmountUzs: 3_100_000 },
  { id: 'i5', orderId: '#ORD-20260606-E5', releasedAt: '2026-06-06', status: 'released', paymentMethod: 'payme', releasedAmountUzs: 980_000 },
]

// ── [PENDING BACKEND] Statements (no backend route) ─────────────────────────────
let STATEMENTS: IncomeStatement[] = [
  { id: 's1', periodFrom: '2026-06-08', periodTo: '2026-06-14', totalPayoutUzs: 0, statementDate: '2026-06-14', downloadedAt: null, filename: 'ozb_income_statement_seller1_20260614.pdf' },
  { id: 's2', periodFrom: '2026-06-01', periodTo: '2026-06-07', totalPayoutUzs: 0, statementDate: '2026-06-07', downloadedAt: '2026-06-08T09:00:00Z', filename: 'ozb_income_statement_seller1_20260607.pdf' },
  { id: 's3', periodFrom: '2026-05-25', periodTo: '2026-05-31', totalPayoutUzs: 6_713_500, statementDate: '2026-05-31', downloadedAt: '2026-06-01T10:00:00Z', filename: 'ozb_income_statement_seller1_20260531.pdf' },
]

// ── [PENDING BACKEND] Payment accounts (no backend payout/bank table) ───────────
let paymentAccounts: PaymentAccount[] = [
  { id: 'pa1', type: 'atmos_card', maskedNumber: '**** 4385', holderName: 'ULUGBEK YULDASHEV', bankName: 'KAPITALBANK', isDefault: true, status: 'verified' },
  { id: 'pa2', type: 'payme_card', maskedNumber: '**** 2001', holderName: 'ULUGBEK YULDASHEV', bankName: 'PAYME', isDefault: false, status: 'checked' },
]

// ── Handlers ──────────────────────────────────────────────────────────────────
export const financeHandlers = [
  // ✅ GET /sellers/me/balance — backend shape
  http.get(`${BASE}/sellers/me/balance`, () => HttpResponse.json(BALANCE)),

  // ✅ GET /sellers/me/ledger — backend shape (limit/offset only)
  http.get(`${BASE}/sellers/me/ledger`, ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? 20)
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const transactions = LEDGER.slice(offset, offset + limit)
    return HttpResponse.json({ transactions })
  }),

  // [PENDING BACKEND] — income details (no backend route)
  http.get(`${BASE}/finance/income/details`, ({ request }) => {
    const url = new URL(request.url)
    const tab = url.searchParams.get('tab') ?? 'released'
    const orderId = (url.searchParams.get('orderId') ?? '').toLowerCase()
    let items = tab === 'pending' ? INCOME_ITEMS.filter((i) => i.status === 'pending') : INCOME_ITEMS.filter((i) => i.status === 'released')
    if (orderId) items = items.filter((i) => i.orderId.toLowerCase().includes(orderId))
    return HttpResponse.json({ items, total: items.length, page: 1, pageSize: 20 })
  }),

  // [PENDING BACKEND] — statements (no backend route)
  http.get(`${BASE}/finance/income/statements`, () =>
    HttpResponse.json({ items: STATEMENTS, total: STATEMENTS.length, page: 1, pageSize: 10 }),
  ),

  http.get(`${BASE}/finance/income/statements/:id/download`, ({ params }) => {
    STATEMENTS = STATEMENTS.map((s) => s.id === params.id ? { ...s, downloadedAt: new Date().toISOString() } : s)
    return HttpResponse.json({ url: `https://r2.example.com/statements/${params.id}.pdf?token=mock` })
  }),

  // [PENDING BACKEND] — per-transaction detail (ledger has no row-detail route).
  // Derive a detail view from the ledger row so the existing detail page works.
  http.get(`${BASE}/finance/balance/transactions/:id`, ({ params }) => {
    const raw = LEDGER.find((t) => t.id === params.id)
    if (!raw) return new HttpResponse(null, { status: 404 })
    const detail: TransactionDetail = {
      id: raw.id,
      txnId: raw.txn_id,
      createdAt: raw.created_at,
      description: raw.memo,
      orderId: raw.order_id,
      type: raw.direction === 'credit' ? 'order_income' : 'refund',
      amountUzs: raw.signed_amount_uzs,
      status: 'completed',
      balanceAfterUzs: BALANCE.available_uzs,   // [PENDING BACKEND] — no running balance in ledger
      buyerUsername: raw.order_id ? 'marlenewan' : null,
      buyerAvatar: null,
    }
    return HttpResponse.json(detail)
  }),

  // [PENDING BACKEND] — withdraw (no backend payout route)
  http.post(`${BASE}/finance/balance/withdraw`, () =>
    HttpResponse.json({ balanceUzs: BALANCE.available_uzs, autoWithdrawalEnabled: false, bankAccount: null }),
  ),

  // [PENDING BACKEND] — bank accounts (no backend payout/bank table)
  http.get(`${BASE}/finance/bank-accounts`, () => HttpResponse.json(paymentAccounts)),

  http.post(`${BASE}/finance/bank-accounts`, async ({ request }) => {
    const input = (await request.json()) as { type: string; cardNumber: string; holderName: string; bankName: string }
    const created: PaymentAccount = {
      id: Date.now().toString(), type: 'atmos_card',
      maskedNumber: `**** ${input.cardNumber.slice(-4)}`,
      holderName: input.holderName.toUpperCase(), bankName: input.bankName.toUpperCase(),
      isDefault: paymentAccounts.length === 0, status: 'pending',
    }
    paymentAccounts = [...paymentAccounts, created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.put(`${BASE}/finance/bank-accounts/:id/default`, ({ params }) => {
    paymentAccounts = paymentAccounts.map((a) => ({ ...a, isDefault: a.id === params.id }))
    return HttpResponse.json(paymentAccounts)
  }),

  http.delete(`${BASE}/finance/bank-accounts/:id`, ({ params }) => {
    paymentAccounts = paymentAccounts.filter((a) => a.id !== params.id)
    if (paymentAccounts.length > 0 && !paymentAccounts.some((a) => a.isDefault)) {
      paymentAccounts = paymentAccounts.map((a, i) => ({ ...a, isDefault: i === 0 }))
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // [PENDING BACKEND] — legacy handlers for PaymentSettingsPage + old wiring
  ...legacyFinanceHandlers,
]
