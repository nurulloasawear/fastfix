import { apiClient } from '@/lib/axios'
import type {
  Discount,
  DiscountInput,
  DiscountListQuery,
  DiscountListResponse,
  DiscountSummary,
} from '../types/discounts.types'

// Live backend routes (deployed 2026-06-17).
// GET list + POST create are live at /sellers/me/discount-codes (alias for
// vouchers with type=private / display_channel=code_only).
// GET /:id, PUT /:id, DELETE /:id, POST /:id/toggle-status are NOT yet deployed
// (all returned 404) — those paths stay on mock so MSW serves them in dev.
const PATHS = {
  list: '/sellers/me/discount-codes',   // was /seller/discounts
  create: '/sellers/me/discount-codes', // was /seller/discounts
  // These three 404 on the live BE — kept on mock paths so MSW intercepts them:
  update: (id: string) => `/seller/discounts/${id}`,
  remove: (id: string) => `/seller/discounts/${id}`,
  toggle: (id: string) => `/seller/discounts/${id}/toggle-status`,
} as const

// ── Raw shapes from the live backend ─────────────────────────────────────────

// GET /sellers/me/discount-codes item (subset of voucher; no used_count/usage_qty_total/claim_end in list)
interface RawDiscountItem {
  id: string
  name: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_percent: number | null
  discount_value_uzs: number | null
  // status values from BE: "upcoming" | "ongoing" | "expired" | "cancelled"
  status: string
}

// GET /sellers/me/discount-codes envelope
interface RawDiscountListResponse {
  discounts: RawDiscountItem[]
  total: number
  summary: {
    active: number
    inactive: number // BE uses "inactive"; treat as expired for FE
  }
}

// ── Adapters ─────────────────────────────────────────────────────────────────

// BE "percent" → FE "percentage"; BE "fixed" → FE "fixed"
function toDiscountType(raw: 'percent' | 'fixed'): 'percentage' | 'fixed' {
  return raw === 'percent' ? 'percentage' : 'fixed'
}

// BE statuses "upcoming" | "ongoing" → FE "active"; "expired" | "cancelled" → "expired"
function toDiscountStatus(raw: string): 'active' | 'expired' {
  return raw === 'upcoming' || raw === 'ongoing' ? 'active' : 'expired'
}

function adaptItem(raw: RawDiscountItem): Discount {
  return {
    id: raw.id,
    code: raw.code,
    type: toDiscountType(raw.discount_type),
    valuePercent: raw.discount_percent ?? null,
    valueUzs: raw.discount_value_uzs ?? null,
    status: toDiscountStatus(raw.status),
    // BE list endpoint omits these; default sensibly (detail endpoint not yet live)
    usedCount: 0,
    usageLimit: null,
    expiryDate: '',
  }
}

function adaptList(raw: RawDiscountListResponse): DiscountListResponse {
  const discounts = raw.discounts.map(adaptItem)
  const summary: DiscountSummary = {
    total: raw.total,
    active: raw.summary.active,
    expired: raw.summary.inactive, // BE calls it "inactive"
    totalUsed: 0, // not returned in list; default 0
  }
  return { discounts, total: raw.total, summary }
}

// Build the voucher-shaped payload the BE expects for POST /sellers/me/discount-codes.
// The FE form collects a simpler DiscountInput; we expand it here at the boundary.
function toCreatePayload(input: DiscountInput) {
  // The code field from DiscountInput is used as the suffix; BE prepends shop slug.
  return {
    type: 'private' as const,
    display_channel: 'code_only' as const,
    applicable_products: 'all' as const,
    target_buyer: 'all' as const,
    target_buyer_config: {},
    reward_type: 'discount' as const,
    name: input.code, // no separate name field in FE form — use code as internal name
    code_suffix: input.code,
    discount_type: input.type === 'percentage' ? ('percent' as const) : ('fixed' as const),
    discount_percent: input.type === 'percentage' ? input.value : null,
    discount_value_uzs: input.type === 'fixed' ? input.value : null,
    min_basket_uzs: 0,
    usage_qty_total: input.usageLimit ?? 999999,
    usage_per_buyer: 1,
    display_early: false,
    // claim_start = now; claim_end = expiryDate (end of day UTC)
    claim_start: new Date().toISOString(),
    claim_end: input.expiryDate ? `${input.expiryDate}T23:59:00Z` : '2099-12-31T23:59:00Z',
    product_ids: [],
  }
}

// POST create returns a minimal envelope {id, name, code}; reconstruct Discount from input.
interface RawCreateResponse {
  id: string
  name: string
  code: string
}

function adaptCreated(raw: RawCreateResponse, input: DiscountInput): Discount {
  return {
    id: raw.id,
    code: raw.code,
    type: input.type,
    valuePercent: input.type === 'percentage' ? input.value : null,
    valueUzs: input.type === 'fixed' ? input.value : null,
    status: 'active',
    usedCount: 0,
    usageLimit: input.usageLimit,
    expiryDate: input.expiryDate,
  }
}

// ── API functions ─────────────────────────────────────────────────────────────

export async function getDiscounts(query: DiscountListQuery): Promise<DiscountListResponse> {
  const { data } = await apiClient.get<RawDiscountListResponse>(PATHS.list, { params: query })
  return adaptList(data)
}

export async function createDiscount(input: DiscountInput): Promise<Discount> {
  const { data } = await apiClient.post<RawCreateResponse>(PATHS.create, toCreatePayload(input))
  return adaptCreated(data, input)
}

// ── Still on mock (GET /:id, PUT /:id, DELETE /:id, toggle all 404 on live BE) ──

export async function updateDiscount(id: string, input: DiscountInput): Promise<Discount> {
  const { data } = await apiClient.put<Discount>(PATHS.update(id), toCreatePayload(input))
  return data
}

export async function deleteDiscount(id: string): Promise<void> {
  await apiClient.delete(PATHS.remove(id))
}

export async function toggleDiscountStatus(id: string): Promise<Discount> {
  const { data } = await apiClient.post<Discount>(PATHS.toggle(id))
  return data
}
