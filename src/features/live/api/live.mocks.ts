// [PENDING BACKEND] MSW handlers for all live endpoints.
// All data is consistent + derived — no orphaned IDs.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  CreatePromotionBody,
  CreateStreamBody,
  LiveAnalyticsData,
  PromotionStatus,
  PromotionStatusFilter,
  SellerProduct,
  StreamSession,
  StreamingPricePromotion,
  StreamStats,
} from '../types/live.types'

const base = env.apiBaseUrl

// Seller product catalogue (shared reference)
const SELLER_PRODUCTS: SellerProduct[] = [
  { id: 'prod-1', name: 'Simsiz quloqchin Pro X', coverUrl: '', priceUzs: 189000, commissionRate: 3 },
  { id: 'prod-2', name: 'Smart soat GT7 Ultra', coverUrl: '', priceUzs: 349000, commissionRate: 3 },
  { id: 'prod-3', name: 'LED lenta 5m RGB', coverUrl: '', priceUzs: 79000, commissionRate: 2 },
]

// Empty analytics (no streams yet — all "—")
const EMPTY_ANALYTICS: LiveAnalyticsData = {
  transaction: {
    tab: 'overview',
    cards: [
      { key: 'sales', value: '—', delta: null },
      { key: 'orders', value: '—', delta: null },
      { key: 'total_items_sold', value: '—', delta: null },
      { key: 'sales_new_customers', value: '—', delta: null },
      { key: 'sales_old_customers', value: '—', delta: null },
      { key: 'abs', value: '—', delta: null },
      { key: 'sales_per_buyer', value: '—', delta: null },
    ],
  },
  traffic: {
    tab: 'performance',
    cards: [
      { key: 'total_sessions', value: '—', delta: null },
      { key: 'total_duration', value: '—', delta: null },
      { key: 'avg_duration_per_stream', value: '—', delta: null },
      { key: 'total_viewers', value: '—', delta: null },
      { key: 'engaged_viewers', value: '—', delta: null },
      { key: 'total_views', value: '—', delta: null },
      { key: 'pcu', value: '—', delta: null },
      { key: 'avg_viewing_duration', value: '—', delta: null },
    ],
  },
  conversion: {
    tab: 'performance',
    cards: [
      { key: 'ctr', value: '—', delta: null },
      { key: 'buyers', value: '—', delta: null },
      { key: 'click_to_order_rate', value: '—', delta: null },
      { key: 'total_atc', value: '—', delta: null },
      { key: 'gpm', value: '—', delta: null },
    ],
  },
  engagement: {
    cards: [
      { key: 'total_likes', value: '—', delta: null },
      { key: 'total_shares', value: '—', delta: null },
      { key: 'total_comments', value: '—', delta: null },
      { key: 'live_new_followers', value: '—', delta: null },
    ],
  },
  promotion: {
    cards: [
      { key: 'shop_voucher_claimed', value: '—', delta: null },
      { key: 'special_live_voucher_claimed', value: '—', delta: null },
      { key: 'coins_claimed', value: '—', delta: null },
    ],
  },
}

let PROMOTIONS: StreamingPricePromotion[] = []
const STREAMS: StreamSession[] = []
let nextPromId = 1

// Map the in-memory camelCase StreamSession back to the snake_case RawSession the
// API adapters (adaptSession) expect — so DEV exercises the same code path as prod.
function rawSession(s: StreamSession) {
  return {
    stream_session_id: s.id,
    title: s.title,
    description: s.description,
    cover_image_url: s.coverImageUrl,
    status: s.status,
    is_test: s.isTest,
    rtmp_url: s.rtmpUrl,
    stream_key: s.streamKey,
    livekit_room_name: s.livekitRoomName,
    started_at: s.startedAt,
    ended_at: s.endedAt,
    created_at: s.createdAt,
    products: s.products.map((p) => ({
      product_id: p.productId,
      product_name: p.productName,
      cover_url: p.coverUrl,
      price_uzs: p.priceUzs,
      streaming_price_uzs: p.streamingPriceUzs,
      commission_rate: p.commissionRate,
      sort_order: p.sortOrder,
      pinned_at: p.pinnedAt,
    })),
  }
}

