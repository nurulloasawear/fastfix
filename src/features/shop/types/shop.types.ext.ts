// Extended shop types: KYC, new Shop Info, Decoration drafts, Top Picks, Appeals, Missions.
// Re-exported from shop.types.ts so all consumers keep one import path.
import type { ShopStatus } from './shop.types'

// --- KYC / Identity Verification ---
export type KycStatus = 'pending' | 'approved' | 'rejected'
export type SellerType = 'individual' | 'business'
export type IdType = 'passport' | 'id_card' | 'pinfl'

export interface ShopKyc {
  status: KycStatus
  submittedAt: string
  verificationMethod: string
  sellerType: SellerType
  fullName: string
  idType: IdType
  idLastFour: string
  addressMasked: string
}

// --- Shop Info (logo + multi-lang description) ---
export interface MultiLang {
  uz: string
  ru: string
  en: string
}

export interface ShopInfoProfile {
  id: string
  name: string
  logoUrl: string | null
  bannerUrl: string | null
  description: MultiLang
  status: ShopStatus
  vatPercent: number
  productCount: number
  registeredAt: string
}

// PUT /sellers/me body: shop_name?, description?, logo_url?, banner_url? (all optional).
export type ShopInfoUpdate = Partial<
  Pick<ShopInfoProfile, 'name' | 'logoUrl' | 'bannerUrl' | 'description'>
>

// --- Decoration (Shopee-style draft list + editor) ---
export type DecorationPlatform = 'mobile' | 'pc'
export type DecorationStatus = 'draft' | 'published'

export interface DecorationDraft {
  id: string
  name: string
  platform: DecorationPlatform
  status: DecorationStatus
  updatedAt: string
}

export type WidgetType =
  | 'cover_image'
  | 'carousel'
  | 'multi_image'
  | 'single_image'
  | 'text'
  | 'banner_with_tag'
  | 'video'
  | 'product_highlights'
  | 'product_category'

export interface Widget {
  id: string
  type: WidgetType
  order: number
  config: Record<string, unknown>
}

export interface DecorationContent {
  id: string
  name: string
  platform: DecorationPlatform
  status: DecorationStatus
  updatedAt: string
  publishedAt: string | null
  widgets: Widget[]
}

// --- Top Picks ---
export interface TopPicksProduct {
  id: string
  name: string
  priceUzs: number
  salesCount: number
  imageUrl: string | null
  isAbnormal: boolean
}

export interface TopPicksCollection {
  id: string
  name: string
  isDisplayed: boolean
  displayOrder: number
  productCount: number
}

export interface TopPicksDetail {
  id: string
  name: string
  isDisplayed: boolean
  allowPersonalization: boolean
  products: TopPicksProduct[]
}

// --- Custom Pages ---
export type CustomPageStatus = 'draft' | 'published'

export interface CustomPage {
  id: string
  internalName: string
  templateSlug: string | null
  status: CustomPageStatus
  shareUrl: string
  createdAt: string
  updatedAt: string
}

// --- Appeals ---
export type AppealType = 'preferred_seller' | 'listing_violation'
export type AppealStatus = 'reviewing' | 'pending_resubmit' | 'approved' | 'rejected'

export interface Appeal {
  id: string
  appealType: AppealType
  status: AppealStatus
  updatedAt: string
}

export interface AppealsListResponse {
  appeals: Appeal[]
  total: number
}

export interface AppealsQuery {
  type: AppealType
  status?: AppealStatus | 'all'
  appealId?: string
  appealTypeFilter?: string
  page?: number
}

// --- Missions ---
export type MissionStatus = 'not_started' | 'in_progress' | 'completed'
export type RewardType = 'ad_credit' | 'commission_discount' | 'listing_boost' | 'tier_accelerator'
export type RewardStatus = 'active' | 'used' | 'expired'

export interface MissionTask {
  id: string
  description: string
  isCompleted: boolean
}

export interface Mission {
  id: string
  title: string
  description: string
  rewardDescription: string
  status: MissionStatus
  tasks: MissionTask[]
}

export interface SellerReward {
  id: string
  rewardType: RewardType
  valueUzs: number
  expiresAt: string
  redeemedAt: string | null
  status: RewardStatus
  missionTitle: string
}

export interface MissionsResponse {
  missions: Mission[]
  introSeen: boolean
}

export interface RewardsResponse {
  rewards: SellerReward[]
}
