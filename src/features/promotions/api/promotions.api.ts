import { apiClient } from '@/lib/axios'
import type {
  DiscountLine,
  PromotionDetail,
  PromotionListResponse,
  PromotionProductPayload,
  PromotionProductRow,
  PromotionStatus,
  PromotionType,
} from '../types/promotions.types'

// ✅ Live backend (deployed): /sellers/me/promotions/*
const PATHS = {
  list: '/sellers/me/promotions',
  create: '/sellers/me/promotions',
  detail: (id: string) => `/sellers/me/promotions/${id}`,
  update: (id: string) => `/sellers/me/promotions/${id}`,
  remove: (id: string) => `/sellers/me/promotions/${id}`,
  products: (id: string) => `/sellers/me/promotions/${id}/products`,
  publish: (id: string) => `/sellers/me/promotions/${id}/publish`,
  duplicate: (id: string) => `/sellers/me/promotions/${id}/duplicate`,
} as const

// ── raw shapes ──────────────────────────────────────────────────────────────
interface RawListItem {
  id: string
  type: PromotionType
  name: string
  status: PromotionStatus
  starts_at: string
  ends_at: string
  product_count?: number
}
interface RawProduct {
  id: string
  product_id: string
  variant_id: string | null
  discount_type: 'percent' | 'fixed' | null
  discount_percent: number | null
  discount_price_uzs: number | null
  promo_stock: number | null
  per_order_limit: number | null
  title?: Record<string, string>
  original_price_uzs?: number
  image_url?: string
  variant_label?: string | null
  variant_price_uzs?: number | null
}
interface RawDetail {
  id: string
  type: PromotionType
  name: string
  status: PromotionStatus
  starts_at: string
  ends_at: string
  products?: RawProduct[]
}

function pickTitle(t?: Record<string, string>): string {
  if (!t) return ''
  return t['uz'] || t['ru'] || t['en'] || Object.values(t)[0] || ''
}
function mapProduct(p: RawProduct): PromotionProductRow {
  return {
    id: p.id,
    productId: p.product_id,
    variantId: p.variant_id,
    title: pickTitle(p.title),
    image: p.image_url ?? '',
    originalPriceUzs: p.original_price_uzs ?? 0,
    variantLabel: p.variant_label ?? null,
    variantPriceUzs: p.variant_price_uzs ?? null,
    discountType: p.discount_type,
    discountPercent: p.discount_percent,
    discountPriceUzs: p.discount_price_uzs,
    promoStock: p.promo_stock,
    perOrderLimit: p.per_order_limit,
  }
}

// ── reads ─────────────────────────────────────────────────────────────────────
export async function listPromotions(
  type: PromotionType | 'all',
  status: PromotionStatus | 'all',
  q: string,
  page: number,
): Promise<PromotionListResponse> {
  const params: Record<string, string> = { limit: '20', offset: String((page - 1) * 20) }
  if (type !== 'all') params['type'] = type
  if (status !== 'all') params['status'] = status
  if (q) params['q'] = q
  const { data } = await apiClient.get<{ promotions: RawListItem[]; total: number }>(PATHS.list, { params })
  return {
    total: data.total ?? 0,
    promotions: (data.promotions ?? []).map((r) => ({
      id: r.id, type: r.type, name: r.name, status: r.status,
      startsAt: r.starts_at, endsAt: r.ends_at, productCount: r.product_count ?? 0,
    })),
  }
}

export async function getPromotion(id: string): Promise<PromotionDetail> {
  const { data } = await apiClient.get<RawDetail>(PATHS.detail(id))
  return {
    id: data.id, type: data.type, name: data.name, status: data.status,
    startsAt: data.starts_at, endsAt: data.ends_at,
    products: (data.products ?? []).map(mapProduct),
  }
}

// ── writes ──────────────────────────────────────────────────────────────────
export async function createPromotion(input: { type: PromotionType; name: string; startsAt: string; endsAt: string }): Promise<string> {
  const { data } = await apiClient.post<{ id: string }>(PATHS.create, {
    type: input.type, name: input.name, starts_at: input.startsAt, ends_at: input.endsAt,
  })
  return data.id
}

export async function updatePromotionHeader(id: string, input: { name: string; startsAt: string; endsAt: string }): Promise<void> {
  await apiClient.put(PATHS.update(id), { name: input.name, starts_at: input.startsAt, ends_at: input.endsAt })
}

export function lineToPayload(l: DiscountLine): PromotionProductPayload {
  const base: PromotionProductPayload = {
    product_id: l.productId,
    variant_id: l.variantId,
    discount_type: l.discountType,
  }
  if (l.discountType === 'percent') base.discount_percent = Math.round(Number(l.value) || 0)
  else base.discount_price_uzs = Math.round(Number(l.value) || 0)
  if (l.promoStock.trim() !== '') base.promo_stock = Math.round(Number(l.promoStock))
  if (l.perOrderLimit.trim() !== '') base.per_order_limit = Math.round(Number(l.perOrderLimit))
  return base
}

export async function setPromotionProducts(id: string, lines: DiscountLine[]): Promise<void> {
  await apiClient.post(PATHS.products(id), { products: lines.map(lineToPayload) })
}

export async function publishPromotion(id: string): Promise<void> {
  await apiClient.post(PATHS.publish(id))
}
export async function deletePromotion(id: string): Promise<void> {
  await apiClient.delete(PATHS.remove(id))
}
export async function duplicatePromotion(id: string): Promise<string> {
  const { data } = await apiClient.post<{ id: string }>(PATHS.duplicate(id))
  return data.id
}

// Orchestrated save: create-or-update header → replace products → (optional) publish.
export async function saveDiscountPromotion(args: {
  id?: string
  name: string
  startsAt: string
  endsAt: string
  lines: DiscountLine[]
  publish: boolean
}): Promise<string> {
  let id = args.id
  if (id) await updatePromotionHeader(id, args)
  else id = await createPromotion({ type: 'discount', name: args.name, startsAt: args.startsAt, endsAt: args.endsAt })
  await setPromotionProducts(id, args.lines)
  if (args.publish) await publishPromotion(id).catch(() => undefined) // already-published edits are fine
  return id
}
