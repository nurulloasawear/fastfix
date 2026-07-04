import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDiscount,
  deleteDiscount,
  getDiscounts,
  toggleDiscountStatus,
  updateDiscount,
} from './discounts.api'
import type { DiscountInput, DiscountListQuery } from '../types/discounts.types'

// Stable, structured query keys → cache, dedupe, and invalidation just work.
export const discountKeys = {
  all: ['discounts'] as const,
  lists: () => [...discountKeys.all, 'list'] as const,
  list: (query: DiscountListQuery) => [...discountKeys.lists(), query] as const,
}

export function useDiscounts(query: DiscountListQuery) {
  return useQuery({
    queryKey: discountKeys.list(query),
    queryFn: () => getDiscounts(query),
  })
}

export function useCreateDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: DiscountInput) => createDiscount(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export function useUpdateDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DiscountInput }) =>
      updateDiscount(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export function useDeleteDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export function useToggleDiscountStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleDiscountStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}
