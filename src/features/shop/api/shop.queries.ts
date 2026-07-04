import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  deleteCategory,
  deleteMedia,
  generateReport,
  getCategories,
  getDecoration,
  getMedia,
  getProfile,
  getReports,
  getReviews,
  replyToReview,
  saveDecoration,
  toggleCategory,
  updateProfile,
} from './shop.api'
import type {
  DecorationBlock,
  ReviewReplyPayload,
  ShopProfileUpdate,
  ShopReport,
} from '../types/shop.types'
import { shopKeys } from './shop.query-keys'
export { shopKeys } from './shop.query-keys'

// --- Profile ---
export function useShopProfile() {
  return useQuery({ queryKey: shopKeys.profile(), queryFn: getProfile })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ShopProfileUpdate) => updateProfile(payload),
    onSuccess: (data) => qc.setQueryData(shopKeys.profile(), data),
  })
}

// --- Reviews ---
export function useShopReviews() {
  return useQuery({ queryKey: shopKeys.reviews(), queryFn: getReviews })
}

export function useReplyToReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ReviewReplyPayload) => replyToReview(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.reviews() }),
  })
}

// --- Decoration (legacy blocks) ---
export function useDecoration() {
  return useQuery({ queryKey: shopKeys.decoration(), queryFn: getDecoration })
}

export function useSaveDecoration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (blocks: DecorationBlock[]) => saveDecoration(blocks),
    onSuccess: (data) => qc.setQueryData(shopKeys.decoration(), data),
  })
}

// --- Categories ---
export function useCategories() {
  return useQuery({ queryKey: shopKeys.categories(), queryFn: getCategories })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.categories() }),
  })
}

export function useToggleCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.categories() }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.categories() }),
  })
}

// --- Media ---
export function useMedia() {
  return useQuery({ queryKey: shopKeys.media(), queryFn: getMedia })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.media() }),
  })
}

// --- Reports ---
export function useReports() {
  return useQuery({ queryKey: shopKeys.reports(), queryFn: getReports })
}

export function useGenerateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (type: ShopReport['type']) => generateReport(type),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.reports() }),
  })
}

// Extended hooks (shop info, KYC, new decoration, top picks, appeals, missions)
export {
  useShopInfo,
  usePatchShopInfo,
  useShopKyc,
  useDecorationDrafts,
  useDecorationContent,
  useSaveDecorationDraft,
  usePublishDecoration,
  useTopPicks,
  useTopPicksDetail,
  usePatchTopPicks,
  useAppeals,
  useMissions,
  useMarkIntroSeen,
  useRewardsList,
} from './shop.queries.ext'
