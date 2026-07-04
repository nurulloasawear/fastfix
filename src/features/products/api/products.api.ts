// Products API — wired to real ozb-backend routes where they exist.
// [PENDING BACKEND] markers remain for routes not yet implemented.
import { apiClient } from '@/lib/axios'
import type { Language } from '@/i18n'
import { pickLang, type LangMap } from '@/lib/lang'
import type {
  Brand,
  BrandListResponse,
  BrandRegistrationInput,
  BrandSearchResult,
  BulkUpdateInput,
  ListingIssuesResponse,
  Product,
  ProductFormData,
  ProductListQuery,
  ProductListResponse,
  ProductStatus,
  ProductStatusTab,
  ReviewListResponse,
  SizeChart,
  SizeChartDetail,
  SizeChartListQuery,
  SizeChartListResponse,
  SizeTemplate,
  SaveSizeChartInput,
  SortOption,
  UnpublishedListResponse,
  ViolationListResponse,
} from '../types/products.types'

// ── Real backend paths ────────────────────────────────────────────────────────
export const PATHS = {
  // Real routes (✅ exist in ozb-backend)
  sellerProducts: '/sellers/me/products',
  sellerProductDetail: (id: string) => `/sellers/me/products/${id}`,
  sellerProductStatus: (id: string) => `/sellers/me/products/${id}/status`,
  sellerProductCopy: (id: string) => `/sellers/me/products/${id}/copy`,
  sellerProductPublish: (id: string) => `/sellers/me/products/${id}/publish`,
  sellerProductWithdrawReview: (id: string) => `/sellers/me/products/${id}/withdraw-review`,
  sellerProductLabels: (id: string) => `/sellers/me/products/${id}/labels`,
  sellerProductAppeal: (id: string) => `/sellers/me/products/${id}/appeal`,
  sellerProductsBulk: '/sellers/me/products/bulk',
  listingIssues: '/sellers/me/products/listing-issues',
  violations: '/sellers/me/products/violations',
  brands: '/sellers/me/product-settings/brands',
  brandSearch: '/sellers/me/brands',
  sizeCharts: '/sellers/me/product-settings/size-charts',
  sizeTemplates: '/sellers/me/product-settings/size-templates',
  massUploadTemplate: '/sellers/me/mass-upload/template',
  massUpload: '/sellers/me/mass-upload',
  massUploadJobs: '/sellers/me/mass-upload/jobs',
  aiImport: '/sellers/me/ai-import',
  aiImportItems: (jobId: string) => `/sellers/me/ai-import/jobs/${jobId}/items`,
  aiImportItem: (id: string) => `/sellers/me/ai-import/items/${id}`,
  aiImportItemDecision: (id: string) => `/sellers/me/ai-import/items/${id}/decision`,
  aiImportJobDecision: (jobId: string) => `/sellers/me/ai-import/jobs/${jobId}/decision`,
  sizeChartDetail: (id: string) => `/sellers/me/product-settings/size-charts/${id}`,
  productSizeChart: (id: string) => `/sellers/me/products/${id}/size-chart`,
  catalogDetail: (id: string) => `/catalog/${id}`,
  catalogCreate: '/catalog',
  catalogUpdate: (id: string) => `/catalog/${id}`,
  catalogDelete: (id: string) => `/catalog/${id}`,
  categories: '/catalog/categories',
  categoryTree: '/catalog/category-tree',
  mediaUploadUrl: '/media/upload-url',
  // [PENDING BACKEND] routes — keep at legacy mock paths
  bulkAppeal: '/seller/products/bulk-appeal',
  boost: (id: string) => `/seller/products/${id}/boost`,
  // Legacy alias kept for backward-compat; callers use named functions above
  brandRegister: '/sellers/me/product-settings/brands',
} as const

// ── Language helper ────────────────────────────────────────────────────────────
function currentLang(): Language {
  return (localStorage.getItem('ozb_seller_lang') as Language | null) ?? 'uz'
}

// ── Backend DTO types (snake_case) ────────────────────────────────────────────
interface BackendLangMap {
  uz?: string
  ru?: string
  en?: string
}

// GET /sellers/me/products → product row
// Backend now sends: status includes 'draft'|'under_review'|'delisted'|'banned'|'deboosted'|'admin_deleted'
// but list rows still lack impressions/search_traffic/listing_issue_count/labels/seller_sku
interface BackendProductSummary {
  id: string
  title: BackendLangMap
  price_uzs: number
  max_price_uzs?: number | null
  compare_at_uzs?: number | null
  stock: number
  status: string
  category?: string
  brand?: string
  rating?: number
  review_count?: number
  sold?: number
  has_variants?: boolean
  image_urls: string[]
  // Extended fields present on list rows when available
  impressions?: number
  search_traffic?: number
  listing_issue_count?: number
  labels?: string[]
  seller_sku?: string | null
  created_at?: string
  updated_at?: string
}

// GET /sellers/me/products/{id} → full write-model detail
interface BackendProductDetail extends BackendProductSummary {
  category_id?: string | null
  category_path?: Array<{ id: string; name: BackendLangMap }>
  brand_id?: string | null
  size_chart_id?: string | null
  description?: BackendLangMap
  video_url?: string | null
  video_poster_url?: string | null
  promotion_image_url?: string | null
  gtin?: string | null
  gtin_exempt?: boolean
  condition?: string | null
  included_items?: string | null
  dangerous_goods?: string | null
  weight_kg?: number | null
  width_cm?: number | null
  height_cm?: number | null
  length_cm?: number | null
  shipping_methods?: string[]
  pre_order?: boolean
  ships_in_days?: number | null
  ikpu?: string | null
  vat_percent?: number | null
  attributes?: Array<{ key: string; value: string }>
  variation_groups?: BackendVariationGroup[]
  variants?: BackendVariant[]
  wholesale_tiers?: BackendWholesaleTier[]
}

