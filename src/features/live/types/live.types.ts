// Live & Video domain — all money is integer UZS.
// NO enums — string-union types + 'as const' arrays per TS erasableSyntaxOnly rule.

export type StreamStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'
export const STREAM_STATUSES: StreamStatus[] = ['scheduled', 'live', 'ended', 'cancelled']

export type StreamType = 'normal' | 'test'
export const STREAM_TYPES: StreamType[] = ['normal', 'test']

export type PromotionStatus = 'upcoming' | 'active' | 'ended' | 'cancelled'
export const PROMOTION_STATUSES: PromotionStatus[] = ['upcoming', 'active', 'ended', 'cancelled']
export type PromotionStatusFilter = 'all' | PromotionStatus
export const PROMOTION_STATUS_FILTERS: PromotionStatusFilter[] = ['all', 'upcoming', 'active', 'ended', 'cancelled']

// Analytics
export type AnalyticsOrderType = 'confirmed_order' | 'paid_order'
export type AnalyticsTab = 'data_overview' | 'cumulative_trend' | 'livestreams_list'
export type AnalyticsInnerTab = 'overview' | 'my_shop' | 'other_shops'
export type TrafficTab = 'performance' | 'traffic_source'
export type ConversionTab = 'performance' | 'conversion_funnel'

export interface MetricCard {
  key: string
  value: string
  delta: string | null
}

export interface LiveAnalyticsData {
  transaction: {
    tab: AnalyticsInnerTab
    cards: MetricCard[]
  }
  traffic: {
    tab: TrafficTab
    cards: MetricCard[]
  }
  conversion: {
    tab: ConversionTab
    cards: MetricCard[]
  }
  engagement: { cards: MetricCard[] }
  promotion: { cards: MetricCard[] }
}

export interface LiveAnalyticsQuery {
  date?: string
  orderType?: AnalyticsOrderType
}

// Streaming Price Promotions
export interface StreamingPricePromotion {
  id: string
  name: string
  status: PromotionStatus
  startAt: string
  endAt: string
  products: PromotionProduct[]
}

export interface PromotionProduct {
  productId: string
  productName: string
  coverUrl: string
  streamingPriceUzs: number
  originalPriceUzs: number
}

export interface CreatePromotionBody {
  name: string
  startAt: string
  endAt: string
  products: { productId: string; streamingPriceUzs: number }[]
}

export interface StreamingPriceListQuery {
  status?: PromotionStatusFilter
  name?: string
  start?: string
  end?: string
}

// Stream session
export interface StreamSession {
  id: string
  title: string
  description: string
  coverImageUrl: string
  status: StreamStatus
  isTest: boolean
  rtmpUrl: string
  streamKey: string
  livekitRoomName: string
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  products: StreamSessionProduct[]
}

export interface StreamSessionProduct {
  productId: string
  productName: string
  coverUrl: string
  priceUzs: number
  streamingPriceUzs: number | null
  commissionRate: number
  sortOrder: number
  pinnedAt: string | null
}

export interface CreateStreamBody {
  title: string
  description: string
  coverImageUrl: string
  isTest: boolean
  products: { productId: string; sortOrder: number }[]
}

export interface CreateStreamResponse {
  streamSessionId: string
  livekitRoomName: string
  rtmpUrl: string
  streamKey: string
}

// Normalised playback descriptor from the go-live response `playback` object.
// For the HOST, `joinToken` is the RealtimeKit publish authToken.
export interface Playback {
  transport: 'webrtc' | 'llhls'
  provider: string
  joinToken: string
  joinUrl: string
  hlsUrl: string
  posterUrl: string
}

// go-live now provisions RealtimeKit and returns the full session PLUS a playback
// descriptor + provider ids. The host camera publish authToken is playback.joinToken.
export interface StartStreamResult {
  session: StreamSession
  playback: Playback
  providerRoomId: string
  providerBroadcastId: string
}

export interface StreamStats {
  viewers: number
  likes: number
  shares: number
}

// Seller product picker (shared across live pages)
export interface SellerProduct {
  id: string
  name: string
  coverUrl: string
  priceUzs: number
  commissionRate: number
}
