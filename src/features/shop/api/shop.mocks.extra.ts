// MSW handlers for shop info, KYC, decoration, top picks, appeals, and missions.
// /sellers/me (GET + PUT) and /media/upload-url mirror the REAL backend shape.
// All other handlers are [PENDING BACKEND] — they serve mock data so dev ≈ prod mapping code.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  Appeal,
  DecorationContent,
  DecorationDraft,
  Mission,
  SellerReward,
  ShopKyc,
  TopPicksCollection,
  TopPicksDetail,
} from '../types/shop.types'

const base = env.apiBaseUrl

// ── Seed data ─────────────────────────────────────────────────────────────────

// R2 public base — PUT /sellers/me rejects logo/banner URLs not under this prefix
// with 400 {error:"invalid_media_url"} (matches the /media/upload-url public_url host).
const R2_BASE = 'https://cdn.ozb.ac/'

// Backend shape for GET /sellers/me (real route, rich response).
// status enum: pending|approved|suspended. shop.api.ts mapSellersMeToShopInfo() maps this.
const sellersMeSeed: {
  id: string
  shop_name: string
  status: string
  description: { uz: string; ru: string; en: string }
  logo_url: string | null
  banner_url: string | null
  vat_percent: number
  product_count: number
  registered_at: string
  created_at: string
} = {
  id: '0190c100-2001-7000-8000-000000002001',
  shop_name: 'OZB Official Store',
  status: 'approved',
  description: {
    uz: 'Sifatli, zamonaviy va hamyonbop mahsulotlar faqat bizning doʻkonda.',
    ru: 'Качественные, современные и доступные товары только в нашем магазине.',
    en: 'Quality, modern and affordable products only in our store.',
  },
  logo_url: null,
  banner_url: null,
  vat_percent: 12,
  product_count: 145,
  registered_at: '2026-05-12T00:00:00Z',
  created_at: '2026-05-12T00:00:00Z',
}


const kycSeed: ShopKyc = {
  status: 'approved',
  submittedAt: '2026-05-20T10:00:00Z',
  verificationMethod: 'ob_label_manual_form',
  sellerType: 'individual',
  fullName: 'Ulugbek Yuldashev',
  idType: 'pinfl',
  idLastFour: '840P',
  addressMasked: 'Toshkent, Chilonzor 9-kvartal, ****',
}

const decorationDrafts: DecorationDraft[] = [
  { id: 'draft-mobile-1', name: 'Current Shop Decoration', platform: 'mobile', status: 'published', updatedAt: '2024-02-09T13:27:00Z' },
  { id: 'draft-pc-1',     name: 'Current Shop Decoration', platform: 'pc',     status: 'published', updatedAt: '2024-02-09T13:27:00Z' },
]

const decorationContents: DecorationContent[] = [
  {
    id: 'draft-mobile-1', name: 'Current Shop Decoration', platform: 'mobile',
    status: 'published', updatedAt: '2024-02-09T13:27:00Z', publishedAt: '2024-02-09T13:27:00Z',
    widgets: [
      { id: 'w1', type: 'cover_image',        order: 1, config: { imageUrl: null } },
      { id: 'w2', type: 'product_highlights', order: 2, config: { productIds: [], displayCount: 4 } },
    ],
  },
]

const topPicksCollections: TopPicksCollection[] = [
  { id: 'tp-1', name: 'Top Electronics', isDisplayed: true, displayOrder: 1, productCount: 2 },
]

const topPicksDetails: TopPicksDetail[] = [
  {
    id: 'tp-1', name: 'Top Electronics', isDisplayed: true, allowPersonalization: true,
    products: [
      { id: 'p1', name: 'Simsiz quloqchin Pro', priceUzs: 698000, salesCount: 42, imageUrl: null, isAbnormal: false },
      { id: 'p2', name: 'Smart LED lenta 5m',   priceUzs: 129000, salesCount: 28, imageUrl: null, isAbnormal: false },
    ],
  },
]

const appeals: Appeal[] = []

const missions: Mission[] = [
  {
    id: 'm1', title: 'Complete the Business Insights course',
    description: 'Get 2 extra slots for Bump',
    rewardDescription: '2 ta qoʻshimcha Bump uyasi',
    status: 'not_started',
    tasks: [{ id: 't1', description: 'Complete all lessons', isCompleted: false }],
  },
]

const sellerRewards: SellerReward[] = []