interface BackendVariant {
  id?: string
  label?: string
  options?: Record<string, string> | string[]
  price_uzs?: number
  stock?: number
  sku?: string
  image_url?: string | null
  compare_at_uzs?: number | null
  available?: boolean
}

interface BackendVariationGroup {
  id: string
  name: string
  position: number
  options: Array<{ value: string; image_url?: string | null; position: number }>
}

interface BackendWholesaleTier {
  id?: string
  min_qty: number
  max_qty?: number | null
  price_uzs: number
}

interface BackendCategory {
  category: string
  count: number
}

// Summary returned by GET /sellers/me/products — backend has expanded to include 'draft' etc.
// Keep optional for any keys not yet returned, default to 0.
interface BackendProductsSummary {
  all: number
  active?: number
  hidden?: number
  sold_out?: number
  no_stock?: number
  draft?: number
  under_review?: number
  delisted?: number
  banned?: number
  deboosted?: number
  admin_deleted?: number
}

interface BackendProductsListResponse {
  products: BackendProductSummary[]
  total?: number
  summary?: BackendProductsSummary
}

interface BackendCategoriesResponse {
  categories: BackendCategory[]
}

interface BackendCreateResponse {
  id: string
  status?: string
}

interface BackendUpdateResponse {
  id: string
  status?: string
  updated?: boolean
}

// ── Status mapper (backend → client ProductStatus) ────────────────────────────
// Backend now has the full status enum; map to client's ProductStatus union.
function mapBackendStatus(raw: string): ProductStatus {
  switch (raw) {
    case 'active':
    case 'sold_out':
      return 'live'
    case 'hidden':
    case 'delisted':
      return 'delisted'
    case 'draft':
      return 'draft'
    case 'under_review':
      return 'under_review'
    case 'banned':
      return 'banned'
    case 'deboosted':
      return 'deboosted'
    case 'admin_deleted':
      return 'admin_deleted'
    default:
      return 'live'
  }
}

// ── DTO → client model ─────────────────────────────────────────────────────────
function mapSummaryToProduct(dto: BackendProductSummary): Product {
  const lang = currentLang()
  return {
    id: dto.id,
    name: pickLang(dto.title, lang),
    parentSku: dto.seller_sku ?? '-',
    itemId: dto.id,
    thumbnails: dto.image_urls ?? [],
    minPriceUzs: dto.price_uzs,
    // Range top = highest variant price (NOT compare_at — that's a stale/promotion field).
    maxPriceUzs: dto.max_price_uzs ?? dto.price_uzs,
    totalStock: dto.stock,
    salesCount: dto.sold ?? 0,
    impressions: dto.impressions ?? 0,
    searchCount: dto.search_traffic ?? 0,
    status: mapBackendStatus(dto.status),
    listingIssueCount: dto.listing_issue_count ?? 0,
    category: dto.category ?? '',
    labels: dto.labels ?? [],
    updatedAt: dto.updated_at ?? '',
    brand: dto.brand ?? '',
    compareAtUzs: dto.compare_at_uzs ?? null,
    rating: dto.rating ?? 0,
    reviewCount: dto.review_count ?? 0,
    hasVariants: dto.has_variants ?? false,
    createdAt: dto.created_at ?? '',
    soldOut: dto.status === 'sold_out',
  }
}

