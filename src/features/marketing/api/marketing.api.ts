import { apiClient } from '@/lib/axios'
import type {
  AdCampaign,
  AdsRecommendation,
  AdsResponse,
  CampaignDetailResponse,
  CampaignsResponse,
  CreateFlashDealInput,
  CreateVoucherInput,
  CreatorActivateInput,
  CreatorsResponse,
  FlashDealsResponse,
  MarketingCentreResponse,
  MarketingShipping,
  ReviewPrizeListResponse,
  Voucher,
  VoucherListResponse,
} from '../types/marketing.types'

// ── Path constants ────────────────────────────────────────────────────────────
// Live backend: /sellers/me/...
// Mock (MSW via /seller/marketing/...): shipping only — not yet deployed.
const P = {
  // Live
  centre:                  '/sellers/me/marketing/centre',
  promotions:              '/sellers/me/promotions',
  flashDeals:              '/sellers/me/flash-deals',
  flashDealTimeSlots:      '/sellers/me/flash-deals/time-slots',
  vouchers:                '/sellers/me/vouchers',
  voucher:       (id: string) => `/sellers/me/vouchers/${id}`,
  campaigns:               '/sellers/me/campaigns',
  campaignDetail:(id: string) => `/sellers/me/campaigns/${id}`,
  creatorProgramme:        '/sellers/me/creator-programme',
  creatorProgrammeActivate:'/sellers/me/creator-programme/activate',
  creators:                '/sellers/me/creators',
  creatorCampaigns:        '/sellers/me/creator-campaigns',
  reviewPrizes:            '/sellers/me/review-prizes',
  reviewPrize:   (id: string) => `/sellers/me/review-prizes/${id}`,
  reviewPrizeDuplicate: (id: string) => `/sellers/me/review-prizes/${id}/duplicate`,
  // Live — ADS sub-feature (wired 2026-06-17)
  ads:              '/sellers/me/ads',
  adsCampaigns:     '/sellers/me/ads/campaigns',
  adsCampaign:      (id: string) => `/sellers/me/ads/campaigns/${id}`,
  adsTopUp:         '/sellers/me/ads/top-up',
  adsRecommendations: '/sellers/me/ads/recommendations',
  // Mock only (not yet deployed — shipping)
  shipping: '/seller/marketing/shipping',
} as const

// ── Adapters (snake → camel, align to FE types) ───────────────────────────────

function adaptAnnouncement(a: Record<string, unknown>) {
  return {
    id:          a.id as string,
    title:       a.title as Record<string, string>,
    body:        a.body as Record<string, string>,
    isNew:       Boolean(a.is_new),
    publishedAt: (a.published_at ?? '') as string,
  }
}

function adaptEvent(e: Record<string, unknown>) {
  return {
    id:          e.id as string,
    kind:        e.kind as 'ads' | 'vouchers' | 'shipping',
    title:       e.title as Record<string, string>,
    upliftLabel: (e.uplift_label ?? { uz: '', ru: '', en: '' }) as Record<string, string>,
    to:          (e.route ?? e.to ?? '') as string,
  }
}

function adaptVoucher(v: Record<string, unknown>): Voucher {
  // discount_value_uzs for fixed, discount_percent for percent
  const discountType = (v.discount_type as string) as 'fixed' | 'percent'
  const discountValue =
    discountType === 'fixed'
      ? Number(v.discount_value_uzs ?? 0)
      : Number(v.discount_percent ?? 0)
  return {
    id:            v.id as string,
    name:          v.name as string,
    code:          v.code as string,
    type:          v.type as Voucher['type'],
    discountType,
    discountValue,
    minBasketUzs:  Number(v.min_basket_uzs ?? 0),
    usageQtyTotal: Number(v.usage_qty_total ?? 0),
    usagePerBuyer: Number(v.usage_per_buyer ?? 1),
    claimStart:    v.claim_start as string,
    claimEnd:      v.claim_end as string,
    targetBuyer:   (v.target_buyer as string) ?? 'all',
    productScope:  (v.applicable_products as 'all' | 'specific') ?? 'all',
    status:        v.status as Voucher['status'],
  }
}

