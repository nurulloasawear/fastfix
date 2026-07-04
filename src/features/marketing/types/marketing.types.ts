import type { LangMap } from '@/lib/lang'

// ── Marketing centre (hub) ──────────────────────────────────────────────────
export interface Announcement {
  id: string
  title: LangMap
  body: LangMap
  isNew: boolean
  publishedAt: string
}

export interface MarketingEvent {
  id: string
  kind: 'ads' | 'vouchers' | 'shipping'
  title: LangMap
  upliftLabel: LangMap
  to: string
}

export interface MarketingCentreResponse {
  announcements: Announcement[]
  events: MarketingEvent[]
}

// Tool card data (hub overview grid)
export interface ToolCard {
  id: string
  label: LangMap
  description: LangMap
  badgeCount?: number
  route: string
  comingSoon?: boolean
}

// Campaign card (hub overview)
export interface CampaignCard {
  id: string
  bannerUrl: string
  name: LangMap
  status: 'active' | 'upcoming' | 'ended'
  endsAt: string
}

export interface MarketingOverviewResponse {
  tools: ToolCard[]
  campaigns: CampaignCard[]
}

// ── Ads ─────────────────────────────────────────────────────────────────────
export interface AdsMetrics {
  impressions: number
  clicks: number
  ctr: number
  orders: number
  conversions: number
  itemsSold: number
  gmvUzs: number
  expenseUzs: number
  roas: number
  adsCreditUzs: number
  adsDepositUzs: number
}

export interface AdsTimeseries {
  labels: string[]
  impressions: number[]
  roas: number[]
}

export type AdMatchType = 'search' | 'discovery'

export interface AdCampaign {
  id: string
  productName: string
  variation: string
  quantity: number
  matchType: AdMatchType
  budgetUzs: number | null
  impressions: number
  clicks: number
  ctr: number
  expenseUzs: number
  gmvUzs: number
}

export interface AdsRecommendation {
  id: string
  type: 'zero_balance' | 'budget_exhausted' | 'low_ctr' | 'join_campaign'
  title: LangMap
  body: LangMap
  cta: LangMap
}

export interface AdsResponse {
  metrics: AdsMetrics
  series: AdsTimeseries
  campaigns: AdCampaign[]
  recommendations: AdsRecommendation[]
}

// ── Vouchers ────────────────────────────────────────────────────────────────
export type VoucherType =
  | 'shop'
  | 'private'
  | 'product'
  | 'live'
  | 'video'
  | 'new_buyer'
  | 'repeat_buyer'
  | 'follow_prize'

export type VoucherStatus = 'ongoing' | 'upcoming' | 'expired' | 'active'

export type DiscountType = 'fixed' | 'percent'

export interface Voucher {
  id: string
  name: string
  code: string
  type: VoucherType
  discountType: DiscountType
  discountValue: number
  minBasketUzs: number
  usageQtyTotal: number
  usagePerBuyer: number
  claimStart: string
  claimEnd: string
  targetBuyer: string
  productScope: 'all' | 'specific'
  status: VoucherStatus
}

export interface VoucherListResponse {
  vouchers: Voucher[]
  total: number
  performance: VoucherPerformance
}

export interface VoucherPerformance {
  salesUzs: number
  orders: number
  usageRate: number
  buyers: number
}

export interface CreateVoucherInput {
  type: VoucherType
  name: string
  code: string
  discountType: DiscountType
  discountValue: number
  minBasketUzs: number
  usageQtyTotal: number
  usagePerBuyer: number
  claimStart: string
  claimEnd: string
  displayEarly: boolean
  displayChannel: string
  applicableProducts: 'all' | 'specific'
  productIds: string[]
  targetBuyerConfig: Record<string, unknown>
}

// ── Flash Deals ─────────────────────────────────────────────────────────────
export type FlashDealStatus = 'upcoming' | 'active' | 'expired' | 'draft'

export interface FlashDeal {
  id: string
  timeSlot: string
  flashPriceUzs: number
  promoStock: number
  status: FlashDealStatus
  productName: string
}

export interface FlashDealPerformance {
  salesUzs: number
  orders: number
  buyers: number
  ctr: number
}

export interface FlashDealsResponse {
  deals: FlashDeal[]
  total: number
  performance: FlashDealPerformance
}

export interface CreateFlashDealInput {
  timeSlot: string
  products: Array<{ productId: string; promoPriceUzs: number; promoStock: number }>
}

// ── Campaigns ───────────────────────────────────────────────────────────────
export type CampaignSellerStatus = 'available' | 'invited' | 'pending' | 'nominated' | 'active'
export type CampaignType = 'product' | 'voucher' | 'flash_sale' | 'live_stream'

export interface Campaign {
  id: string
  bannerUrl: string
  name: LangMap
  type: CampaignType
  startAt: string
  endAt: string
  nominationDeadline: string
  sessionCount: number
  pendingCount: number
  nominatedCount: number
  sellerStatus: CampaignSellerStatus
}

export interface CampaignsResponse {
  campaigns: Campaign[]
  total: number
  available: number
  invited: number
  pending: number
  nominated: number
}

export type SessionSellerStatus = 'available' | 'nominated' | 'active' | 'closed'

export interface CampaignSession {
  id: string
  date: string
  subEventName: LangMap
  isLocal: boolean
  nominatedCount: number
  nominationStart: string
  nominationEnd: string
  mechanic: string
  sellerStatus: SessionSellerStatus
}

export interface CampaignDetailResponse {
  id: string
  bannerUrl: string
  name: LangMap
  startAt: string
  endAt: string
  description: LangMap
  sessions: CampaignSession[]
}

// ── Creators ─────────────────────────────────────────────────────────────────
export interface Creator {
  id: string
  handle: string
  categories: string[]
  followers: number
  totalOrders: string
  totalClicks: string
}

export interface CreatorsResponse {
  creators: Creator[]
  activated: boolean
}

export interface CreatorActivateInput {
  tosAccepted: boolean
}

// ── Review Prize ─────────────────────────────────────────────────────────────
export type ReviewPrizeStatus = 'active' | 'inactive' | 'ended'

export interface ReviewPrize {
  id: string
  name: string
  productThumbs: string[]
  unusedBudget: number
  reviewsGained: number
  orders: number
  status: ReviewPrizeStatus
}

export interface ReviewPrizeListResponse {
  prizes: ReviewPrize[]
  total: number
  active: number
  inactive: number
  metrics: ReviewPrizeMetrics
}

export interface ReviewPrizeMetrics {
  reviewsGained: number
  views: number
  orders: number
}

// ── Marketing shipping (legacy, keep for backward compat) ───────────────────
export type ShippingRegion = 'nationwide' | 'tashkent_city'
export const SHIPPING_REGIONS = ['nationwide', 'tashkent_city'] as const

export interface MarketingShipping {
  freeShippingActive: boolean
  minOrderUzs: number
  region: ShippingRegion
}
