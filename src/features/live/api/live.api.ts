// Live & Video — wired to live backend (2026-06-17)
// baseURL = /api/v1 (set in apiClient). All seller routes under /sellers/me/...
// LiveKit rtmp_url / stream_key come back as stubs — mapped through as-is.
// Buyer-facing stream routes remain on mock (not seller-portal scope).
import { apiClient } from '@/lib/axios'
import type {
  CreatePromotionBody,
  CreateStreamBody,
  CreateStreamResponse,
  LiveAnalyticsData,
  LiveAnalyticsQuery,
  Playback,
  SellerProduct,
  StartStreamResult,
  StreamingPriceListQuery,
  StreamingPricePromotion,
  StreamSession,
  StreamSessionProduct,
  StreamStats,
} from '../types/live.types'

const PATHS = {
  // Live analytics
  analytics: '/sellers/me/live/analytics',
  analyticsExport: '/sellers/me/live/analytics/export',
  liveSessions: '/sellers/me/live/sessions',

  // Streaming price promotions
  promotions: '/sellers/me/streaming-price-promotions',
  promotion: (id: string) => `/sellers/me/streaming-price-promotions/${id}`,

  // Stream sessions (seller-scoped)
  streams: '/sellers/me/streams',
  stream: (id: string) => `/sellers/me/streams/${id}`,
  streamGoLive: (id: string) => `/sellers/me/streams/${id}/go-live`,
  streamEnd: (id: string) => `/sellers/me/streams/${id}/end`,
  streamNotify: (id: string) => `/sellers/me/streams/${id}/notify-followers`,
  streamRegenKey: (id: string) => `/sellers/me/streams/${id}/regenerate-key`,
  streamStats: (id: string) => `/sellers/me/streams/${id}/stats`,

  // Stream products (seller-scoped)
  streamProducts: (id: string) => `/sellers/me/streams/${id}/products`,
  streamProduct: (id: string, productId: string) => `/sellers/me/streams/${id}/products/${productId}`,
  streamProductPin: (id: string, productId: string) => `/sellers/me/streams/${id}/products/${productId}/pin`,
  streamProductsReorder: (id: string) => `/sellers/me/streams/${id}/products/reorder`,

  // Seller product picker (pre-existing endpoint)
  sellerProducts: '/sellers/me/products',

  // Media upload (presigned R2 PUT) — used for the stream cover image
  mediaUploadUrl: '/media/upload-url',
}

// ─── Shape adapters (snake_case BE → camelCase FE) ───────────────────────────

type RawSessionProduct = {
  product_id: string
  product_name: string
  cover_url: string
  price_uzs: number
  streaming_price_uzs: number | null
  commission_rate: number
  sort_order: number
  pinned_at: string | null
}

type RawSession = {
  stream_session_id: string
  title: string
  description: string
  cover_image_url: string
  status: StreamSession['status']
  is_test: boolean
  rtmp_url: string
  stream_key: string
  livekit_room_name: string
  started_at: string | null
  ended_at: string | null
  created_at: string
  products: RawSessionProduct[]
}

type RawPlayback = {
  transport?: 'webrtc' | 'llhls'
  provider?: string
  join_token?: string
  join_url?: string
  hls_url?: string
  poster_url?: string
}

// go-live returns the full session body PLUS these media fields (added when
// sellerlive was wired to the RealtimeKit provider). join_token is host-only and
// returned in THIS response only (never persisted/refetched).
type RawGoLiveSession = RawSession & {
  playback?: RawPlayback
  provider_room_id?: string
  provider_broadcast_id?: string
}

type RawPromotion = {
  id: string
  name: string
  status: StreamingPricePromotion['status']
  start_at: string
  end_at: string
  product_count: number
  products: Array<{
    product_id: string
    product_name: string
    cover_url: string
    streaming_price_uzs: number
    original_price_uzs: number
  }>
}

type RawSellerProduct = {
  id: string
  title: { uz?: string; ru?: string; en?: string }
  image_urls: string[]
  price_uzs: number
}

function adaptSessionProduct(p: RawSessionProduct): StreamSessionProduct {
  return {
    productId: p.product_id,
    productName: p.product_name,
    coverUrl: p.cover_url,
    priceUzs: p.price_uzs,
    streamingPriceUzs: p.streaming_price_uzs ?? null,
    commissionRate: p.commission_rate ?? 3,
    sortOrder: p.sort_order ?? 0,
    pinnedAt: p.pinned_at ?? null,
  }
}

