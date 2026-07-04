// Shop domain types. String-union types + interfaces only (no enums).
// Extended types (KYC, new info, decoration, appeals, missions) live in shop.types.ext.ts.

// --- Profile (Shop Information) ---
export type ShopStatus = 'active' | 'paused' | 'suspended'

export interface ShopProfile {
  id: string
  name: string
  bio: string
  phone: string
  email: string
  address: string
  telegram: string
  status: ShopStatus
  registeredAt: string
  logoUrl: string | null
  bannerUrl: string | null
}

export type ShopProfileUpdate = Pick<
  ShopProfile,
  'name' | 'bio' | 'phone' | 'email' | 'address' | 'telegram'
>

// --- Reviews (Shop Rating) ---
export interface ShopReview {
  id: string
  userName: string
  rating: number
  date: string
  comment: string
  productName: string
  reply: string
}

export interface ShopRatingSummary {
  average: number
  positiveRate: number
  total: number
  unanswered: number
}

export interface ShopReviewsResponse {
  reviews: ShopReview[]
  summary: ShopRatingSummary
}

export interface ReviewReplyPayload {
  id: string
  reply: string
}

// --- Decoration (legacy blocks) ---
export type BlockType = 'carousel' | 'banner' | 'products_grid' | 'video'

export interface DecorationBlock {
  id: string
  type: BlockType
  title: string
  description: string
}

// --- Categories ---
export interface ShopCategory {
  id: string
  name: string
  productCount: number
  isActive: boolean
  createdAt: string
}

// --- Media ---
export type MediaType = 'image' | 'video'

export interface MediaFile {
  id: string
  name: string
  type: MediaType
  url: string
  sizeBytes: number
  dimension: string | null
  duration: string | null
  createdAt: string
}

export interface MediaStorage {
  usedBytes: number
  totalBytes: number
}

export interface MediaResponse {
  files: MediaFile[]
  storage: MediaStorage
}

// --- Reports ---
export type ReportType = 'sales' | 'finance' | 'inventory'
export type ReportFormat = 'excel' | 'pdf'
export type ReportStatus = 'ready' | 'generating'

export interface ShopReport {
  id: string
  title: string
  type: ReportType
  dateRange: string
  fileSizeBytes: number | null
  format: ReportFormat
  status: ReportStatus
}

export interface ReportsSummary {
  monthSalesUzs: number
  monthSalesChange: number
  itemsSold: number
}

export interface ReportsResponse {
  reports: ShopReport[]
  summary: ReportsSummary
}

// --- Re-export extended types (KYC, new decoration, appeals, missions) ---
export type {
  KycStatus,
  SellerType,
  IdType,
  ShopKyc,
  MultiLang,
  ShopInfoProfile,
  ShopInfoUpdate,
  DecorationPlatform,
  DecorationStatus,
  DecorationDraft,
  WidgetType,
  Widget,
  DecorationContent,
  TopPicksProduct,
  TopPicksCollection,
  TopPicksDetail,
  CustomPageStatus,
  CustomPage,
  AppealType,
  AppealStatus,
  Appeal,
  AppealsListResponse,
  AppealsQuery,
  MissionStatus,
  RewardType,
  RewardStatus,
  MissionTask,
  Mission,
  SellerReward,
  MissionsResponse,
  RewardsResponse,
} from './shop.types.ext'
