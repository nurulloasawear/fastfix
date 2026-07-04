import { useQuery } from '@tanstack/react-query'
import { getAccountHealthSummary, getChatDetail, getNfrDetail } from './account-health.api'

export const accountHealthKeys = {
  all: ['account-health'] as const,
  summary: () => [...accountHealthKeys.all, 'summary'] as const,
  nfr: (from: string, to: string) => [...accountHealthKeys.all, 'nfr', from, to] as const,
  chat: (date: string) => [...accountHealthKeys.all, 'chat', date] as const,
}

export function useAccountHealthSummary() {
  return useQuery({
    queryKey: accountHealthKeys.summary(),
    queryFn: getAccountHealthSummary,
  })
}

export function useNfrDetail(from: string, to: string) {
  return useQuery({
    queryKey: accountHealthKeys.nfr(from, to),
    queryFn: () => getNfrDetail(from, to),
    enabled: Boolean(from && to),
  })
}

export function useChatDetail(date: string) {
  return useQuery({
    queryKey: accountHealthKeys.chat(date),
    queryFn: () => getChatDetail(date),
    enabled: Boolean(date),
  })
}