export const liveHandlers = [
  // Analytics [PENDING BACKEND]
  http.get(`${base}/sellers/me/live/analytics`, () => {
    return HttpResponse.json(EMPTY_ANALYTICS)
  }),

  // Analytics export [PENDING BACKEND]
  http.get(`${base}/sellers/me/live/analytics/export`, () => {
    return new HttpResponse('date,sales\n2026-06-16,0\n', {
      headers: { 'Content-Type': 'text/csv' },
    })
  }),

  // Promotions list [PENDING BACKEND]
  http.get(`${base}/sellers/me/streaming-price-promotions`, ({ request }) => {
    const url = new URL(request.url)
    const status = (url.searchParams.get('status') ?? 'all') as PromotionStatusFilter
    const name = url.searchParams.get('name')?.toLowerCase() ?? ''
    let items = PROMOTIONS
    if (status !== 'all') items = items.filter((p) => p.status === (status as PromotionStatus))
    if (name) items = items.filter((p) => p.name.toLowerCase().includes(name))
    return HttpResponse.json({ promotions: items, total: items.length })
  }),

  // Create promotion [PENDING BACKEND]
  http.post(`${base}/sellers/me/streaming-price-promotions`, async ({ request }) => {
    const body = (await request.json()) as CreatePromotionBody
    const now = new Date()
    const start = new Date(body.startAt)
    const status: PromotionStatus = start > now ? 'upcoming' : 'active'
    const promo: StreamingPricePromotion = {
      id: `promo-${nextPromId++}`,
      name: body.name,
      status,
      startAt: body.startAt,
      endAt: body.endAt,
      products: body.products.map((p) => {
        const ref = SELLER_PRODUCTS.find((sp) => sp.id === p.productId)
        return {
          productId: p.productId,
          productName: ref?.name ?? 'Unknown product',
          coverUrl: ref?.coverUrl ?? '',
          streamingPriceUzs: p.streamingPriceUzs,
          originalPriceUzs: ref?.priceUzs ?? 0,
        }
      }),
    }
    PROMOTIONS.push(promo)
    return HttpResponse.json(promo, { status: 201 })
  }),

  // Delete promotion [PENDING BACKEND]
  http.delete(`${base}/sellers/me/streaming-price-promotions/:id`, ({ params }) => {
    PROMOTIONS = PROMOTIONS.filter((p) => p.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  // Seller products (product picker) [PENDING BACKEND]
  http.get(`${base}/sellers/me/products`, () => {
    return HttpResponse.json({ products: SELLER_PRODUCTS.map((p) => ({
      id: p.id,
      title: { uz: p.name },
      image_urls: p.coverUrl ? [p.coverUrl] : [],
      price_uzs: p.priceUzs,
    })) })
  }),

  // Media upload URL (cover image) — returns a fake signed URL + public_url.
  http.post(`${base}/media/upload-url`, () => {
    return HttpResponse.json({
      key: `uploads/product/${crypto.randomUUID()}`,
      upload_url: 'https://mock-r2.example.com/upload/cover.jpg?sig=mock',
      public_url: `https://media.ozb.ac/mock/cover-${Date.now()}.jpg`,
    })
  }),

  // Create stream — returns RawSession (snake_case), status=scheduled.
  http.post(`${base}/sellers/me/streams`, async ({ request }) => {
    const body = (await request.json()) as CreateStreamBody
    const id = `stream-${Date.now()}`
    const session: StreamSession = {
      id,
      title: body.title,
      description: body.description,
      coverImageUrl: body.coverImageUrl,
      status: 'scheduled',
      isTest: body.isTest,
      rtmpUrl: 'rtmp://live-ingest.ozb.ac/live/',
      streamKey: `ozb-live-${id}-key-${Math.random().toString(36).slice(2, 10)}`,
      livekitRoomName: `room-${id}`,
      startedAt: null,
      endedAt: null,
      createdAt: new Date().toISOString(),
      products: body.products.map((p, i) => {
        const ref = SELLER_PRODUCTS.find((sp) => sp.id === p.productId)
        return {
          productId: p.productId,
          productName: ref?.name ?? 'Unknown',
          coverUrl: ref?.coverUrl ?? '',
          priceUzs: ref?.priceUzs ?? 0,
          streamingPriceUzs: null,
          commissionRate: ref?.commissionRate ?? 3,
          sortOrder: p.sortOrder ?? i,
          pinnedAt: null,
        }
      }),
    }
    STREAMS.push(session)
    return HttpResponse.json(rawSession(session), { status: 201 })
  }),

  // Get stream — RawSession.
  http.get(`${base}/sellers/me/streams/:id`, ({ params }) => {
    const s = STREAMS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(rawSession(s))
  }),

  // Go-live — flips status=live + returns playback descriptor (mock token).
  http.post(`${base}/sellers/me/streams/:id/go-live`, ({ params }) => {
    const s = STREAMS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    s.status = 'live'
    s.startedAt = new Date().toISOString()
    const roomId = `rtk-room-${s.id}`
    return HttpResponse.json({
      ...rawSession(s),
      provider_room_id: roomId,
      provider_broadcast_id: `rtk-bcast-${s.id}`,
      // NOTE: mock token is not a real RealtimeKit authToken — the SDK init will fail
      // in DEV; that's expected (no creds locally). The FE surfaces it cleanly.
      playback: {
        transport: 'webrtc',
        provider: 'realtimekit',
        join_token: `mock-host-token-${s.id}`,
        join_url: '',
        hls_url: '',
        poster_url: '',
      },
    })
  }),

  // End stream — flips status=ended.
  http.post(`${base}/sellers/me/streams/:id/end`, ({ params }) => {
    const s = STREAMS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    s.status = 'ended'
    s.endedAt = new Date().toISOString()
    return HttpResponse.json(rawSession(s))
  }),

  // Notify followers [PENDING BACKEND]
  http.post(`${base}/sellers/me/streams/:id/notify-followers`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Regenerate key [PENDING BACKEND]
  http.post(`${base}/sellers/me/streams/:id/regenerate-key`, ({ params }) => {
    const s = STREAMS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    s.streamKey = `ozb-live-regen-${Math.random().toString(36).slice(2, 10)}`
    return HttpResponse.json({ stream_key: s.streamKey })
  }),

  // Pin product [PENDING BACKEND]
  http.post(`${base}/sellers/me/streams/:id/products/:productId/pin`, ({ params }) => {
    const s = STREAMS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    s.products.forEach((p) => { p.pinnedAt = null })
    const prod = s.products.find((p) => p.productId === params.productId)
    if (prod) prod.pinnedAt = new Date().toISOString()
    return new HttpResponse(null, { status: 204 })
  }),

  // Reorder products [PENDING BACKEND]
  http.patch(`${base}/sellers/me/streams/:id/products/reorder`, async ({ params, request }) => {
    const items = (await request.json()) as { productId: string; sortOrder: number }[]
    const s = STREAMS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    items.forEach(({ productId, sortOrder }) => {
      const p = s.products.find((p) => p.productId === productId)
      if (p) p.sortOrder = sortOrder
    })
    return new HttpResponse(null, { status: 204 })
  }),

  // Remove product [PENDING BACKEND]
  http.delete(`${base}/sellers/me/streams/:id/products/:productId`, ({ params }) => {
    const s = STREAMS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    s.products = s.products.filter((p) => p.productId !== params.productId)
    return new HttpResponse(null, { status: 204 })
  }),

  // Stream stats [PENDING BACKEND]
  http.get(`${base}/sellers/me/streams/:id/stats`, () => {
    const stats: StreamStats = { viewers: 0, likes: 0, shares: 0 }
    return HttpResponse.json({ ...stats, comments: 0 })
  }),
]
