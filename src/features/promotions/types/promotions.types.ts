// Product price promotions (Shopee-parity): discount / bundle / add-on.
// Phase 1 covers `discount`. Wired to backend /sellers/me/promotions/*.

export type PromotionType = 'discount' | 'bundle' | 'addon'
export type PromotionStatus = 'draft' | 'upcoming' | 'active' | 'expired' | 'cancelled'
export type DiscountKind = 'percent' | 'fixed'

export interface PromotionListItem {
  id: string
  type: PromotionType
  name: string
  status: PromotionStatus
  startsAt: string
  endsAt: string
  productCount: number
}

export interface PromotionListResponse {
  promotions: PromotionListItem[]
  total: number
}

// A row as loaded back from the backend (enriched with product/variant info).
export interface PromotionProductRow {
  id: string
  productId: string
  variantId: string | null
  title: string
  image: string
  originalPriceUzs: number
  variantLabel: string | null
  variantPriceUzs: number | null
  discountType: DiscountKind | null
  discountPercent: number | null
  discountPriceUzs: number | null
  promoStock: number | null
  perOrderLimit: number | null
}

export interface PromotionDetail {
  id: string
  type: PromotionType
  name: string
  status: PromotionStatus
  startsAt: string
  endsAt: string
  products: PromotionProductRow[]
}

// One editable line in the discount editor (product-level OR per-variation).
export interface DiscountLine {
  key: string // `${productId}` or `${productId}:${variantId}`
  productId: string
  variantId: string | null
  title: string
  image: string
  originalPriceUzs: number
  variantLabel?: string
  discountType: DiscountKind
  value: string // % or soʻm, as typed
  promoStock: string
  perOrderLimit: string
}

// Payload item sent to POST /promotions/{id}/products
export interface PromotionProductPayload {
  product_id: string
  variant_id?: string | null
  discount_type: DiscountKind
  discount_percent?: number
  discount_price_uzs?: number
  promo_stock?: number
  per_order_limit?: number
}