// ── client model → backend create/update payload ──────────────────────────────
function mapFormToPayload(input: ProductFormData, publish?: boolean): Record<string, unknown> {
  const firstSku = input.skus[0]
  const priceUzs = firstSku ? Number(firstSku.priceUzs) : 0
  const stock = firstSku ? Number(firstSku.stock) : 0

  const payload: Record<string, unknown> = {
    // publish:false → backend creates as draft; true/undefined → active.
    ...(publish !== undefined ? { publish } : {}),
    title: { uz: input.nameUz, ru: input.nameRu, en: input.nameEn },
    price_uzs: priceUzs,
    stock,
    image_urls: input.images,
  }

  if (input.descUz || input.descRu || input.descEn) {
    payload['description'] = { uz: input.descUz, ru: input.descRu, en: input.descEn }
  }
  if (input.category) payload['category'] = input.category
  if (input.categoryId) payload['category_id'] = input.categoryId
  if (input.brand) payload['brand'] = input.brand
  if (input.brandId) payload['brand_id'] = input.brandId
  // Always send (incl. '') so the backend links/unlinks the size chart atomically.
  payload['size_chart_id'] = input.sizeChartId ?? ''
  if (input.videoUrl) payload['video_url'] = input.videoUrl
  if (input.promotionImage) payload['promotion_image_url'] = input.promotionImage
  if (input.gtin) payload['gtin'] = input.gtin
  payload['gtin_exempt'] = input.gtinExempt ?? false
  if (input.condition) payload['condition'] = input.condition
  if (input.includedItems) payload['included_items'] = input.includedItems
  if (input.dangerousGoods) payload['dangerous_goods'] = input.dangerousGoods
  if (input.weightKg) payload['weight_kg'] = Number(input.weightKg)
  if (input.widthCm) payload['width_cm'] = Number(input.widthCm)
  if (input.heightCm) payload['height_cm'] = Number(input.heightCm)
  if (input.lengthCm) payload['length_cm'] = Number(input.lengthCm)
  payload['pre_order'] = input.preOrder ?? false
  if (input.preOrderDays) payload['ships_in_days'] = Number(input.preOrderDays)

  const shippingMethods: string[] = []
  if (input.shippingStandard) shippingMethods.push('standard')
  if (input.shippingExpress) shippingMethods.push('express')
  if (shippingMethods.length > 0) payload['shipping_methods'] = shippingMethods

  // Wholesale tiers are bulk-pricing (typically BELOW retail) — they are NOT the
  // compare-at/strikethrough price. Sending the tier price as compare_at_uzs broke
  // the `compare_at_uzs > price_uzs` check → 500 whenever wholesale was enabled.
  if (input.wholesaleEnabled && input.wholesaleTiers[0]) {
    payload['wholesale_tiers'] = input.wholesaleTiers.map((t) => ({
      min_qty: Number(t.minQty ?? 1),
      max_qty: t.maxQty ? Number(t.maxQty) : null,
      price_uzs: Number(t.priceUzs),
    }))
  }

  if (input.hasVariants && input.skus.length > 0) {
    payload['has_variants'] = true
    // axis names (e.g. Rang / Olcham) — fall back to generic keys if groups absent
    const axis1 = input.variations[0]?.name?.trim() || 'option1'
    const axis2 = input.variations[1]?.name?.trim() || 'option2'
    payload['variants'] = input.skus.map((sku, idx) => {
      // options MUST be unique per variant — backend has UNIQUE(product_id, options).
      // Omitting it (the old bug) made every variant {} and collided → 500 on save.
      const options: Record<string, string> = {}
      if (sku.variation1) options[axis1] = sku.variation1
      if (sku.variation2) options[axis2] = sku.variation2
      if (Object.keys(options).length === 0) options['variant'] = sku.sellerSku || `option-${idx + 1}`
      return {
        ...(sku.id ? { id: sku.id } : {}),
        label: sku.variation2 ? `${sku.variation1} / ${sku.variation2}` : sku.variation1,
        options,
        price_uzs: Number(sku.priceUzs) || 0,
        stock: Number(sku.stock) || 0,
        sku: sku.sellerSku,
        available: sku.available ?? true,
        ...(sku.imageUrl ? { image_url: sku.imageUrl } : {}),
        ...(sku.compareAtUzs ? { compare_at_uzs: Number(sku.compareAtUzs) } : {}),
      }
    })
    // Send variation_groups if populated
    if (input.variations && input.variations.length > 0) {
      payload['variation_groups'] = input.variations.map((vg, i) => ({
        name: vg.name,
        position: i,
        options: (vg.options ?? []).map((opt, j) => ({
          value: opt,
          position: j,
          image_url: null,
        })),
      }))
    }
  }

  return payload
}

// READ-side variant mapping: backend dto.variants[] → SkuRow[]
function variantsToSkus(dto: BackendProductDetail): ProductFormData['skus'] {
  if (dto.variants?.length) {
    return dto.variants.map((v) => {
      const [v1 = '', v2 = ''] = (v.label ?? '').split(' / ')
      return {
        variation1: v1,
        variation2: v2,
        priceUzs: String(v.price_uzs ?? dto.price_uzs),
        stock: String(v.stock ?? 0),
        sellerSku: v.sku ?? '-',
        available: v.available ?? (v.stock ?? 0) > 0,
        ...(v.id ? { id: v.id } : {}),
        ...(v.image_url ? { imageUrl: v.image_url } : {}),
        ...(v.compare_at_uzs ? { compareAtUzs: String(v.compare_at_uzs) } : {}),
      }
    })
  }
  return [
    {
      variation1: '',
      variation2: '',
      priceUzs: String(dto.price_uzs),
      stock: String(dto.stock),
      sellerSku: dto.seller_sku ?? '-',
      available: dto.status !== 'hidden' && dto.status !== 'delisted',
    },
  ]
}

