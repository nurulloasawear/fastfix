import { create } from 'zustand'
import type { IncomeFilter, IncomeTab, MoneyFlow, TransactionType } from '../types/finance.types'

interface FinanceUiState {
  // My Income
  incomeTab: IncomeTab
  incomeDatePreset: 'this_week' | 'this_month' | 'custom'
  incomeFrom: string
  incomeTo: string
  incomeOrderSearch: string
  setIncomeTab: (tab: IncomeTab) => void
  setIncomeDatePreset: (preset: 'this_week' | 'this_month' | 'custom') => void
  setIncomeDateRange: (from: string, to: string) => void
  setIncomeOrderSearch: (v: string) => void
  // Info banner dismissal
  incomeBannerDismissed: boolean
  dismissIncomeBanner: () => void
  // My Balance
  txDatePreset: 'this_month' | 'custom'
  txFrom: string
  txTo: string
  txMoneyFlow: MoneyFlow
  txTypes: TransactionType[]
  txOrderSearch: string
  setTxDatePreset: (p: 'this_month' | 'custom') => void
  setTxDateRange: (from: string, to: string) => void
  setTxMoneyFlow: (f: MoneyFlow) => void
  setTxTypes: (types: TransactionType[]) => void
  setTxOrderSearch: (v: string) => void
  resetTxFilters: () => void
  applyTxFilters: () => void
  appliedTxFilters: { moneyFlow: MoneyFlow; types: TransactionType[]; from: string; to: string }
  // Statements panel
  latestReportsPanelDismissed: boolean
  dismissLatestReportsPanel: () => void
  // Legacy
  incomeFilter: IncomeFilter
  setIncomeFilter: (filter: IncomeFilter) => void
}

const TODAY = new Date()
const pad = (n: number) => String(n).padStart(2, '0')
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function thisWeekRange() {
  const end = new Date(TODAY)
  const start = new Date(TODAY)
  start.setDate(TODAY.getDate() - TODAY.getDay())
  return { from: fmt(start), to: fmt(end) }
}

function thisMonthRange() {
  const start = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)
  return { from: fmt(start), to: fmt(TODAY) }
}

const DEFAULT_TX_TYPES: TransactionType[] = ['order_income', 'adjustment', 'refund', 'withdrawal', 'platform_fee']
const week = thisWeekRange()
const month = thisMonthRange()

export const useFinanceUi = create<FinanceUiState>((set, get) => ({
  // Income
  incomeTab: 'released',
  incomeDatePreset: 'this_week',
  incomeFrom: week.from,
  incomeTo: week.to,
  incomeOrderSearch: '',
  setIncomeTab: (incomeTab) => set({ incomeTab }),
  setIncomeDatePreset: (preset) => {
    if (preset === 'this_week') set({ incomeDatePreset: preset, incomeFrom: week.from, incomeTo: week.to })
    else if (preset === 'this_month') set({ incomeDatePreset: preset, incomeFrom: month.from, incomeTo: month.to })
    else set({ incomeDatePreset: preset })
  },
  setIncomeDateRange: (from, to) => set({ incomeFrom: from, incomeTo: to }),
  setIncomeOrderSearch: (v) => set({ incomeOrderSearch: v }),
  incomeBannerDismissed: false,
  dismissIncomeBanner: () => set({ incomeBannerDismissed: true }),
  // Balance
  txDatePreset: 'this_month',
  txFrom: month.from,
  txTo: month.to,
  txMoneyFlow: 'all',
  txTypes: DEFAULT_TX_TYPES,
  txOrderSearch: '',
  setTxDatePreset: (p) => {
    if (p === 'this_month') set({ txDatePreset: p, txFrom: month.from, txTo: month.to })
    else set({ txDatePreset: p })
  },
  setTxDateRange: (from, to) => set({ txFrom: from, txTo: to }),
  setTxMoneyFlow: (f) => set({ txMoneyFlow: f }),
  setTxTypes: (types) => set({ txTypes: types }),
  setTxOrderSearch: (v) => set({ txOrderSearch: v }),
  resetTxFilters: () => set({
    txMoneyFlow: 'all', txTypes: DEFAULT_TX_TYPES, txOrderSearch: '',
    txDatePreset: 'this_month', txFrom: month.from, txTo: month.to,
    appliedTxFilters: { moneyFlow: 'all', types: DEFAULT_TX_TYPES, from: month.from, to: month.to },
  }),
  applyTxFilters: () => {
    const s = get()
    set({ appliedTxFilters: { moneyFlow: s.txMoneyFlow, types: s.txTypes, from: s.txFrom, to: s.txTo } })
  },
  appliedTxFilters: { moneyFlow: 'all', types: DEFAULT_TX_TYPES, from: month.from, to: month.to },
  // Statements
  latestReportsPanelDismissed: false,
  dismissLatestReportsPanel: () => set({ latestReportsPanelDismissed: true }),
  // Legacy
  incomeFilter: 'all',
  setIncomeFilter: (incomeFilter) => set({ incomeFilter }),
}))
