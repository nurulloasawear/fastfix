// Extended TanStack Query hooks for shop info, KYC, new decoration, top picks, appeals, missions.
// Re-exported from shop.queries.ts.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAppeals,
  getDecorationById,
  getDecorationDrafts,
  getMissions,
  getRewards,
  getShopInfo,
  getShopKyc,
  getTopPicks,
  getTopPicksDetail,
  markIntroSeen,
  patchShopInfo,
  patchTopPicksDetail,
  publishDecoration,
  saveDecorationDraft,
} from './shop.api'
import type {
  AppealsQuery,
  DecorationContent,
  ShopInfoUpdate,
  TopPicksDetail,
} from '../types/shop.types'
import { shopKeys } from './shop.query-keys'

// --- Shop Info ---
export function useShopInfo() {
  return useQuery({ queryKey: shopKeys.shopInfo(), queryFn: getShopInfo })
}

export function usePatchShopInfo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ShopInfoUpdate) => patchShopInfo(payload),
    onSuccess: (data) => qc.setQueryData(shopKeys.shopInfo(), data),
  })
}

export function useShopKyc() {
  return useQuery({ queryKey: shopKeys.shopKyc(), queryFn: getShopKyc })
}

// --- Decoration Drafts ---
export function useDecorationDrafts(platform: string) {
  return useQuery({
    queryKey: shopKeys.decorationDrafts(platform),
    queryFn: () => getDecorationDrafts(platform),
  })
}

export function useDecorationContent(id: string) {
  return useQuery({
    queryKey: shopKeys.decorationContent(id),
    queryFn: () => getDecorationById(id),
    enabled: Boolean(id),
  })
}

export function useSaveDecorationDraft(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (widgets: DecorationContent['widgets']) => saveDecorationDraft(id, widgets),
    onSuccess: (data) => qc.setQueryData(shopKeys.decorationContent(id), data),
  })
}

export function usePublishDecoration(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => publishDecoration(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.decorationDrafts('mobile') }),
  })
}

// --- Top Picks ---
export function useTopPicks() {
  return useQuery({ queryKey: shopKeys.topPicks(), queryFn: getTopPicks })
}

export function useTopPicksDetail(id: string) {
  return useQuery({
    queryKey: shopKeys.topPicksDetail(id),
    queryFn: () => getTopPicksDetail(id),
    enabled: Boolean(id),
  })
}

export function usePatchTopPicks(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<TopPicksDetail>) => patchTopPicksDetail(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.topPicks() }),
  })
}

// --- Appeals ---
export function useAppeals(query: AppealsQuery) {
  return useQuery({
    queryKey: shopKeys.appeals(query),
    queryFn: () => getAppeals(query),
  })
}

// --- Missions ---
export function useMissions() {
  return useQuery({ queryKey: shopKeys.missions(), queryFn: getMissions })
}

export function useMarkIntroSeen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markIntroSeen,
    onSuccess: () => qc.invalidateQueries({ queryKey: shopKeys.missions() }),
  })
}

export function useRewardsList() {
  return useQuery({ queryKey: shopKeys.rewards(), queryFn: getRewards })
}