// ── detail DTO → ProductFormData ───────────────────────────────────────────────
// Uses GET /sellers/me/products/{id} (full write model) as source.
function mapDetailToFormData(dto: BackendProductDetail): ProductFormData {
  const shippingMethods = dto.shipping_methods ?? []
  // Wholesale tiers: map first tier's price_uzs back to compare_at for the form
  const hasTiers = (dto.wholesale_tiers?.length ?? 0) > 0
  const mappedTiers = (dto.wholesale_tiers ?? []).map((t) => ({
    minQty: String(t.min_qty),
    maxQty: t.max_qty != null ? String(t.max_qty) : '',
    priceUzs: String(t.price_uzs),
  }))

  return {
    images: dto.image_urls ?? [],
    promotionImage: dto.promotion_image_url ?? '',
    videoUrl: dto.video_url ?? '',
    nameUz: dto.title?.uz ?? '',
    nameRu: dto.title?.ru ?? '',
    nameEn: dto.title?.en ?? '',
    // Prefer the live taxonomy breadcrumb; fall back to legacy free-text category.
    category:
      dto.category_path && dto.category_path.length > 0
        ? dto.category_path.map((c) => categoryName(c.name)).join(' > ')
        : dto.category ?? '',
    categoryId: dto.category_id ?? '',
    gtin: dto.gtin ?? '',
    gtinExempt: dto.gtin_exempt ?? false,
    brand: dto.brand ?? '',
    brandId: dto.brand_id ?? '',
    sizeChartId: dto.size_chart_id ?? '',
    condition: (dto.condition as ProductFormData['condition']) ?? 'new',
    colourFamily: dto.attributes?.find((a) => a.key === 'colour_family')?.value ?? '',
    descUz: dto.description?.uz ?? '',
    descRu: dto.description?.ru ?? '',
    descEn: dto.description?.en ?? '',
    // variation_groups → variations[] (FE VariationGroup.options is string[])
    variations: (dto.variation_groups ?? []).map((vg) => ({
      name: vg.name,
      options: vg.options.map((opt) => opt.value),
    })),
    hasVariants: dto.has_variants ?? false,
    skus: variantsToSkus(dto),
    wholesaleEnabled: hasTiers,
    wholesaleTiers: mappedTiers,
    weightKg: dto.weight_kg != null ? String(dto.weight_kg) : '',
    widthCm: dto.width_cm != null ? String(dto.width_cm) : '',
    heightCm: dto.height_cm != null ? String(dto.height_cm) : '',
    lengthCm: dto.length_cm != null ? String(dto.length_cm) : '',
    shippingStandard: shippingMethods.includes('standard'),
    shippingExpress: shippingMethods.includes('express'),
    preOrder: dto.pre_order ?? false,
    preOrderDays: dto.ships_in_days != null ? String(dto.ships_in_days) : '',
    dangerousGoods: (dto.dangerous_goods ?? 'none') as ProductFormData['dangerousGoods'],
    includedItems: dto.included_items ?? '',
  }
}

// client status tab → backend ?status param
// Backend now accepts full status enum via ?status= query param.
function tabToBackendStatus(tab?: ProductStatusTab): string | undefined {
  switch (tab) {
    case 'live':         return 'active'       // FE filter; backend also has sold_out — handled in summary
    case 'unpublished':  return 'delisted'
    case 'under_review': return 'under_review'
    case 'violation':    return 'banned'        // violation tab defaults to banned sub-tab
    default:             return undefined        // 'all' = no filter
  }
}

// client sort → backend sort param
function sortToBackend(sort?: SortOption): string | undefined {
  switch (sort) {
    case 'recommended':  return 'popular'
    case 'price_asc':
    case 'price_desc':
    case 'stock_asc':
      return sort
    default:             return undefined        // newest (backend default)
  }
}

// ── List ──────────────────────────────────────────────────────────────────────
// ✅ Real route: GET /sellers/me/products
export async function getProducts(query: ProductListQuery): Promise<ProductListResponse> {
  const limit = query.limit ?? 20
  const params: Record<string, string> = {
    limit: String(limit),
    offset: String(((query.page ?? 1) - 1) * limit),
  }
  const status = query.backendStatus ?? tabToBackendStatus(query.status)
  if (status) params['status'] = status
  if (query.status === 'no_stock') params['no_stock'] = '1' // restock view: stock=0 across statuses
  if (query.q) params['q'] = query.q
  const sort = sortToBackend(query.sort)
  if (sort) params['sort'] = sort

  const { data } = await apiClient.get<BackendProductsListResponse>(PATHS.sellerProducts, { params })
  const products = (data.products ?? []).map(mapSummaryToProduct)

  // Build summary from backend — backend now sends full enum where available.
  const s = data.summary
  const summary = s
    ? {
        all:          s.all,
        live:         (s.active ?? 0) + (s.sold_out ?? 0),
        no_stock:     s.no_stock ?? 0,
        violation:    (s.banned ?? 0) + (s.deboosted ?? 0) + (s.admin_deleted ?? 0),
        under_review: s.under_review ?? 0,
        unpublished:  (s.delisted ?? 0) + (s.draft ?? 0), // hidden = deleted, not "unpublished"
      }
    : {
        all:          products.length,
        live:         products.filter((p) => p.status === 'live').length,
        no_stock:     products.filter((p) => p.totalStock === 0).length,
        violation:    products.filter((p) => ['banned', 'deboosted', 'admin_deleted'].includes(p.status)).length,
        under_review: products.filter((p) => p.status === 'under_review').length,
        unpublished:  products.filter((p) => p.status === 'delisted' || p.status === 'draft').length,
      }

  return { products, total: data.total ?? products.length, summary }
}

// ── Listing issues ────────────────────────────────────────────────────────────
// ✅ Real route: GET /sellers/me/products/listing-issues
export async function getListingIssues(): Promise<ListingIssuesResponse> {
  const { data } = await apiClient.get<ListingIssuesResponse>(PATHS.listingIssues)
  return data
}

// ── Violations ────────────────────────────────────────────────────────────────
// ✅ Real route: GET /sellers/me/products/violations
// Backend returns { products: [...], total, summary }
// ViolationListResponse.products[]  fields: id, productName, updatedAt, violationType, violationReason, deadline, suggestion
interface BackendViolationRow {
  id: string
  product_id: string
  product_title?: BackendLangMap
  image_urls?: string[]
  updated_at?: string
  violation_type?: string
  reason?: string
  suggestion?: string
  deadline?: string | null
  appeal_status?: string
}
interface BackendViolationsResponse {
  products: BackendViolationRow[]
  total: number
  summary?: { banned: number; deboosted: number; admin_deleted: number }
}