// Flash deal from the list endpoint returns deal-level objects; FE FlashDeal is
// a simplified flat type. Map what the backend provides; fill unknowns with 0/''.
function adaptFlashDeal(d: Record<string, unknown>) {
  const slot = (d.time_slot ?? {}) as Record<string, string>
  return {
    id:           d.id as string,
    // FE type expects a string (slot label); use starts_at from nested slot
    timeSlot:     slot.starts_at ?? (d.time_slot as string) ?? '',
    // list endpoint doesn't return per-deal flash_price; default 0 until detail loaded
    flashPriceUzs: Number(d.flash_price_uzs ?? 0),
    promoStock:    Number(d.promo_stock ?? 0),
    status:        (d.status as string) as 'upcoming' | 'active' | 'expired' | 'draft',
    productName:   (d.product_name ?? '') as string,
  }
}

function adaptFlashPerformance(p: Record<string, unknown>) {
  return {
    salesUzs: Number(p.sales_uzs ?? 0),
    orders:   Number(p.orders ?? 0),
    buyers:   Number(p.buyers ?? 0),
    ctr:      Number(p.ctr ?? 0),
  }
}

function adaptCampaign(c: Record<string, unknown>) {
  return {
    id:                c.id as string,
    bannerUrl:         (c.banner_url ?? '') as string,
    name:              c.name as Record<string, string>,
    type:              (c.type as string) as 'product' | 'voucher' | 'flash_sale' | 'live_stream',
    startAt:           (c.campaign_start ?? c.start_at ?? '') as string,
    endAt:             (c.campaign_end ?? c.end_at ?? '') as string,
    nominationDeadline:(c.nomination_deadline ?? '') as string,
    sessionCount:      Number(c.session_count ?? 0),
    pendingCount:      Number(c.pending_count ?? 0),
    nominatedCount:    Number(c.nominated_count ?? 0),
    sellerStatus:      (c.seller_status ?? 'available') as 'available' | 'invited' | 'pending' | 'nominated' | 'active',
  }
}

function adaptSession(s: Record<string, unknown>) {
  return {
    id:              s.id as string,
    date:            (s.session_date ?? s.date ?? '') as string,
    subEventName:    (s.sub_event_name ?? s.name ?? { uz: '', ru: '', en: '' }) as Record<string, string>,
    isLocal:         Boolean(s.is_local),
    nominatedCount:  Number(s.nominated_count ?? 0),
    nominationStart: (s.nomination_open ?? s.nomination_start ?? '') as string,
    nominationEnd:   (s.nomination_close ?? s.nomination_end ?? '') as string,
    mechanic:        (s.mechanic ?? '') as string,
    sellerStatus:    (s.seller_status ?? 'available') as 'available' | 'nominated' | 'active' | 'closed',
  }
}

function adaptReviewPrize(p: Record<string, unknown>) {
  return {
    id:            p.id as string,
    name:          p.name as string,
    productThumbs: (p.product_thumbs ?? []) as string[],
    unusedBudget:  Number(p.unused_budget ?? 0),
    reviewsGained: Number(p.reviews_gained ?? 0),
    orders:        Number(p.orders ?? 0),
    status:        (p.status as string) as 'active' | 'inactive' | 'ended',
  }
}

// ── API functions ─────────────────────────────────────────────────────────────

export async function getMarketingCentre(): Promise<MarketingCentreResponse> {
  const { data } = await apiClient.get<Record<string, unknown>>(P.centre)
  const announcements = ((data.announcements as unknown[]) ?? []).map((a) =>
    adaptAnnouncement(a as Record<string, unknown>),
  )
  const events = ((data.events as unknown[]) ?? []).map((e) =>
    adaptEvent(e as Record<string, unknown>),
  )
  return { announcements, events }
}

// ── Ads ───────────────────────────────────────────────────────────────────────
// Live backend shape (GET /sellers/me/ads):
//   { ad_credit_uzs, ad_spent_uzs, wallet_balance_uzs, active_campaigns }
// FE AdsResponse expects { metrics, series, campaigns, recommendations }.
// We compose the full AdsResponse from three real endpoints + fill gaps.