function adaptSession(raw: RawSession): StreamSession {
  return {
    id: raw.stream_session_id,
    title: raw.title,
    description: raw.description ?? '',
    coverImageUrl: raw.cover_image_url ?? '',
    status: raw.status,
    isTest: raw.is_test ?? false,
    rtmpUrl: raw.rtmp_url ?? '',
    streamKey: raw.stream_key ?? '',
    livekitRoomName: raw.livekit_room_name ?? '',
    startedAt: raw.started_at ?? null,
    endedAt: raw.ended_at ?? null,
    createdAt: raw.created_at,
    products: (raw.products ?? []).map(adaptSessionProduct),
  }
}

function adaptPlayback(raw: RawPlayback | undefined): Playback {
  return {
    transport: raw?.transport ?? 'webrtc',
    provider: raw?.provider ?? '',
    joinToken: raw?.join_token ?? '',
    joinUrl: raw?.join_url ?? '',
    hlsUrl: raw?.hls_url ?? '',
    posterUrl: raw?.poster_url ?? '',
  }
}

function adaptPromotion(raw: RawPromotion): StreamingPricePromotion {
  return {
    id: raw.id,
    name: raw.name,
    status: raw.status,
    startAt: raw.start_at,
    endAt: raw.end_at,
    products: (raw.products ?? []).map(p => ({
      productId: p.product_id,
      productName: p.product_name,
      coverUrl: p.cover_url,
      streamingPriceUzs: p.streaming_price_uzs,
      originalPriceUzs: p.original_price_uzs,
    })),
  }
}