export async function getViolationProducts(): Promise<ViolationListResponse> {
  const lang = currentLang()
  const { data } = await apiClient.get<BackendViolationsResponse>(PATHS.violations)
  const products = (data.products ?? []).map((v) => ({
    id: v.product_id ?? v.id,
    productName: pickLang(v.product_title ?? {}, lang),
    updatedAt: v.updated_at ?? '',
    violationType: v.violation_type ?? '',
    violationReason: v.reason ?? '',
    deadline: v.deadline ?? '',
    suggestion: v.suggestion ?? '',
  }))
  return { products, total: data.total ?? products.length }
}

// ── Under-review ──────────────────────────────────────────────────────────────
// ✅ Real route: GET /sellers/me/products?status=under_review
export async function getReviewProducts(): Promise<ReviewListResponse> {
  const result = await getProducts({ status: 'under_review' })
  const products = result.products.map((p) => ({
    id: p.id,
    productName: p.name,
    thumbnails: p.thumbnails,
    updatedAt: p.updatedAt,
    priceUzs: p.minPriceUzs,
    stock: p.totalStock,
  }))
  return { products, total: result.total }
}

// ── Unpublished ───────────────────────────────────────────────────────────────
// ✅ Real route: GET /sellers/me/products?status=delisted  (or draft for sub-tab)
export async function getUnpublishedProducts(sub?: string, page?: number): Promise<UnpublishedListResponse> {
  // Query the actual backend status directly (was always fetching 'delisted', so the
  // Draft sub-tab returned nothing). Default to draft (the common unpublished case).
  const backendStatus = sub === 'delisted' ? 'delisted' : 'draft'
  const result = await getProducts({ backendStatus, page })
  const mapped = result.products.map((p) => ({
    id: p.id,
    productName: p.name,
    thumbnails: p.thumbnails,
    salesCount: p.salesCount,
    priceUzs: p.minPriceUzs,
    stock: p.totalStock,
    status: p.status as 'delisted' | 'draft',
    updatedAt: p.updatedAt,
  }))
  return { products: mapped, total: result.total ?? mapped.length }
}

// ── Detail (for edit form) ────────────────────────────────────────────────────
// ✅ Real route: GET /sellers/me/products/{id}  (full write-model)
export async function getProductDetail(id: string): Promise<ProductFormData> {
  const { data } = await apiClient.get<BackendProductDetail>(PATHS.sellerProductDetail(id))
  return mapDetailToFormData(data)
}

// ── Create ────────────────────────────────────────────────────────────────────
// ✅ Real route: POST /catalog
export async function createProduct(input: ProductFormData, publish?: boolean): Promise<{ id: string }> {
  const payload = mapFormToPayload(input, publish)
  const { data } = await apiClient.post<BackendCreateResponse>(PATHS.catalogCreate, payload)
  return { id: data.id }
}

// ── Update ────────────────────────────────────────────────────────────────────
// ✅ Real route: PUT /catalog/{id}
export async function updateProduct(id: string, input: ProductFormData): Promise<void> {
  const payload = mapFormToPayload(input)
  await apiClient.put<BackendUpdateResponse>(PATHS.catalogUpdate(id), payload)
}

// ── Status patch ──────────────────────────────────────────────────────────────
// ✅ Real route: PATCH /sellers/me/products/{id}/status
export async function patchProductStatus(id: string, status: string): Promise<void> {
  await apiClient.patch(PATHS.sellerProductStatus(id), { status })
}

// ── Delete ────────────────────────────────────────────────────────────────────
// ✅ Real route: DELETE /catalog/{id}
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(PATHS.catalogDelete(id))
}

// ── Delist (wraps patchProductStatus) ────────────────────────────────────────
// ✅ Real route: PATCH /sellers/me/products/{id}/status  body: {status:"delisted"}
export async function delistProduct(id: string): Promise<void> {
  await apiClient.patch(PATHS.sellerProductStatus(id), { status: 'delisted' })
}

// ── Copy ──────────────────────────────────────────────────────────────────────
// ✅ Real route: POST /sellers/me/products/{id}/copy → {id: "new-uuid"}
export async function copyProduct(id: string): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(PATHS.sellerProductCopy(id))
  return data
}

// ── Publish ───────────────────────────────────────────────────────────────────
// ✅ Real route: POST /sellers/me/products/{id}/publish
// Old signature accepted unknown payload; now requires id.
export async function publishProduct(idOrInput: unknown): Promise<void> {
  // Support legacy callers that pass { id, ...} or just an id string
  const id = typeof idOrInput === 'string'
    ? idOrInput
    : (idOrInput as Record<string, unknown>)?.['id'] as string | undefined
  if (!id) return
  await apiClient.post(PATHS.sellerProductPublish(id))
}

// ── Withdraw from review ──────────────────────────────────────────────────────
// ✅ Real route: POST /sellers/me/products/{id}/withdraw-review
export async function withdrawProductFromReview(id: string): Promise<void> {
  await apiClient.post(PATHS.sellerProductWithdrawReview(id))
}

// ── Labels ────────────────────────────────────────────────────────────────────
// ✅ Real route: PATCH /sellers/me/products/{id}/labels
export async function patchProductLabels(id: string, labels: string[]): Promise<{ id: string; labels: string[] }> {
  const { data } = await apiClient.patch<{ id: string; labels: string[] }>(
    PATHS.sellerProductLabels(id),
    { labels },
  )
  return data
}