function adaptAdCampaign(c: Record<string, unknown>): AdCampaign {
  return {
    id:          c.id as string,
    productName: (c.product_name ?? '') as string,
    variation:   (c.variant_label ?? '') as string,
    quantity:    Number(c.items_sold ?? 0),
    matchType:   (c.match_type ?? 'search') as 'search' | 'discovery',
    budgetUzs:   c.daily_budget_uzs != null ? Number(c.daily_budget_uzs) : null,
    impressions: Number(c.impressions ?? 0),
    clicks:      Number(c.clicks ?? 0),
    ctr:         Number(c.ctr ?? 0),
    expenseUzs:  Number(c.expense_uzs ?? 0),
    gmvUzs:      Number(c.gmv_uzs ?? 0),
  }
}

function adaptAdsRecommendation(r: Record<string, unknown>): AdsRecommendation {
  return {
    id:    r.id as string,
    type:  r.type as AdsRecommendation['type'],
    title: (r.title ?? { uz: '', ru: '', en: '' }) as Record<string, string>,
    body:  (r.body ?? { uz: '', ru: '', en: '' }) as Record<string, string>,
    cta:   (r.cta_label ?? { uz: '', ru: '', en: '' }) as Record<string, string>,
  }
}

export async function getAds(): Promise<AdsResponse> {
  // Compose from three live endpoints in parallel
  const [accountResp, campaignsResp, recsResp] = await Promise.all([
    apiClient.get<Record<string, unknown>>(P.ads),
    apiClient.get<Record<string, unknown>>(P.adsCampaigns),
    apiClient.get<Record<string, unknown>>(P.adsRecommendations),
  ])
  const acct = accountResp.data
  const rawCampaigns = (campaignsResp.data.campaigns as unknown[]) ?? []
  const rawRecs      = (recsResp.data.recommendations as unknown[]) ?? []

  const adCreditUzs  = Number(acct.ad_credit_uzs ?? 0)
  const adSpentUzs   = Number(acct.ad_spent_uzs ?? 0)

  return {
    metrics: {
      impressions:   0,
      clicks:        0,
      ctr:           0,
      orders:        0,
      conversions:   0,
      itemsSold:     0,
      gmvUzs:        0,
      expenseUzs:    adSpentUzs,
      roas:          0,
      adsCreditUzs:  adCreditUzs,
      adsDepositUzs: Number(acct.deposit_uzs ?? 0),
    },
    series: { labels: [], impressions: [], roas: [] },
    campaigns:       rawCampaigns.map((c) => adaptAdCampaign(c as Record<string, unknown>)),
    recommendations: rawRecs.map((r) => adaptAdsRecommendation(r as Record<string, unknown>)),
  }
}

export async function createAdCampaign(input: {
  productId: string
  variantId?: string | null
  matchType: 'search' | 'discovery'
  dailyBudgetUzs?: number | null
  bidUzs: number
}): Promise<AdCampaign> {
  const body = {
    product_id:        input.productId,
    variant_id:        input.variantId ?? null,
    match_type:        input.matchType,
    daily_budget_uzs:  input.dailyBudgetUzs ?? null,
    bid_uzs:           input.bidUzs,
  }
  const { data } = await apiClient.post<Record<string, unknown>>(P.adsCampaigns, body)
  return adaptAdCampaign(data)
}

export async function updateAdCampaign(
  id: string,
  patch: { dailyBudgetUzs?: number | null; bidUzs?: number; status?: 'active' | 'paused' | 'ended' },
): Promise<AdCampaign> {
  const body: Record<string, unknown> = {}
  if (patch.dailyBudgetUzs !== undefined) body.daily_budget_uzs = patch.dailyBudgetUzs
  if (patch.bidUzs !== undefined)          body.bid_uzs          = patch.bidUzs
  if (patch.status !== undefined)          body.status           = patch.status
  const { data } = await apiClient.patch<Record<string, unknown>>(P.adsCampaign(id), body)
  return adaptAdCampaign(data)
}

