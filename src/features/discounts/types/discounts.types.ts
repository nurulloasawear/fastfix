// Discount/promo-code domain. String-union types only (NO enums — erasableSyntaxOnly).
// Money is integer UZS: a `fixed` discount stores its amount in `valueUzs`; a
// `percentage` discount stores a 1–99 number in `valuePercent`.
export type DiscountType = 'percentage' | 'fixed'
export type DiscountStatus = 'active' | 'expired'

export type TypeFilter = DiscountType | 'all'
export type StatusFilter = DiscountStatus | 'all'

export const DISCOUNT_TYPES = ['percentage', 'fixed'] as const
export const DISCOUNT_STATUSES = ['active', 'expired'] as const
export const STATUS_FILTERS = ['all', 'active', 'expired'] as const
export const TYPE_FILTERS = ['all', 'percentage', 'fixed'] as const

export interface Discount {
  id: string
  code: string
  type: DiscountType
  valuePercent: number | null
  valueUzs: number | null
  status: DiscountStatus
  usedCount: number
  usageLimit: number | null // null = unlimited
  expiryDate: string // YYYY-MM-DD
}

export interface DiscountSummary {
  total: number
  active: number
  expired: number
  totalUsed: number
}

export interface DiscountListQuery {
  status?: StatusFilter
  type?: TypeFilter
  search?: string
}

export interface DiscountListResponse {
  discounts: Discount[]
  total: number
  summary: DiscountSummary
}

// Create / edit payload. Value is sent as the raw form number; the api boundary
// routes it into valuePercent vs valueUzs based on `type`.
export interface DiscountInput {
  code: string
  type: DiscountType
  value: number
  usageLimit: number | null
  expiryDate: string
}