// ── Bulk operations ───────────────────────────────────────────────────────────
// ✅ Real route: POST /sellers/me/products/bulk
export async function bulkUpdate(input: BulkUpdateInput): Promise<{ updated: number }> {
  const payload = {
    action: input.action,
    product_ids: input.productIds,
  }
  const { data } = await apiClient.post<{ updated: number; failed: number }>(PATHS.sellerProductsBulk, payload)
  return { updated: data.updated }
}

// [PENDING BACKEND] — bulk-appeal returns 405 (route not registered); keep at legacy mock path
export async function bulkAppeal(productIds: string[]): Promise<{ submitted: number }> {
  const { data } = await apiClient.post<{ submitted: number }>(PATHS.bulkAppeal, { productIds })
  return data
}

// ── Appeal ────────────────────────────────────────────────────────────────────
// ✅ Real route: POST /sellers/me/products/{id}/appeal
export async function appealProduct(id: string, reason: string): Promise<void> {
  await apiClient.post(PATHS.sellerProductAppeal(id), { reason, evidence_urls: [] })
}

// ── Brands ────────────────────────────────────────────────────────────────────
// Brand Management list — the seller's registration submissions (real route:
// GET /sellers/me/product-settings/brands).
export async function getBrands(): Promise<BrandListResponse> {
  const { data } = await apiClient.get<{ brands?: Array<Record<string, unknown>>; total?: number }>(PATHS.brands)
  const brands: Brand[] = (data.brands ?? []).map((b) => ({
    id: String(b.id ?? ''),
    brandName: String(b.brand_name ?? ''),
    category: String(b.category ?? ''),
    registrationDate: String(b.registered_at ?? ''),
    status: (b.status as Brand['status']) ?? 'pending',
  }))
  return { brands, total: data.total ?? brands.length }
}

// Formal "Register a brand" submission (real route: POST /sellers/me/product-settings/brands).
export async function registerBrand(input: BrandRegistrationInput): Promise<void> {
  await apiClient.post(PATHS.brands, {
    brand_name: input.brandName,
    category_id: input.categoryId,
    sample_image_urls: input.sampleImageUrls,
    logo_url: input.logoUrl,
    website: input.website,
    additional_info: input.additionalInfo,
    acknowledged: input.acknowledged,
  })
}

// Brand registry search for the in-product picker (real route: GET /sellers/me/brands).
export async function searchBrands(q: string): Promise<BrandSearchResult[]> {
  const { data } = await apiClient.get<{ brands?: Array<Record<string, unknown>> }>(PATHS.brandSearch, {
    params: q ? { q } : {},
  })
  return (data.brands ?? []).map(mapBrandResult)
}

// Picker "add new" → an OPEN brand (deduped). Returns the (possibly existing) brand.
export async function quickCreateBrand(name: string): Promise<BrandSearchResult> {
  const { data } = await apiClient.post<Record<string, unknown>>(PATHS.brandSearch, { name })
  return mapBrandResult(data)
}

function mapBrandResult(b: Record<string, unknown>): BrandSearchResult {
  return {
    id: String(b.id ?? ''),
    name: String(b.name ?? ''),
    logoUrl: (b.logo_url as string) || undefined,
    protection: (b.protection as BrandSearchResult['protection']) ?? 'open',
    ownedByYou: Boolean(b.owned_by_you),
    useStatus: (b.use_status as BrandSearchResult['useStatus']) ?? 'open',
  }
}

// ── Size charts ───────────────────────────────────────────────────────────────
// ✅ Real routes: GET/POST/PUT/DELETE /sellers/me/product-settings/size-charts (+ /size-templates)
export async function getSizeTemplates(): Promise<SizeTemplate[]> {
  const { data } = await apiClient.get<{ templates?: Array<Record<string, unknown>> }>(PATHS.sizeTemplates)
  return (data.templates ?? []).map(mapTemplate)
}

function mapTemplate(t: Record<string, unknown>): SizeTemplate {
  const ms = (t.measurements as Array<Record<string, unknown>>) ?? []
  const ss = (t.size_systems as Array<Record<string, unknown>>) ?? []
  return {
    id: String(t.id ?? ''),
    slug: String(t.slug ?? ''),
    name: (t.name as SizeTemplate['name']) ?? {},
    gender: String(t.gender ?? ''),
    garmentType: String(t.garment_type ?? ''),
    measurementSlugs: (t.measurement_slugs as string[]) ?? [],
    sizeSystemCodes: (t.size_system_codes as string[]) ?? [],
    defaultSystemCode: String(t.default_system_code ?? ''),
    primaryAttrSlug: String(t.primary_attr_slug ?? ''),
    measurements: ms.map((m) => ({
      slug: String(m.slug ?? ''),
      name: (m.name as SizeTemplate['name']) ?? {},
      measureKind: (m.measure_kind as 'length' | 'girth' | 'mass') ?? 'length',
      howTo: m.how_to as SizeTemplate['name'] | undefined,
    })),
    sizeSystems: ss.map((s) => ({
      code: String(s.code ?? ''),
      name: (s.name as SizeTemplate['name']) ?? {},
      kind: String(s.kind ?? ''),
      isLabelSystem: Boolean(s.is_label_system),
    })),
  }
}