function adaptSellerProduct(raw: RawSellerProduct): SellerProduct {
  const name = raw.title?.uz || raw.title?.ru || raw.title?.en || ''
  return {
    id: raw.id,
    name,
    coverUrl: raw.image_urls?.[0] ?? '',
    priceUzs: raw.price_uzs,
    commissionRate: 3, // hardcoded platform commission for v1
  }
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getLiveAnalytics(query: LiveAnalyticsQuery): Promise<LiveAnalyticsData> {
  // FE uses camelCase query key; BE expects snake_case
  const params: Record<string, string> = {}
  if (query.date) params.date = query.date
  if (query.orderType) params.order_type = query.orderType
  const { data } = await apiClient.get<LiveAnalyticsData>(PATHS.analytics, { params })
  return data
}

export async function getStreamingPricePromotions(
  query: StreamingPriceListQuery,
): Promise<{ promotions: StreamingPricePromotion[]; total: number }> {
  const { data } = await apiClient.get<{ promotions: RawPromotion[]; total: number }>(
    PATHS.promotions,
    { params: query },
  )
  return {
    promotions: (data.promotions ?? []).map(adaptPromotion),
    total: data.total,
  }
}

export async function createPromotion(
  body: CreatePromotionBody,
): Promise<StreamingPricePromotion> {
  const payload = {
    name: body.name,
    start_at: body.startAt,
    end_at: body.endAt,
    products: body.products.map(p => ({
      product_id: p.productId,
      streaming_price_uzs: p.streamingPriceUzs,
    })),
  }
  const { data } = await apiClient.post<RawPromotion>(PATHS.promotions, payload)
  return adaptPromotion(data)
}

export async function updatePromotion(
  id: string,
  patch: { name?: string; startAt?: string; endAt?: string; status?: string },
): Promise<StreamingPricePromotion> {
  const payload: Record<string, string | undefined> = {}
  if (patch.name !== undefined) payload.name = patch.name
  if (patch.startAt !== undefined) payload.start_at = patch.startAt
  if (patch.endAt !== undefined) payload.end_at = patch.endAt
  if (patch.status !== undefined) payload.status = patch.status
  const { data } = await apiClient.patch<RawPromotion>(PATHS.promotion(id), payload)
  return adaptPromotion(data)
}

export async function deletePromotion(id: string): Promise<void> {
  await apiClient.delete(PATHS.promotion(id))
}

export async function createStream(body: CreateStreamBody): Promise<CreateStreamResponse> {
  const payload = {
    title: body.title,
    description: body.description,
    cover_image_url: body.coverImageUrl,
    is_test: body.isTest,
    products: body.products.map(p => ({
      product_id: p.productId,
      sort_order: p.sortOrder,
    })),
  }
  const { data } = await apiClient.post<RawSession>(PATHS.streams, payload)
  return {
    streamSessionId: data.stream_session_id,
    livekitRoomName: data.livekit_room_name ?? '',
    rtmpUrl: data.rtmp_url ?? '',
    streamKey: data.stream_key ?? '',
  }
}

export async function getStream(id: string): Promise<StreamSession> {
  const { data } = await apiClient.get<RawSession>(PATHS.stream(id))
  return adaptSession(data)
}

// go-live now provisions RealtimeKit server-side and returns the session body PLUS
// a `playback` descriptor (host publish authToken = playback.join_token) and the
// provider ids. We surface all three so the preview console can mount BroadcastStage.
export async function startStream(id: string): Promise<StartStreamResult> {
  const { data } = await apiClient.post<RawGoLiveSession>(PATHS.streamGoLive(id), {})
  return {
    session: adaptSession(data),
    playback: adaptPlayback(data.playback),
    providerRoomId: data.provider_room_id ?? '',
    providerBroadcastId: data.provider_broadcast_id ?? '',
  }
}

export async function endStream(id: string): Promise<StreamSession> {
  const { data } = await apiClient.post<RawSession>(PATHS.streamEnd(id), {})
  return adaptSession(data)
}

export async function notifyFollowers(id: string): Promise<void> {
  await apiClient.post(PATHS.streamNotify(id), {})
}

export async function regenerateStreamKey(id: string): Promise<{ streamKey: string }> {
  const { data } = await apiClient.post<{ stream_key: string }>(PATHS.streamRegenKey(id), {})
  return { streamKey: data.stream_key }
}

export async function getStreamStats(id: string): Promise<StreamStats> {
  const { data } = await apiClient.get<{ viewers: number; likes: number; shares: number; comments: number }>(
    PATHS.streamStats(id),
  )
  return {
    viewers: data.viewers,
    likes: data.likes,
    shares: data.shares,
  }
}

export async function getStreamProducts(
  streamId: string,
): Promise<{ products: StreamSessionProduct[]; total: number }> {
  const { data } = await apiClient.get<{ products: RawSessionProduct[]; total: number }>(
    PATHS.streamProducts(streamId),
  )
  return {
    products: (data.products ?? []).map(adaptSessionProduct),
    total: data.total,
  }
}

export async function addStreamProducts(
  streamId: string,
  items: { productId: string; sortOrder: number }[],
): Promise<{ products: StreamSessionProduct[]; total: number }> {
  const payload = {
    products: items.map(p => ({ product_id: p.productId, sort_order: p.sortOrder })),
  }
  const { data } = await apiClient.post<{ products: RawSessionProduct[]; total: number }>(
    PATHS.streamProducts(streamId),
    payload,
  )
  return {
    products: (data.products ?? []).map(adaptSessionProduct),
    total: data.total,
  }
}

export async function pinStreamProduct(streamId: string, productId: string): Promise<void> {
  await apiClient.post(PATHS.streamProductPin(streamId, productId), {})
}

export async function unpinStreamProduct(streamId: string, productId: string): Promise<void> {
  await apiClient.delete(PATHS.streamProductPin(streamId, productId))
}

export async function reorderStreamProducts(
  streamId: string,
  items: { productId: string; sortOrder: number }[],
): Promise<void> {
  const payload = items.map(p => ({ product_id: p.productId, sort_order: p.sortOrder }))
  await apiClient.patch(PATHS.streamProductsReorder(streamId), payload)
}

export async function removeStreamProduct(streamId: string, productId: string): Promise<void> {
  await apiClient.delete(PATHS.streamProduct(streamId, productId))
}

export async function getSellerProducts(): Promise<SellerProduct[]> {
  const { data } = await apiClient.get<{ products: RawSellerProduct[] }>(PATHS.sellerProducts)
  return (data.products ?? []).map(adaptSellerProduct)
}

// ─── Cover image upload (presigned R2 PUT) ───────────────────────────────────
// Mirrors the products/shop upload flow: POST /media/upload-url → {upload_url,
// public_url} → PUT binary to upload_url → store public_url as cover_image_url.
// Without this the cover would be a useless `blob:` object URL.
export async function uploadCoverImage(file: File): Promise<string> {
  const { data } = await apiClient.post<{ upload_url: string; public_url: string }>(
    PATHS.mediaUploadUrl,
    { content_type: file.type, kind: 'product' },
  )
  await fetch(data.upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  return data.public_url
}