export async function adsTopUp(
  amountUzs: number,
  source: 'wallet' | 'escrow' = 'wallet',
): Promise<{ creditUzs: number; transactionId?: string }> {
  const { data } = await apiClient.post<Record<string, unknown>>(P.adsTopUp, {
    amount_uzs: amountUzs,
    source,
  })
  return {
    // Live shape: { ad_credit_uzs, wallet_balance_uzs }
    creditUzs:     Number(data.ad_credit_uzs ?? data.credit_uzs ?? 0),
    transactionId: (data.transaction_id ?? undefined) as string | undefined,
  }
}

export async function getAdsRecommendations(): Promise<AdsRecommendation[]> {
  const { data } = await apiClient.get<Record<string, unknown>>(P.adsRecommendations)
  const raw = (data.recommendations as unknown[]) ?? []
  return raw.map((r) => adaptAdsRecommendation(r as Record<string, unknown>))
}

// ── Vouchers ──────────────────────────────────────────────────────────────────

export async function getVouchers(
  status?: string,
  q?: string,
  page?: number,
): Promise<VoucherListResponse> {
  const { data } = await apiClient.get<Record<string, unknown>>(P.vouchers, {
    params: { status, q, page },
  })
  const raw = (data.vouchers as unknown[]) ?? []
  const perf = (data.performance ?? {}) as Record<string, unknown>
  return {
    vouchers: raw.map((v) => adaptVoucher(v as Record<string, unknown>)),
    total: Number(data.total ?? 0),
    performance: {
      salesUzs:  Number(perf.sales_uzs ?? 0),
      orders:    Number(perf.orders ?? 0),
      usageRate: Number(perf.usage_rate ?? 0),
      buyers:    Number(perf.buyers ?? 0),
    },
  }
}

export async function createVoucher(input: CreateVoucherInput): Promise<Voucher> {
  // Translate camelCase FE input → snake_case backend request
  const body = {
    type:                input.type,
    name:                input.name,
    code_suffix:         input.code,
    reward_type:         'discount',
    discount_type:       input.discountType,
    discount_value_uzs:  input.discountType === 'fixed' ? input.discountValue : null,
    discount_percent:    input.discountType === 'percent' ? input.discountValue : null,
    min_basket_uzs:      input.minBasketUzs,
    usage_qty_total:     input.usageQtyTotal,
    usage_per_buyer:     input.usagePerBuyer,
    claim_start:         input.claimStart,
    claim_end:           input.claimEnd,
    display_early:       input.displayEarly,
    display_channel:     input.displayChannel,
    applicable_products: input.applicableProducts,
    product_ids:         input.productIds,
    target_buyer:        'all',
    target_buyer_config: input.targetBuyerConfig,
  }
  const { data } = await apiClient.post<Record<string, unknown>>(P.vouchers, body)
  return adaptVoucher(data)
}

export async function deleteVoucher(id: string): Promise<void> {
  await apiClient.delete(P.voucher(id))
}

// ── Shipping (not deployed — stays on mock path) ──────────────────────────────

export async function getMarketingShipping(): Promise<MarketingShipping> {
  const { data } = await apiClient.get<MarketingShipping>(P.shipping)
  return data
}

export async function saveMarketingShipping(
  input: MarketingShipping,
): Promise<MarketingShipping> {
  const { data } = await apiClient.put<MarketingShipping>(P.shipping, input)
  return data
}

// ── Flash Deals ───────────────────────────────────────────────────────────────

export async function getFlashDeals(page?: number): Promise<FlashDealsResponse> {
  const { data } = await apiClient.get<Record<string, unknown>>(P.flashDeals, {
    params: { page },
  })
  const raw = (data.deals as unknown[]) ?? []
  const perf = (data.performance ?? {}) as Record<string, unknown>
  return {
    deals: raw.map((d) => adaptFlashDeal(d as Record<string, unknown>)),
    total: Number(data.total ?? 0),
    performance: adaptFlashPerformance(perf),
  }
}

export async function createFlashDeal(input: CreateFlashDealInput): Promise<void> {
  // Translate camelCase FE input → snake_case backend request
  const body = {
    time_slot_id: input.timeSlot,
    products: input.products.map((p) => ({
      product_id:      p.productId,
      flash_price_uzs: p.promoPriceUzs,
      promo_stock:     p.promoStock,
    })),
  }
  await apiClient.post(P.flashDeals, body)
}

