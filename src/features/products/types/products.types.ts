// Product domain types — NO enums (erasableSyntaxOnly), string-union + as-const arrays only.

// ── Status ────────────────────────────────────────────────────────────────────
export type ProductStatus =
  | 'live'
  | 'under_review'
  | 'banned'
  | 'deboosted'
  | 'admin_deleted'
  | 'delisted'
  | 'draft'

export type StatusFilter = ProductStatus | 'all'

// Top-level tabs
export const PRODUCT_STATUS_TABS = ['all', 'live', 'no_stock', 'violation', 'under_review', 'unpublished'] as const
export type ProductStatusTab = (typeof PRODUCT_STATUS_TABS)[number]

// Violation sub-tabs
export const VIOLATION_SUB_TABS = ['banned', 'deboosted', 'admin_deleted'] as const
export type ViolationSubTab = (typeof VIOLATION_SUB_TABS)[number]

// Unpublished sub-tabs
export const UNPUBLISHED_SUB_TABS = ['delisted', 'draft'] as const
export type UnpublishedSubTab = (typeof UNPUBLISHED_SUB_TABS)[number]

// Live sub-tabs
export const LIVE_SUB_TABS = ['all', 'restock', 'quality'] as const
export type LiveSubTab = (typeof LIVE_SUB_TABS)[number]

// Sort options
export const SORT_OPTIONS = ['recommended', 'price_asc', 'price_desc', 'stock_asc', 'stock_desc', 'updated_desc'] as const
export type SortOption = (typeof SORT_OPTIONS)[number]

// ── Core product ──────────────────────────────────────────────────────────────
export interface ProductSku {
  id: string
  variation1: string
  variation2: string
  priceUzs: number
  stock: number
  sellerSku: string
  available: boolean
}

export interface Product {
  id: string
  name: string        // display name (pickLang of title{uz,ru,en})
  parentSku: string
  itemId: string
  thumbnails: string[]
  minPriceUzs: number
  maxPriceUzs: number
  totalStock: number
  salesCount: number
  impressions: number   // [PENDING BACKEND] no backend source yet
  searchCount: number   // [PENDING BACKEND] no backend source yet
  status: ProductStatus
  listingIssueCount: number  // [PENDING BACKEND] no backend source yet
  category: string
  labels: string[]
  updatedAt: string
  // Real backend fields (GET /sellers/me/products)
  brand: string
  compareAtUzs: number | null
  rating: number
  reviewCount: number
  hasVariants: boolean
  createdAt: string
  soldOut: boolean      // backend status === 'sold_out'
}

// Tab counts. Backend summary is {all,active,hidden,sold_out}; mapped at the
// api boundary: live ← active(+sold_out), unpublished ← hidden.
// violation / under_review have NO backend source — [PENDING BACKEND], stay 0.
export interface ProductSummary {
  all: number
  live: number
  no_stock: number
  violation: number
  under_review: number
  unpublished: number
}

export interface ProductListQuery {
  status?: ProductStatusTab
  backendStatus?: string // raw backend status filter (e.g. 'draft'), bypasses tab mapping
  sub?: string
  label?: string
  q?: string
  sort?: SortOption
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  summary: ProductSummary
}

// ── Listing issues ────────────────────────────────────────────────────────────
export type IssueType = 'wrong_value' | 'image_issue' | 'missing_info' | 'other'

export interface ListingIssue {
  productId: string
  productName: string
  thumbnails: string[]
  wrongValueCount: number
  imageIssueCount: number
  missingInfoCount: number
  otherCount: number
}

export interface ListingIssuesResponse {
  issues: ListingIssue[]
  total: number
}

// ── Violation ─────────────────────────────────────────────────────────────────
export interface ViolationProduct {
  id: string
  productName: string
  updatedAt: string
  violationType: string
  violationReason: string
  deadline: string
  suggestion: string
}

export interface ViolationListResponse {
  products: ViolationProduct[]
  total: number
}

// ── Under review ─────────────────────────────────────────────────────────────
export interface ReviewProduct {
  id: string
  productName: string
  thumbnails: string[]
  updatedAt: string
  priceUzs: number
  stock: number
}

export interface ReviewListResponse {
  products: ReviewProduct[]
  total: number
}

// ── Unpublished ───────────────────────────────────────────────────────────────
export interface UnpublishedProduct {
  id: string
  productName: string
  thumbnails: string[]
  salesCount: number
  priceUzs: number
  stock: number
  status: 'delisted' | 'draft'
  updatedAt: string
}

export interface UnpublishedListResponse {
  products: UnpublishedProduct[]
  total: number
}

// ── Add / Edit product form ───────────────────────────────────────────────────
export interface ProductTranslation {
  uz: string
  ru: string
  en: string
}

export interface VariationGroup {
  name: string
  options: string[]
}

