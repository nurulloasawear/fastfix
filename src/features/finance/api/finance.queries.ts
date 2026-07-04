import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPaymentAccount,
  deletePaymentAccount,
  getIncomeDetails,
  getIncomeOverview,
  getPaymentAccounts,
  getStatementDownloadUrl,
  getStatements,
  getTransactionDetail,
  getTransactions,
  getWalletOverview,
  setDefaultPaymentAccount,
  withdrawFunds,
} from './finance.api'
import type {
  CreateAccountInput,
  IncomeListQuery,
  TransactionQuery,
} from '../types/finance.types'

export const financeKeys = {
  all: ['finance'] as const,
  incomeOverview: () => [...financeKeys.all, 'income-overview'] as const,
  incomeDetails: (q: IncomeListQuery) => [...financeKeys.all, 'income-details', q] as const,
  statements: (q: { from?: string; to?: string; page?: number }) => [...financeKeys.all, 'statements', q] as const,
  walletOverview: () => [...financeKeys.all, 'wallet-overview'] as const,
  transactions: (q: TransactionQuery) => [...financeKeys.all, 'transactions', q] as const,
  transaction: (id: string) => [...financeKeys.all, 'transaction', id] as const,
  paymentAccounts: () => [...financeKeys.all, 'payment-accounts'] as const,
}

// ── Income ────────────────────────────────────────────────────────────────────
export function useIncomeOverview() {
  return useQuery({ queryKey: financeKeys.incomeOverview(), queryFn: getIncomeOverview })
}

export function useIncomeDetails(q: IncomeListQuery) {
  return useQuery({ queryKey: financeKeys.incomeDetails(q), queryFn: () => getIncomeDetails(q) })
}

// ── Statements ────────────────────────────────────────────────────────────────
export function useStatements(q: { from?: string; to?: string; page?: number; pageSize?: number }) {
  return useQuery({ queryKey: financeKeys.statements(q), queryFn: () => getStatements(q) })
}

export function useStatementDownload() {
  return useMutation({ mutationFn: (id: string) => getStatementDownloadUrl(id) })
}

// ── Balance ───────────────────────────────────────────────────────────────────
export function useWalletOverview() {
  return useQuery({ queryKey: financeKeys.walletOverview(), queryFn: getWalletOverview })
}

export function useTransactions(q: TransactionQuery) {
  return useQuery({ queryKey: financeKeys.transactions(q), queryFn: () => getTransactions(q) })
}

export function useTransactionDetail(id: string) {
  return useQuery({
    queryKey: financeKeys.transaction(id),
    queryFn: () => getTransactionDetail(id),
    enabled: id !== '',
  })
}

export function useWithdrawFunds() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { accountId: string; amountUzs: number }) => withdrawFunds(body),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: financeKeys.walletOverview() }) },
  })
}

// ── Payment Accounts ──────────────────────────────────────────────────────────
export function usePaymentAccounts() {
  return useQuery({ queryKey: financeKeys.paymentAccounts(), queryFn: getPaymentAccounts })
}

export function useCreatePaymentAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAccountInput) => createPaymentAccount(input),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: financeKeys.paymentAccounts() }) },
  })
}

export function useDeletePaymentAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePaymentAccount(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: financeKeys.paymentAccounts() }) },
  })
}

export function useSetDefaultPaymentAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => setDefaultPaymentAccount(id),
    onSuccess: (accounts) => { qc.setQueryData(financeKeys.paymentAccounts(), accounts) },
  })
}
