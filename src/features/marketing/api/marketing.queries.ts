import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  activateCreators,
  adsTopUp,
  createAdCampaign,
  createFlashDeal,
  createVoucher,
  deleteVoucher,
  duplicateReviewPrize,
  endReviewPrize,
  getAds,
  getAdsRecommendations,
  getCampaignDetail,
  getCampaigns,
  getCreators,
  getFlashDeals,
  getMarketingCentre,
  getMarketingShipping,
  getReviewPrizes,
  getVouchers,
  saveMarketingShipping,
  updateAdCampaign,
} from './marketing.api'
import type {
  AdMatchType,
  CreateFlashDealInput,
  CreateVoucherInput,
  CreatorActivateInput,
  MarketingShipping,
} from '../types/marketing.types'

export const marketingKeys = {
  all: ['marketing'] as const,
  centre: () => [...marketingKeys.all, 'centre'] as const,
  ads: () => [...marketingKeys.all, 'ads'] as const,
  adsRecommendations: () => [...marketingKeys.all, 'ads-recommendations'] as const,
  vouchers: (status?: string, q?: string, page?: number) =>
    [...marketingKeys.all, 'vouchers', status, q, page] as const,
  shipping: () => [...marketingKeys.all, 'shipping'] as const,
  flashDeals: (page?: number) => [...marketingKeys.all, 'flash-deals', page] as const,
  campaigns: (sellerStatus?: string, type?: string, page?: number) =>
    [...marketingKeys.all, 'campaigns', sellerStatus, type, page] as const,
  campaignDetail: (id: string) => [...marketingKeys.all, 'campaign', id] as const,
  creators: () => [...marketingKeys.all, 'creators'] as const,
  reviewPrizes: (status?: string, page?: number) =>
    [...marketingKeys.all, 'review-prizes', status, page] as const,
}

export function useMarketingCentre() {
  return useQuery({ queryKey: marketingKeys.centre(), queryFn: getMarketingCentre })
}

export function useAds() {
  return useQuery({ queryKey: marketingKeys.ads(), queryFn: getAds })
}

export function useAdsRecommendations() {
  return useQuery({ queryKey: marketingKeys.adsRecommendations(), queryFn: getAdsRecommendations })
}

export function useCreateAdCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      productId: string
      variantId?: string | null
      matchType: AdMatchType
      dailyBudgetUzs?: number | null
      bidUzs: number
    }) => createAdCampaign(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.ads() }),
  })
}

export function useUpdateAdCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...patch
    }: {
      id: string
      dailyBudgetUzs?: number | null
      bidUzs?: number
      status?: 'active' | 'paused' | 'ended'
    }) => updateAdCampaign(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.ads() }),
  })
}

export function useAdsTopUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ amountUzs, source }: { amountUzs: number; source?: 'wallet' | 'escrow' }) =>
      adsTopUp(amountUzs, source),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.ads() }),
  })
}

export function useVouchers(status?: string, q?: string, page?: number) {
  return useQuery({
    queryKey: marketingKeys.vouchers(status, q, page),
    queryFn: () => getVouchers(status, q, page),
  })
}

export function useCreateVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateVoucherInput) => createVoucher(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.all }),
  })
}

export function useDeleteVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.all }),
  })
}

export function useMarketingShipping() {
  return useQuery({ queryKey: marketingKeys.shipping(), queryFn: getMarketingShipping })
}

export function useSaveMarketingShipping() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: MarketingShipping) => saveMarketingShipping(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.shipping() }),
  })
}

export function useFlashDeals(page?: number) {
  return useQuery({
    queryKey: marketingKeys.flashDeals(page),
    queryFn: () => getFlashDeals(page),
  })
}

export function useCreateFlashDeal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFlashDealInput) => createFlashDeal(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.all }),
  })
}

export function useCampaigns(sellerStatus?: string, type?: string, page?: number) {
  return useQuery({
    queryKey: marketingKeys.campaigns(sellerStatus, type, page),
    queryFn: () => getCampaigns(sellerStatus, type, page),
  })
}

export function useCampaignDetail(id: string) {
  return useQuery({
    queryKey: marketingKeys.campaignDetail(id),
    queryFn: () => getCampaignDetail(id),
    enabled: Boolean(id),
  })
}

export function useCreators() {
  return useQuery({ queryKey: marketingKeys.creators(), queryFn: getCreators })
}

export function useActivateCreators() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatorActivateInput) => activateCreators(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.creators() }),
  })
}

export function useReviewPrizes(status?: string, page?: number) {
  return useQuery({
    queryKey: marketingKeys.reviewPrizes(status, page),
    queryFn: () => getReviewPrizes(status, page),
  })
}

export function useEndReviewPrize() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => endReviewPrize(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.all }),
  })
}

export function useDuplicateReviewPrize() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => duplicateReviewPrize(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: marketingKeys.all }),
  })
}