export async function getFlashDealTimeSlots() {
  const { data } = await apiClient.get<{ slots: unknown[] }>(P.flashDealTimeSlots)
  return data
}

// ── Campaigns ─────────────────────────────────────────────────────────────────

export async function getCampaigns(
  sellerStatus?: string,
  type?: string,
  page?: number,
): Promise<CampaignsResponse> {
  const { data } = await apiClient.get<Record<string, unknown>>(P.campaigns, {
    params: { status: sellerStatus, type, page },
  })
  const raw = (data.campaigns as unknown[]) ?? []
  return {
    campaigns:  raw.map((c) => adaptCampaign(c as Record<string, unknown>)),
    total:      Number(data.total ?? 0),
    available:  Number(data.available ?? 0),
    invited:    Number(data.invited ?? 0),
    pending:    Number(data.pending ?? 0),
    nominated:  Number(data.nominated ?? 0),
  }
}

export async function getCampaignDetail(id: string): Promise<CampaignDetailResponse> {
  const { data } = await apiClient.get<Record<string, unknown>>(P.campaignDetail(id))
  const sessions = ((data.sessions as unknown[]) ?? []).map((s) =>
    adaptSession(s as Record<string, unknown>),
  )
  return {
    id:          data.id as string,
    bannerUrl:   (data.banner_url ?? '') as string,
    name:        data.name as Record<string, string>,
    startAt:     (data.campaign_start ?? data.start_at ?? '') as string,
    endAt:       (data.campaign_end ?? data.end_at ?? '') as string,
    description: (data.description ?? { uz: '', ru: '', en: '' }) as Record<string, string>,
    sessions,
  }
}

// ── Creator Programme ─────────────────────────────────────────────────────────
// Live backend splits this into two endpoints:
//   GET /sellers/me/creator-programme  → programme status (activated, rate, etc.)
//   GET /sellers/me/creators            → creator marketplace list
// The old FE mock combined them into one `CreatorsResponse` shape {creators, activated}.
// We merge them here so callers see no change.

export async function getCreators(): Promise<CreatorsResponse> {
  const [progResp, creatorsResp] = await Promise.all([
    apiClient.get<Record<string, unknown>>(P.creatorProgramme),
    apiClient.get<Record<string, unknown>>(P.creators),
  ])
  const prog = progResp.data
  const creatorsRaw = (creatorsResp.data.creators as unknown[]) ?? []
  return {
    creators: creatorsRaw.map((c) => {
      const cr = c as Record<string, unknown>
      return {
        id:          cr.id as string,
        handle:      cr.handle as string,
        categories:  (cr.categories as string[]) ?? [],
        followers:   Number(cr.follower_count ?? cr.followers ?? 0),
        totalOrders: String(cr.total_orders ?? '<10'),
        totalClicks: String(cr.total_clicks ?? '<1k'),
      }
    }),
    activated: Boolean(prog.activated),
  }
}

export async function activateCreators(input: CreatorActivateInput): Promise<void> {
  await apiClient.post(P.creatorProgrammeActivate, { tos_accepted: input.tosAccepted })
}

// ── Review Prizes ─────────────────────────────────────────────────────────────

export async function getReviewPrizes(
  status?: string,
  page?: number,
): Promise<ReviewPrizeListResponse> {
  const { data } = await apiClient.get<Record<string, unknown>>(P.reviewPrizes, {
    params: { status, page },
  })
  const raw = (data.prizes as unknown[]) ?? []
  const metrics = (data.metrics ?? {}) as Record<string, unknown>
  return {
    prizes:   raw.map((p) => adaptReviewPrize(p as Record<string, unknown>)),
    total:    Number(data.total ?? 0),
    active:   Number(data.active ?? 0),
    inactive: Number(data.inactive ?? 0),
    metrics: {
      reviewsGained: Number(metrics.reviews_gained ?? 0),
      views:         Number(metrics.views ?? 0),
      orders:        Number(metrics.orders ?? 0),
    },
  }
}

export async function endReviewPrize(id: string): Promise<void> {
  await apiClient.post(`${P.reviewPrize(id)}/end`)
}

export async function duplicateReviewPrize(id: string): Promise<void> {
  await apiClient.post(P.reviewPrizeDuplicate(id))
}