export async function getSizeCharts(query: SizeChartListQuery): Promise<SizeChartListResponse> {
  const { data } = await apiClient.get<{ size_charts?: Array<Record<string, unknown>>; total?: number }>(
    PATHS.sizeCharts, { params: query },
  )
  const sizeCharts: SizeChart[] = (data.size_charts ?? []).map((c) => ({
    id: String(c.id ?? ''),
    name: String(c.name ?? ''),
    templateSlug: String(c.template_slug ?? ''),
    templateName: (c.template_name as SizeChart['templateName']) ?? {},
    sizeSystemCode: String(c.size_system_code ?? ''),
    displayUnit: String(c.display_unit ?? 'cm'),
    status: (c.status as SizeChart['status']) ?? 'active',
    registrationDate: String(c.registered_at ?? ''),
    rowCount: Number(c.row_count ?? 0),
    linkedProducts: Number(c.linked_products ?? 0),
  }))
  return { sizeCharts, total: data.total ?? sizeCharts.length }
}

export async function getSizeChart(id: string): Promise<SizeChartDetail> {
  const { data } = await apiClient.get<Record<string, unknown>>(PATHS.sizeChartDetail(id))
  const rows = (data.rows as Array<Record<string, unknown>>) ?? []
  return {
    id: String(data.id ?? ''),
    templateId: String(data.template_id ?? ''),
    name: String(data.name ?? ''),
    sizeSystemCode: String(data.size_system_code ?? ''),
    displayUnit: (data.display_unit as 'cm' | 'in') ?? 'cm',
    rows: rows.map((r) => ({
      sizeLabel: String(r.size_label ?? ''),
      cells: (r.cells as SizeChartDetail['rows'][number]['cells']) ?? {},
    })),
  }
}

function toSavePayload(input: SaveSizeChartInput) {
  return {
    template_id: input.templateId,
    name: input.name,
    size_system_code: input.sizeSystemCode,
    display_unit: input.displayUnit,
    rows: input.rows.map((r) => ({
      size_label: r.sizeLabel,
      cells: r.cells.map((c) => ({
        attribute_slug: c.attributeSlug,
        value_min: c.valueMin,
        value_max: c.valueMax ?? null,
      })),
    })),
  }
}

export async function createSizeChart(input: SaveSizeChartInput): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(PATHS.sizeCharts, toSavePayload(input))
  return { id: data.id }
}

export async function updateSizeChart(id: string, input: SaveSizeChartInput): Promise<void> {
  await apiClient.put(PATHS.sizeChartDetail(id), toSavePayload(input))
}

export async function deleteSizeChart(id: string): Promise<void> {
  await apiClient.delete(PATHS.sizeChartDetail(id))
}

export async function setProductSizeChart(productId: string, chartId: string): Promise<void> {
  await apiClient.put(PATHS.productSizeChart(productId), { chart_id: chartId })
}

export async function unsetProductSizeChart(productId: string): Promise<void> {
  await apiClient.delete(PATHS.productSizeChart(productId))
}

// ── Mass upload ───────────────────────────────────────────────────────────────
// Real routes: GET /mass-upload/template (xlsx) · POST /mass-upload (multipart) · GET /mass-upload/jobs
export interface MassUploadJob {
  id: string
  fileName: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  total: number
  createdCount: number
  failedCount: number
  errors: Array<{ row: number; message: string }>
  createdAt: string
}

// Returns the R2 URL of the curated xlsx template (served from object storage).
export async function downloadMassTemplate(): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(PATHS.massUploadTemplate)
  return data.url
}

export async function uploadMassFile(file: File): Promise<{ jobId: string }> {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await apiClient.post<{ job_id: string }>(PATHS.massUpload, fd)
  return { jobId: data.job_id }
}

// AI Import — upload a short supplier xlsx (RU name + image URL + brand + price);
// the backend uses Gemini to produce full trilingual draft products. Returns a job
// id; poll getMassUploadJobs('ai_import') for progress.
export async function uploadAIImport(file: File): Promise<{ jobId: string }> {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await apiClient.post<{ job_id: string }>(PATHS.aiImport, fd)
  return { jobId: data.job_id }
}

// ── AI Import review / approval ────────────────────────────────────────────────
export type AIReviewStatus = 'ai_review' | 'active' | 'draft' | 'hidden'
export type ReviewDecision = 'approve' | 'draft' | 'reject'

export interface AIReviewItem {
  id: string
  title: LangMap
  description: LangMap
  priceUzs: number
  compareAtUzs: number | null
  stock: number
  status: AIReviewStatus
  brand: string
  brandId: string | null
  categoryId: string | null
  categoryPath: Array<{ id: string; name: LangMap }>
  imageUrls: string[]
  videoUrl: string | null
  hasVariants: boolean
  sellerSku: string | null
  attributes: Array<{ key: string; value: string }>
  missing: string[] // fields blocking publish: title|price|stock|category|size_chart
}

export interface AIReviewBatch {
  job: {
    id: string
    fileName: string
    status: string
    counts: { pending: number; published: number; draft: number; rejected: number; total: number }
  }
  items: AIReviewItem[]
}

export interface AIItemEdit {
  title?: Record<string, string>
  description?: Record<string, string>
  price_uzs?: number
  compare_at_uzs?: number | null
  stock?: number
  category_id?: string
  brand?: string
  brand_id?: string
}

