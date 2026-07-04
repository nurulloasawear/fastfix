import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreatePromotionBody, CreateStreamBody, LiveAnalyticsQuery, StreamingPriceListQuery } from '../types/live.types'
import {
  createPromotion,
  createStream,
  deletePromotion,
  endStream,
  getLiveAnalytics,
  getSellerProducts,
  getStream,
  getStreamStats,
  getStreamingPricePromotions,
  notifyFollowers,
  pinStreamProduct,
  regenerateStreamKey,
  removeStreamProduct,
  reorderStreamProducts,
  startStream,
  uploadCoverImage,
} from './live.api'

export const liveKeys = {
  all: ['live'] as const,
  analytics: (q: LiveAnalyticsQuery) => [...liveKeys.all, 'analytics', q] as const,
  promotions: (q: StreamingPriceListQuery) => [...liveKeys.all, 'promotions', q] as const,
  stream: (id: string) => [...liveKeys.all, 'stream', id] as const,
  stats: (id: string) => [...liveKeys.all, 'stats', id] as const,
  sellerProducts: () => [...liveKeys.all, 'sellerProducts'] as const,
}

export function useLiveAnalytics(query: LiveAnalyticsQuery) {
  return useQuery({ queryKey: liveKeys.analytics(query), queryFn: () => getLiveAnalytics(query) })
}

export function useStreamingPricePromotions(query: StreamingPriceListQuery) {
  return useQuery({ queryKey: liveKeys.promotions(query), queryFn: () => getStreamingPricePromotions(query) })
}

export function useStream(id: string) {
  return useQuery({ queryKey: liveKeys.stream(id), queryFn: () => getStream(id), enabled: Boolean(id) })
}

export function useStreamStats(id: string, enabled: boolean) {
  return useQuery({
    queryKey: liveKeys.stats(id),
    queryFn: () => getStreamStats(id),
    enabled: enabled && Boolean(id),
    refetchInterval: 5000,
  })
}

export function useSellerProducts() {
  return useQuery({ queryKey: liveKeys.sellerProducts(), queryFn: () => getSellerProducts() })
}

export function useCreatePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreatePromotionBody) => createPromotion(body),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: [...liveKeys.all, 'promotions'] }) },
  })
}

export function useDeletePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: [...liveKeys.all, 'promotions'] }) },
  })
}

export function useCreateStream() {
  return useMutation({ mutationFn: (body: CreateStreamBody) => createStream(body) })
}

// Uploads the cover file to R2 and returns the public https URL to send as cover_image_url.
export function useUploadCoverImage() {
  return useMutation({ mutationFn: (file: File) => uploadCoverImage(file) })
}

// go-live: provisions RealtimeKit + flips status=live. Returns {session, playback,
// providerRoomId, ...}. We seed the stream cache with the fresh session so the
// preview page reflects status=live immediately, then invalidate to refetch.
export function useStartStream() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => startStream(id),
    onSuccess: (result, id) => {
      qc.setQueryData(liveKeys.stream(id), result.session)
      void qc.invalidateQueries({ queryKey: liveKeys.stream(id) })
    },
  })
}

// end: flips status=ended + tears down the provider room server-side.
export function useEndStream() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => endStream(id),
    onSuccess: (session, id) => {
      qc.setQueryData(liveKeys.stream(id), session)
    },
  })
}

export function useNotifyFollowers() {
  return useMutation({ mutationFn: (id: string) => notifyFollowers(id) })
}

export function useRegenerateStreamKey() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => regenerateStreamKey(id),
    onSuccess: (_d, id) => { void qc.invalidateQueries({ queryKey: liveKeys.stream(id) }) },
  })
}

export function usePinStreamProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ streamId, productId }: { streamId: string; productId: string }) =>
      pinStreamProduct(streamId, productId),
    onSuccess: (_d, { streamId }) => { void qc.invalidateQueries({ queryKey: liveKeys.stream(streamId) }) },
  })
}

export function useReorderStreamProducts() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ streamId, items }: { streamId: string; items: { productId: string; sortOrder: number }[] }) =>
      reorderStreamProducts(streamId, items),
    onSuccess: (_d, { streamId }) => { void qc.invalidateQueries({ queryKey: liveKeys.stream(streamId) }) },
  })
}

export function useRemoveStreamProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ streamId, productId }: { streamId: string; productId: string }) =>
      removeStreamProduct(streamId, productId),
    onSuccess: (_d, { streamId }) => { void qc.invalidateQueries({ queryKey: liveKeys.stream(streamId) }) },
  })
}
