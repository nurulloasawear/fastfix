// [PENDING BACKEND] — Legacy MSW handlers for old finance endpoints.
// Kept for backward compatibility with PaymentSettingsPage and old wiring.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  BankAccount,
  Balance,
  CreateBankAccountInput,
  PaymentSettings,
  WithdrawRequest,
  WithdrawResponse,
} from '../types/finance.types'

const LEGACY = `${env.apiBaseUrl}/seller/finance`

let legacyBalance: Balance = {
  availableUzs: 48_500_000, holdUzs: 12_000_000,
  withdrawnThisMonthUzs: 34_000_000, lastWithdrawAt: '2026-06-12',
}
let legacyAccounts: BankAccount[] = [
  { id: '1', bankName: 'Anorbank AJ', accountName: 'OZB SELLER MCHJ', accountNumber: '20208000600123456001', mfo: '01183', isPrimary: true },
  { id: '2', bankName: 'Kapitalbank ATB', accountName: 'NURULLO BUSINESS TECH', accountNumber: '20208000100987654002', mfo: '00440', isPrimary: false },
]
let legacySettings: PaymentSettings = { autoWithdraw: true, withdrawPeriod: 'weekly', notifyOnWithdraw: true }

export const legacyFinanceHandlers = [
  http.get(`${LEGACY}/income`, ({ request }) => {
    const method = new URL(request.url).searchParams.get('method') ?? 'all'
    const legacyItems = [
      { id: '1', source: 'Nike Air Max xaridi', orderId: '#TR-9021', amountUzs: 1_490_000, method: 'card', date: '2026-06-12' },
      { id: '2', source: 'B2B ulgurji kiyim savdosi', orderId: '#TR-8840', amountUzs: 18_500_000, method: 'invoice', date: '2026-06-11' },
    ]
    const items = method === 'all' ? legacyItems : legacyItems.filter((i) => i.method === method)
    return HttpResponse.json({ items, totalUzs: items.reduce((s, i) => s + i.amountUzs, 0), summary: { all: 2, card: 1, cash: 0, invoice: 1 } })
  }),

  http.get(`${LEGACY}/balance`, () => HttpResponse.json(legacyBalance)),

  http.post(`${LEGACY}/withdraw`, async ({ request }) => {
    const { accountId, amountUzs } = (await request.json()) as WithdrawRequest
    if (!Number.isFinite(amountUzs) || amountUzs <= 0) return HttpResponse.json({ error: 'invalid_amount' }, { status: 400 })
    if (amountUzs > legacyBalance.availableUzs) return HttpResponse.json({ error: 'insufficient_funds' }, { status: 400 })
    legacyBalance = { ...legacyBalance, availableUzs: legacyBalance.availableUzs - amountUzs, withdrawnThisMonthUzs: legacyBalance.withdrawnThisMonthUzs + amountUzs, lastWithdrawAt: '2026-06-16' }
    const resp: WithdrawResponse = { balance: legacyBalance, accountId, amountUzs }
    return HttpResponse.json(resp)
  }),

  http.get(`${LEGACY}/bank-accounts`, () => HttpResponse.json(legacyAccounts)),

  http.post(`${LEGACY}/bank-accounts`, async ({ request }) => {
    const input = (await request.json()) as CreateBankAccountInput
    const created: BankAccount = { id: Date.now().toString(), bankName: input.bankName, accountName: input.accountName, accountNumber: input.accountNumber, mfo: input.mfo || '00000', isPrimary: legacyAccounts.length === 0 }
    legacyAccounts = [...legacyAccounts, created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.delete(`${LEGACY}/bank-accounts/:id`, ({ params }) => {
    legacyAccounts = legacyAccounts.filter((a) => a.id !== params.id)
    if (legacyAccounts.length > 0 && !legacyAccounts.some((a) => a.isPrimary)) {
      legacyAccounts = legacyAccounts.map((a, i) => ({ ...a, isPrimary: i === 0 }))
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${LEGACY}/bank-accounts/:id/primary`, ({ params }) => {
    legacyAccounts = legacyAccounts.map((a) => ({ ...a, isPrimary: a.id === params.id }))
    return HttpResponse.json(legacyAccounts)
  }),

  http.get(`${LEGACY}/settings`, () => HttpResponse.json(legacySettings)),

  http.put(`${LEGACY}/settings`, async ({ request }) => {
    legacySettings = (await request.json()) as PaymentSettings
    return HttpResponse.json(legacySettings)
  }),
]