// ── Handlers ──────────────────────────────────────────────────────────────────
export const shopExtraHandlers = [
  // --- GET /sellers/me (real route, rich backend shape) ───────────────────────
  // Registered before settingHandlers in handlers.ts, so this richer response wins.
  // It is a superset of setting's {id,shop_name,status,registered_at}, so setting's
  // mapSeller() still works (it ignores the extra fields).
  http.get(`${base}/sellers/me`, () => HttpResponse.json(sellersMeSeed)),

  // --- PUT /sellers/me (real route) → {updated:true} ──────────────────────────
  // body {shop_name?, description?, logo_url?, banner_url?}. A logo/banner URL not
  // under the R2 base → 400 {error:"invalid_media_url"} (mirrors backend validation).
  http.put(`${base}/sellers/me`, async ({ request }) => {
    const patch = (await request.json()) as {
      shop_name?: string
      description?: { uz?: string; ru?: string; en?: string }
      logo_url?: string
      banner_url?: string
    }
    const badLogo = patch.logo_url !== undefined && !patch.logo_url.startsWith(R2_BASE)
    const badBanner = patch.banner_url !== undefined && !patch.banner_url.startsWith(R2_BASE)
    if (badLogo || badBanner) {
      return HttpResponse.json({ error: 'invalid_media_url' }, { status: 400 })
    }
    if (patch.shop_name !== undefined) sellersMeSeed.shop_name = patch.shop_name
    if (patch.description !== undefined) {
      sellersMeSeed.description = { ...sellersMeSeed.description, ...patch.description }
    }
    if (patch.logo_url !== undefined) sellersMeSeed.logo_url = patch.logo_url
    if (patch.banner_url !== undefined) sellersMeSeed.banner_url = patch.banner_url
    return HttpResponse.json({ updated: true })
  }),

  // --- /media/upload-url (real route, backend-shaped) ──────────────────────────
  // Returns a fake signed upload URL; public_url (under R2_BASE) is what gets stored.
  // kind: avatar | product | video
  http.post(`${base}/media/upload-url`, async ({ request }) => {
    const body = (await request.json()) as { content_type?: string; kind?: string }
    const key = `uploads/${body.kind ?? 'product'}/${crypto.randomUUID()}`
    return HttpResponse.json({
      key,
      upload_url: `https://r2.ozb.ac/${key}?X-Mock-Signed=1`,
      public_url: `${R2_BASE}${key}`,
    })
  }),

  // KYC
  http.get(`${base}/shop/kyc`, () => HttpResponse.json(kycSeed)),

  // Decoration drafts
  http.get(`${base}/shop/decoration`, ({ request }) => {
    const url = new URL(request.url)
    const platform = url.searchParams.get('platform') ?? 'mobile'
    return HttpResponse.json(decorationDrafts.filter((d) => d.platform === platform))
  }),
  http.get(`${base}/shop/decoration/:id`, ({ params }) => {
    const draft = decorationContents.find((d) => d.id === params.id)
    if (!draft) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(draft)
  }),
  http.put(`${base}/shop/decoration/:id/draft`, async ({ params, request }) => {
    const { widgets } = (await request.json()) as Pick<DecorationContent, 'widgets'>
    const idx = decorationContents.findIndex((d) => d.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    decorationContents[idx] = { ...decorationContents[idx]!, widgets, updatedAt: new Date().toISOString() }
    return HttpResponse.json(decorationContents[idx])
  }),
  http.post(`${base}/shop/decoration/:id/publish`, ({ params }) => {
    const idx = decorationContents.findIndex((d) => d.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    decorationContents[idx] = { ...decorationContents[idx]!, status: 'published', publishedAt: new Date().toISOString() }
    const di = decorationDrafts.findIndex((d) => d.id === params.id)
    if (di !== -1) decorationDrafts[di] = { ...decorationDrafts[di]!, status: 'published' }
    return HttpResponse.json(decorationContents[idx])
  }),

  // Top Picks
  http.get(`${base}/shop/top-picks`, () => HttpResponse.json(topPicksCollections)),
  http.get(`${base}/shop/top-picks/:id`, ({ params }) => {
    const found = topPicksDetails.find((d) => d.id === params.id)
    if (!found) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(found)
  }),
  http.patch(`${base}/shop/top-picks/:id`, async ({ params, request }) => {
    const patch = (await request.json()) as Partial<TopPicksDetail>
    const idx = topPicksDetails.findIndex((d) => d.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    topPicksDetails[idx] = { ...topPicksDetails[idx]!, ...patch }
    return HttpResponse.json(topPicksDetails[idx])
  }),

  // Appeals
  http.get(`${base}/shop/appeals`, ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const status = url.searchParams.get('status')
    let filtered = appeals.filter((a) => a.appealType === type)
    if (status) filtered = filtered.filter((a) => a.status === status)
    return HttpResponse.json({ appeals: filtered, total: filtered.length })
  }),

  // Missions
  http.get(`${base}/shop/missions`, () => HttpResponse.json({ missions, introSeen: false })),
  http.post(`${base}/shop/missions/intro-seen`, () => new HttpResponse(null, { status: 204 })),

  // Rewards
  http.get(`${base}/shop/missions/rewards`, () => HttpResponse.json({ rewards: sellerRewards })),
]
