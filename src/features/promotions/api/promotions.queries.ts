import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deletePromotion, duplicatePromotion, getPromotion, listPromotions, saveDiscountPromotion,
} from './promotions.api'
import type { DiscountLine, PromotionStatus, PromotionType } from '../types/promotions.types'

const keys = {
  all: ['promotions'] as const,
  list: (type: string, status: string, q: string, page: number) => ['promotions', 'list', type, status, q, page] as const,
  detail: (id: string) => ['promotions', 'detail', id] as const,
}

export function usePromotions(type: PromotionType | 'all', status: PromotionStatus | 'all', q: string, page: number) {
  return useQuery({
    queryKey: keys.list(type, status, q, page),
    queryFn: () => listPromotions(type, status, q, page),
  })
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => getPromotion(id),
    enabled: Boolean(id),
  })
}

export function useSaveDiscountPromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { id?: string; name: string; startsAt: string; endsAt: string; lines: DiscountLine[]; publish: boolean }) =>
      saveDiscountPromotion(args),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useDeletePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useDuplicatePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => duplicatePromotion(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.all }),
  })
}