export async function getAIImportItems(jobId: string): Promise<AIReviewBatch> {
  const { data } = await apiClient.get<Record<string, any>>(PATHS.aiImportItems(jobId))
  return {
    job: {
      id: data.job?.id ?? jobId,
      fileName: data.job?.file_name ?? '',
      status: data.job?.status ?? '',
      counts: data.job?.counts ?? { pending: 0, published: 0, draft: 0, rejected: 0, total: 0 },
    },
    items: (data.items ?? []).map((i: Record<string, any>) => ({
      id: String(i.id),
      title: i.title ?? {},
      description: i.description ?? {},
      priceUzs: Number(i.price_uzs ?? 0),
      compareAtUzs: i.compare_at_uzs ?? null,
      stock: Number(i.stock ?? 0),
      status: i.status as AIReviewStatus,
      brand: i.brand ?? '',
      brandId: i.brand_id ?? null,
      categoryId: i.category_id ?? null,
      categoryPath: i.category_path ?? [],
      imageUrls: i.image_urls ?? [],
      videoUrl: i.video_url ?? null,
      hasVariants: !!i.has_variants,
      sellerSku: i.seller_sku ?? null,
      attributes: Array.isArray(i.attributes) ? i.attributes : [],
      missing: Array.isArray(i.missing) ? i.missing : [],
    })),
  }
}

export async function patchAIImportItem(id: string, fields: AIItemEdit): Promise<{ missing: string[] }> {
  const { data } = await apiClient.patch<{ missing?: string[] }>(PATHS.aiImportItem(id), fields)
  return { missing: data.missing ?? [] }
}

export async function decideAIImportItem(id: string, decision: ReviewDecision): Promise<{ status?: string }> {
  const { data } = await apiClient.post<{ status?: string }>(PATHS.aiImportItemDecision(id), { decision })
  return data
}

export async function decideAIImportJob(jobId: string, decision: ReviewDecision): Promise<{ decided: number; skipped: number }> {
  const { data } = await apiClient.post<{ decided: number; skipped: number }>(PATHS.aiImportJobDecision(jobId), { decision })
  return data
}

export async function getMassUploadJobs(type?: 'ai_import'): Promise<MassUploadJob[]> {
  const { data } = await apiClient.get<{ jobs?: Array<Record<string, unknown>> }>(PATHS.massUploadJobs, {
    params: type ? { type } : undefined,
  })
  return (data.jobs ?? []).map((j) => ({
    id: String(j.id ?? ''),
    fileName: String(j.file_name ?? ''),
    status: (j.status as MassUploadJob['status']) ?? 'pending',
    total: Number(j.total ?? 0),
    createdCount: Number(j.created_count ?? 0),
    failedCount: Number(j.failed_count ?? 0),
    errors: Array.isArray(j.errors) ? (j.errors as MassUploadJob['errors']) : [],
    createdAt: String(j.created_at ?? ''),
  }))
}

// ── Backward-compat stubs ─────────────────────────────────────────────────────
// [PENDING BACKEND] boost — out-of-scope for MVP
export async function boostProduct(id: string): Promise<void> {
  await apiClient.post(PATHS.boost(id))
}

// saveProductAsDelisted — delist via real status patch
export async function saveProductAsDelisted(input: unknown): Promise<void> {
  const id = typeof input === 'string'
    ? input
    : (input as Record<string, unknown>)?.['id'] as string | undefined
  if (!id) return
  await apiClient.patch(PATHS.sellerProductStatus(id), { status: 'delisted' })
}

// ── Categories ────────────────────────────────────────────────────────────────
// ✅ Real route: GET /catalog/categories
export interface CategoryListResponse {
  categories: BackendCategory[]
}

export async function getCategories(): Promise<CategoryListResponse> {
  const { data } = await apiClient.get<BackendCategoriesResponse>(PATHS.categories)
  return data
}

// ── Category taxonomy tree (real route: GET /catalog/category-tree) ────────────
// Flat, ordered list of the whole taxonomy (≤5 levels). Clients build the nested
// drill-down + breadcrumb from parent_id/level. Only is_leaf nodes accept products.
export interface CategoryNode {
  id: string
  parent_id: string | null
  level: number
  name: BackendLangMap
  slug: string
  is_leaf: boolean
  listing_policy: string
  position: number
  code: string
  requires_size_chart?: boolean
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const { data } = await apiClient.get<{ categories: CategoryNode[] }>(PATHS.categoryTree)
  return data.categories ?? []
}

// Pick the best label for a multi-lang category name (current lang → en → ru → uz → any).
export function categoryName(name: BackendLangMap | undefined, lang?: Language): string {
  if (!name) return ''
  const l = lang ?? currentLang()
  return name[l] || name.en || name.ru || name.uz || Object.values(name)[0] || ''
}

// ── Image upload ──────────────────────────────────────────────────────────────
// ✅ Real route: POST /media/upload-url → {key, upload_url, public_url}
export interface UploadUrlResponse {
  key: string
  upload_url: string
  public_url: string
}

export async function getUploadUrl(contentType: string, kind: 'product' | 'video' = 'product'): Promise<UploadUrlResponse> {
  const { data } = await apiClient.post<UploadUrlResponse>(PATHS.mediaUploadUrl, {
    content_type: contentType,
    kind,
  })
  return data
}

// Presign + PUT a file to R2, returning its public URL. Used by the product form
// for product images, the promotion image, and the product video.
export async function uploadProductFile(file: File, kind: 'product' | 'video' = 'product'): Promise<string> {
  const { upload_url, public_url } = await getUploadUrl(file.type, kind)
  await uploadFileToPut(upload_url, file)
  return public_url
}

// Upload binary directly to R2 presigned URL (no auth header — direct PUT)
export async function uploadFileToPut(uploadUrl: string, file: File): Promise<void> {
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
}