export interface SkuRow {
  variation1: string
  variation2: string
  priceUzs: string
  stock: string
  sellerSku: string
  available: boolean
  // Populated from backend dto.variants[] on the READ side (edit form).
  // WRITE side (POST/PUT /catalog with variants[]) is still [PENDING BACKEND].
  id?: string
  imageUrl?: string
  compareAtUzs?: string
}

export interface WholesaleTier {
  minQty: string
  maxQty: string
  priceUzs: string
}

export interface ProductFormData {
  // Basic Info
  images: string[]       // R2 URLs or local blob URLs
  promotionImage: string
  videoUrl: string
  nameUz: string
  nameRu: string
  nameEn: string
  category: string
  categoryId: string
  gtin: string
  gtinExempt: boolean
  // Specification
  brand: string
  brandId: string
  sizeChartId: string
  condition: 'new' | 'used'
  colourFamily: string
  // Description
  descUz: string
  descRu: string
  descEn: string
  // Sales Info
  variations: VariationGroup[]
  skus: SkuRow[]
  // True when product came from backend with dto.has_variants — the WRITE side
  // (POST/PUT /catalog with variants[]) is [PENDING BACKEND], so variant editing
  // is disabled to avoid silently flattening multi-variant products on save.
  hasVariants: boolean
  wholesaleEnabled: boolean
  wholesaleTiers: WholesaleTier[]
  // Shipping
  weightKg: string
  widthCm: string
  heightCm: string
  lengthCm: string
  shippingStandard: boolean
  shippingExpress: boolean
  preOrder: boolean
  preOrderDays: string
  dangerousGoods: string
  // Others
  includedItems: string
}

// ── Bulk operations ───────────────────────────────────────────────────────────
export type BulkAction = 'delist' | 'delete' | 'publish'

export interface BulkUpdateInput {
  productIds: string[]
  action: BulkAction
}

// ── Brands (kept for backward compat) ────────────────────────────────────────
export type BrandStatus = 'pending' | 'approved' | 'rejected' | 'blacklisted'

export interface Brand {
  id: string
  brandName: string
  category: string
  registrationDate: string
  status: BrandStatus
}

export interface BrandListResponse {
  brands: Brand[]
  total: number
}

export interface BrandRegistrationInput {
  brandName: string
  categoryId: string
  sampleImageUrls: string[]
  logoUrl: string
  website: string
  additionalInfo: string
  acknowledged: boolean
}

// ── Brand registry (global, for the in-product picker) ───────────────────────
// useStatus drives the picker UI; selectable = open | owned | authorized.
export type BrandUseStatus =
  | 'open'
  | 'owned'
  | 'authorized'
  | 'auth_pending'
  | 'auth_rejected'
  | 'needs_authorization'
  | 'owned_by_other'

export interface BrandSearchResult {
  id: string
  name: string
  logoUrl?: string
  protection: 'open' | 'protected' | 'exclusive'
  ownedByYou: boolean
  useStatus: BrandUseStatus
}

// ── Size charts (kept for backward compat) ────────────────────────────────────
// Multi-language label map (matches backend jsonb {uz,ru,en}).
export interface LangMap { uz?: string; ru?: string; en?: string }

export type SizeChartStatus = 'active' | 'archived'

// Row in the Size Chart Management list.
export interface SizeChart {
  id: string
  name: string
  templateSlug: string
  templateName: LangMap
  sizeSystemCode: string
  displayUnit: string
  status: SizeChartStatus
  registrationDate: string
  rowCount: number
  linkedProducts: number
}

export interface SizeChartListQuery {
  search?: string
}

export interface SizeChartListResponse {
  sizeCharts: SizeChart[]
  total: number
}

// ── Size templates (platform-owned "virtual categories") ─────────────────────
export interface SizeMeasurementAttr {
  slug: string
  name: LangMap
  measureKind: 'length' | 'girth' | 'mass'
  howTo?: LangMap
}

export interface SizeSystemDef {
  code: string
  name: LangMap
  kind: string
  isLabelSystem: boolean
}

export interface SizeTemplate {
  id: string
  slug: string
  name: LangMap
  gender: string
  garmentType: string
  measurementSlugs: string[]
  sizeSystemCodes: string[]
  defaultSystemCode: string
  primaryAttrSlug: string
  measurements: SizeMeasurementAttr[]
  sizeSystems: SizeSystemDef[]
}

// ── Chart create/update payload (values in the chart's display unit) ─────────
export interface SaveSizeChartCell {
  attributeSlug: string
  valueMin: number
  valueMax?: number | null
}
export interface SaveSizeChartRow {
  sizeLabel: string
  cells: SaveSizeChartCell[]
}
export interface SaveSizeChartInput {
  id?: string
  templateId: string
  name: string
  sizeSystemCode: string
  displayUnit: 'cm' | 'in'
  rows: SaveSizeChartRow[]
}

// Full chart detail (edit load).
export interface SizeChartDetail {
  id: string
  templateId: string
  name: string
  sizeSystemCode: string
  displayUnit: 'cm' | 'in'
  rows: Array<{ sizeLabel: string; cells: Record<string, { min: number; max?: number }> }>
}
