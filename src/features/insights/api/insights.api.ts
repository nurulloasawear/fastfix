// All insights endpoints are REAL — backed by GET /sellers/me/insights/...
// GET /sellers/me/stats remains for the stats DTO type reference only (unused in routing).
import { apiClient } from '@/lib/axios'
import type {
  OverviewData,
  ChannelCard,
  TrafficSourceRow,
  ProductRankRow,
  ProductOverviewData,
  FunnelStageMetrics,
  ProductTrafficData,
  ProductPerformanceRow,
  DiagnosisCount,
  DiagnosisProductRow,
  DiagnosisIssue,
  SalesOverviewData,
  CategoryCompositionRow,
  PriceRangeRow,
  BuyerTypeRow,
  ChatOverviewData,
  TrafficOverviewData,
  TrafficStats,
  TrendPoint,
  MarketingKpis,
  PromoRow,
  VoucherKpis,
  VoucherRow,
  ShippingPromoKpis,
  ShippingPromoRow,
  LivestreamOverview,
  LivestreamBarPoint,
  LivestreamRow,
  StreamDealKpis,
  ExternalTrafficOverview,
  CampaignRow,
  ExternalProductRow,
} from '../types/insights.types'

export const PATHS = {
  // ✅ Kept for backwards-compat; no longer used to drive Overview (see below).
  stats: '/sellers/me/stats',
  // ✅ All real routes — repointed from mock /insights/... to /sellers/me/insights/...
  overview: '/sellers/me/insights/overview',
  productOverview: '/sellers/me/insights/product/overview',
  productTraffic: '/sellers/me/insights/product/traffic',
  productPerformance: '/sellers/me/insights/product/performance',
  productDiagnosis: '/sellers/me/insights/product/diagnosis',
  salesOverview: '/sellers/me/insights/sales/overview',
  salesComposition: '/sellers/me/insights/sales/composition',
  servicesChat: '/sellers/me/insights/services/chat',
  trafficOverview: '/sellers/me/insights/traffic/overview',
  marketingDiscount: '/sellers/me/insights/marketing/discount',
  marketingVoucher: '/sellers/me/insights/marketing/voucher',
  marketingShippingPromo: '/sellers/me/insights/marketing/shipping-promo',
  marketingLivestream: '/sellers/me/insights/marketing/livestream',
  marketingStreamDeal: '/sellers/me/insights/marketing/stream-deal',
  marketingExternalTraffic: '/sellers/me/insights/marketing/external-traffic',
} as const

// ── Shared helpers ────────────────────────────────────────────────────────────

// BE {value, delta_pct} → FE KpiMetric (add a display label + optional flags).
function kpi(
  raw: { value: number | null; delta_pct: number | null } | undefined,
  label: string,
  opts?: { isMonetary?: boolean; isPercent?: boolean },
) {
  return {
    value: raw?.value ?? 0,
    delta: raw?.delta_pct ?? 0,
    label,
    ...opts,
  }
}

// Format seconds → "HH:MM:SS" string; null → '--:--:--'
function fmtSecs(secs: number | null | undefined): string {
  if (secs == null) return '--:--:--'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

// BE channel_breakdown row → FE ChannelCard (pick English name as display name)
interface BEChannel {
  id: string
  name_en: string
  sales_uzs: number
  delta_pct: number
  share_pct: number
}

function mapChannel(c: BEChannel): ChannelCard {
  return {
    id: c.id,
    name: c.name_en,
    salesUzs: c.sales_uzs,
    deltaPct: c.delta_pct,
    percentage: c.share_pct,
  }
}

// BE traffic_source row → FE TrafficSourceRow
interface BETrafficSource {
  source: string
  sales_ratio_pct: number
  sales_uzs: number
  sales_delta_pct: number
  impressions: number
  clicks: number
  orders: number
  units: number
  ctr_pct: number
  conv_rate_pct: number
}

function mapTrafficSource(r: BETrafficSource): TrafficSourceRow {
  return {
    source: r.source,
    salesRatioPct: r.sales_ratio_pct,
    salesUzs: r.sales_uzs,
    salesDeltaPct: r.sales_delta_pct,
    impressions: r.impressions,
    clicks: r.clicks,
    orders: r.orders,
    units: r.units,
    ctrPct: r.ctr_pct,
    convRatePct: r.conv_rate_pct,
  }
}

// BE top_products row → FE ProductRankRow
interface BEProductRank {
  rank: number
  product_id: string
  title: { uz: string; ru: string; en: string }
  image_url: string
  impressions: number
  clicks: number
  ctr_pct: number
  conv_rate_pct: number
  orders: number
  units: number
  buyers: number
}

function mapProductRank(p: BEProductRank): ProductRankRow {
  return {
    rank: p.rank,
    productId: p.product_id,
    name: p.title?.en || p.title?.uz || '',
    thumb: p.image_url,
    impressions: p.impressions,
    clicks: p.clicks,
    ctrPct: p.ctr_pct,
    convRatePct: p.conv_rate_pct,
    orders: p.orders,
    units: p.units,
    buyers: p.buyers,
  }
}

// BE trend row (overview/product) → FE TrendPoint
function mapTrendPoint(
  raw: Record<string, string | number>,
  labelKey = 'label',
  valueKeys: string[],
): TrendPoint {
  const values: Record<string, number> = {}
  for (const k of valueKeys) {
    values[k] = (raw[k] as number) ?? 0
  }
  return { label: String(raw[labelKey] ?? ''), values }
}

// ── Overview ─────────────────────────────────────────────────────────────────

interface OverviewDto {
  kpis: {
    sales_uzs: { value: number; delta_pct: number }
    sales_with_rebate_uzs: { value: number; delta_pct: number }
    orders: { value: number; delta_pct: number }
    order_conv_rate_pct: { value: number; delta_pct: number }
  }
  realtime: {
    sales_today_uzs: number
    units: number
    product_orders: number
    orders: number
    conv_rate_pct: number
  }
  trend: Array<{ label: string; sales_uzs: number; visitors: number; orders: number }>
  channel_breakdown: BEChannel[]
  traffic_sources: BETrafficSource[]
  top_products: BEProductRank[]
}

function mapOverview(dto: OverviewDto): OverviewData {
  return {
    kpis: {
      sales: kpi(dto.kpis.sales_uzs, 'Sales', { isMonetary: true }),
      salesWithRebate: kpi(dto.kpis.sales_with_rebate_uzs, 'Sales (Collected)', { isMonetary: true }),
      orders: kpi(dto.kpis.orders, 'Orders'),
      convRate: kpi(dto.kpis.order_conv_rate_pct, 'Conv Rate', { isPercent: true }),
    },
    realtime: {
      salesToday: dto.realtime.sales_today_uzs,
      units: dto.realtime.units,
      productOrders: dto.realtime.product_orders,
      orders: dto.realtime.orders,
      convRate: dto.realtime.conv_rate_pct,
    },
    trend: (dto.trend ?? []).map((p) =>
      mapTrendPoint(p as Record<string, string | number>, 'label', ['sales_uzs', 'visitors', 'orders']),
    ),
    channelBreakdown: (dto.channel_breakdown ?? []).map(mapChannel),
    trafficSources: (dto.traffic_sources ?? []).map(mapTrafficSource),
    topProducts: (dto.top_products ?? []).map(mapProductRank),
  }
}

export async function getOverview(): Promise<OverviewData> {
  const res = await apiClient.get<OverviewDto>(PATHS.overview)
  return mapOverview(res.data)
}

// ── Product Overview ──────────────────────────────────────────────────────────

interface BEKpiItem {
  value: number
  delta_pct: number
}

interface BEFunnelStage {
  visitors?: BEKpiItem
  page_views?: BEKpiItem
  items_visited?: BEKpiItem
  bounce_visitors?: BEKpiItem
  bounce_rate_pct?: BEKpiItem
  search_clicks?: BEKpiItem
  liked?: BEKpiItem
  units?: BEKpiItem
  conv_rate_pct?: BEKpiItem
  buyers?: BEKpiItem
  items_placed?: BEKpiItem
  items_paid?: BEKpiItem
  sales_uzs?: BEKpiItem
  orders?: BEKpiItem
}

function mapFunnelStage(stage: BEFunnelStage): FunnelStageMetrics {
  return {
    visitors: stage.visitors ? kpi(stage.visitors, 'Visitors') : undefined,
    pageViews: stage.page_views ? kpi(stage.page_views, 'Page Views') : undefined,
    itemsVisited: stage.items_visited ? kpi(stage.items_visited, 'Items Visited') : undefined,
    bounceVisitors: stage.bounce_visitors ? kpi(stage.bounce_visitors, 'Bounce Visitors') : undefined,
    bounceRate: stage.bounce_rate_pct ? kpi(stage.bounce_rate_pct, 'Bounce Rate', { isPercent: true }) : undefined,
    searchClicks: stage.search_clicks ? kpi(stage.search_clicks, 'Search Clicks') : undefined,
    liked: stage.liked ? kpi(stage.liked, 'Liked') : undefined,
    units: stage.units ? kpi(stage.units, 'Units') : undefined,
    convRate: stage.conv_rate_pct ? kpi(stage.conv_rate_pct, 'Conv Rate', { isPercent: true }) : undefined,
    buyers: stage.buyers ? kpi(stage.buyers, 'Buyers') : undefined,
    // placed uses items_placed, paid uses items_paid — both map to the FE 'items' field
    items: (stage.items_placed ?? stage.items_paid)
      ? kpi(stage.items_placed ?? stage.items_paid, 'Items')
      : undefined,
    salesUzs: stage.sales_uzs ? kpi(stage.sales_uzs, 'Sales', { isMonetary: true }) : undefined,
    orders: stage.orders ? kpi(stage.orders, 'Orders') : undefined,
  }
}

interface ProductOverviewDto {
  visit: BEFunnelStage
  add_to_cart: BEFunnelStage
  placed_order: BEFunnelStage
  paid_order: BEFunnelStage
  trend: Array<Record<string, string | number>>
  rankings: BEProductRank[]
}

function mapProductOverview(dto: ProductOverviewDto): ProductOverviewData {
  return {
    visit: mapFunnelStage(dto.visit ?? {}),
    addToCart: mapFunnelStage(dto.add_to_cart ?? {}),
    placedOrder: mapFunnelStage(dto.placed_order ?? {}),
    paidOrder: mapFunnelStage(dto.paid_order ?? {}),
    trend: (dto.trend ?? []).map((p) =>
      mapTrendPoint(p, 'label', ['visitors', 'page_views', 'atc_units', 'placed_sales_uzs', 'paid_sales_uzs']),
    ),
    rankings: (dto.rankings ?? []).map(mapProductRank),
  }
}

export async function getProductOverview(): Promise<ProductOverviewData> {
  const res = await apiClient.get<ProductOverviewDto>(PATHS.productOverview)
  return mapProductOverview(res.data)
}

// ── Product Traffic ───────────────────────────────────────────────────────────

interface ProductTrafficDto {
  channel_breakdown: BEChannel[]
  traffic_sources: BETrafficSource[]
}

function mapProductTraffic(dto: ProductTrafficDto): ProductTrafficData {
  return {
    channelBreakdown: (dto.channel_breakdown ?? []).map(mapChannel),
    trafficSources: (dto.traffic_sources ?? []).map(mapTrafficSource),
  }
}

export async function getProductTraffic(): Promise<ProductTrafficData> {
  const res = await apiClient.get<ProductTrafficDto>(PATHS.productTraffic)
  return mapProductTraffic(res.data)
}

// ── Product Performance ───────────────────────────────────────────────────────

interface ProductPerformanceDto {
  total: number
  rows: Array<{
    product_id: string
    title: { uz: string; ru: string; en: string }
    image_url: string
    category_id: string
    sales_uzs: number
    impressions: number
    clicks: number
    ctr_pct: number
    conv_rate_pct: number
    orders: number
    units: number
    buyers: number
    bounce_rate_pct: number
    liked: number
    atc_units: number
    listing_date: string
  }>
}

function mapPerformanceRow(r: ProductPerformanceDto['rows'][number]): ProductPerformanceRow {
  return {
    productId: r.product_id,
    name: r.title?.en || r.title?.uz || '',
    thumb: r.image_url,
    salesUzs: r.sales_uzs,
    impressions: r.impressions,
    clicks: r.clicks,
    ctrPct: r.ctr_pct,
    convRatePct: r.conv_rate_pct,
    orders: r.orders,
    units: r.units,
  }
}

export async function getProductPerformance(): Promise<ProductPerformanceRow[]> {
  const res = await apiClient.get<ProductPerformanceDto>(PATHS.productPerformance)
  return (res.data.rows ?? []).map(mapPerformanceRow)
}

// ── Product Diagnosis ─────────────────────────────────────────────────────────

interface DiagnosisDto {
  counts: DiagnosisCount[]
  active_issue: DiagnosisIssue
  definition: { uz: string; ru: string; en: string }
  tips: Array<{ uz: string; ru: string; en: string }>
  products: Array<{
    product_id: string
    title: { uz: string; ru: string; en: string }
    image_url: string
    sales_prior_uzs: number
    sales_recent_uzs: number
    issue: DiagnosisIssue
  }>
}

export async function getProductDiagnosis(date: string): Promise<{
  counts: DiagnosisCount[]
  products: DiagnosisProductRow[]
  activeIssue: DiagnosisIssue
}> {
  const res = await apiClient.get<DiagnosisDto>(PATHS.productDiagnosis, { params: { date } })
  const dto = res.data
  return {
    counts: dto.counts ?? [],
    activeIssue: dto.active_issue ?? 'decrease_sales',
    products: (dto.products ?? []).map((p) => ({
      productId: p.product_id,
      name: p.title?.en || p.title?.uz || '',
      thumb: p.image_url,
      salesPrior: p.sales_prior_uzs ?? 0,
      salesRecent: p.sales_recent_uzs ?? 0,
    })),
  }
}

// ── Sales Overview ────────────────────────────────────────────────────────────

interface SalesOverviewDto {
  visitors: BEKpiItem
  placed_buyers: BEKpiItem
  placed_sales_uzs: BEKpiItem
  paid_buyers: BEKpiItem
  paid_sales_uzs: BEKpiItem
  sales_per_buyer_uzs: BEKpiItem
  conv_visit_to_placed_pct: number
  conv_placed_to_paid_pct: number
  trend: Array<Record<string, string | number>>
}

function mapSalesOverview(dto: SalesOverviewDto): SalesOverviewData {
  return {
    visitors: kpi(dto.visitors, 'Visitors'),
    placedBuyers: kpi(dto.placed_buyers, 'Placed Buyers'),
    placedSales: kpi(dto.placed_sales_uzs, 'Placed Sales', { isMonetary: true }),
    paidBuyers: kpi(dto.paid_buyers, 'Paid Buyers'),
    paidSales: kpi(dto.paid_sales_uzs, 'Paid Sales', { isMonetary: true }),
    salesPerBuyer: kpi(dto.sales_per_buyer_uzs, 'Sales / Buyer', { isMonetary: true }),
    convVisitToPlaced: dto.conv_visit_to_placed_pct ?? 0,
    convPlacedToPaid: dto.conv_placed_to_paid_pct ?? 0,
    trend: (dto.trend ?? []).map((p) =>
      mapTrendPoint(p, 'label', ['visitors', 'placed_buyers', 'placed_orders', 'placed_sales_uzs', 'paid_buyers', 'paid_orders', 'paid_sales_uzs']),
    ),
  }
}

export async function getSalesOverview(): Promise<SalesOverviewData> {
  const res = await apiClient.get<SalesOverviewDto>(PATHS.salesOverview)
  return mapSalesOverview(res.data)
}

// ── Sales Composition ─────────────────────────────────────────────────────────

interface SalesCompositionDto {
  category_tabs: Array<{ id: string; name: { uz: string; ru: string; en: string }; total_sales_uzs: number }>
  active_category_id: string
  category_rows: Array<{
    sub_category_id: string
    name: { uz: string; ru: string; en: string }
    sales_uzs: number
    sales_pct: number
    buyers: number
    conv_rate_pct: number
  }>
  price_range_rows: Array<{
    range_label: string
    range_min_uzs: number
    range_max_uzs: number | null
    buyers: number
    buyers_pct: number
    sales_uzs: number
    conv_rate_pct: number
  }>
  buyer_type_rows: Array<{
    type: 'new' | 'existing'
    buyers: number
    buyers_pct: number
    sales_uzs: number
    sales_pct: number
    conv_rate_pct: number
  }>
}

export async function getSalesComposition(): Promise<{
  categoryTabs: string[]
  activeCategory: string
  totalSales: number
  categoryRows: CategoryCompositionRow[]
  priceRangeRows: PriceRangeRow[]
  buyerTypeRows: BuyerTypeRow[]
}> {
  const res = await apiClient.get<SalesCompositionDto>(PATHS.salesComposition)
  const dto = res.data
  return {
    // BE returns category_tabs as objects; extract English name for display (or id as fallback)
    categoryTabs: (dto.category_tabs ?? []).map((t) => t.name?.en || t.id || ''),
    activeCategory: dto.active_category_id ?? '',
    totalSales: (dto.category_tabs ?? []).reduce((sum, t) => sum + (t.total_sales_uzs ?? 0), 0),
    categoryRows: (dto.category_rows ?? []).map((r): CategoryCompositionRow => ({
      subCategory: r.name?.en || r.sub_category_id || '',
      salesUzs: r.sales_uzs,
      salesPct: r.sales_pct,
      buyers: r.buyers,
      convRate: r.conv_rate_pct,
    })),
    priceRangeRows: (dto.price_range_rows ?? []).map((r): PriceRangeRow => ({
      range: r.range_label,
      buyers: r.buyers,
      buyersPct: r.buyers_pct,
      salesUzs: r.sales_uzs,
      convRate: r.conv_rate_pct,
    })),
    buyerTypeRows: (dto.buyer_type_rows ?? []).map((r): BuyerTypeRow => ({
      type: r.type,
      buyers: r.buyers,
      buyersPct: r.buyers_pct,
      salesUzs: r.sales_uzs,
      salesPct: r.sales_pct,
      convRate: r.conv_rate_pct,
    })),
  }
}

// ── Services / Chat ───────────────────────────────────────────────────────────

interface ChatDto {
  visitors: BEKpiItem
  chat_enquired: BEKpiItem
  visitors_enquired: BEKpiItem
  responded_chats: BEKpiItem
  non_responded_chats: BEKpiItem
  avg_response_time_secs: number | null
  csat_pct: { value: number | null; delta_pct: number | null }
  default_pct: { value: number | null; delta_pct: number | null }
  buyers: BEKpiItem
  orders: BEKpiItem
  units: BEKpiItem
  sales_uzs: BEKpiItem
  conv_rate_pct: BEKpiItem
  trend: Array<{ date: string; visitors: number; chat_enquired: number; responded: number; conv_rate_pct: number }>
  non_responded_list: Array<{ conversation_id: string; sender_name: string; last_at: string; last_body: string }>
  responded_list: Array<{ conversation_id: string; sender_name: string; last_at: string; body: string }>
}

function mapChatOverview(dto: ChatDto): ChatOverviewData {
  return {
    visitors: kpi(dto.visitors, 'Visitors'),
    chatEnquired: kpi(dto.chat_enquired, 'Chat Enquired'),
    visitorsEnquired: kpi(dto.visitors_enquired, 'Visitors Enquired'),
    respondedChats: kpi(dto.responded_chats, 'Responded Chats'),
    nonRespondedChats: kpi(dto.non_responded_chats, 'Non-Responded'),
    avgResponseTime: fmtSecs(dto.avg_response_time_secs),
    csatPct: kpi(
      { value: dto.csat_pct?.value ?? 0, delta_pct: dto.csat_pct?.delta_pct ?? 0 },
      'CSAT',
      { isPercent: true },
    ),
    defaultPct: kpi(
      { value: dto.default_pct?.value ?? 0, delta_pct: dto.default_pct?.delta_pct ?? 0 },
      'Default %',
      { isPercent: true },
    ),
    buyers: kpi(dto.buyers, 'Buyers'),
    orders: kpi(dto.orders, 'Orders'),
    units: kpi(dto.units, 'Units'),
    salesUzs: kpi(dto.sales_uzs, 'Sales', { isMonetary: true }),
    convRate: kpi(dto.conv_rate_pct, 'Conv Rate', { isPercent: true }),
    trend: (dto.trend ?? []).map((p) =>
      mapTrendPoint(
        { label: p.date, visitors: p.visitors, chat_enquired: p.chat_enquired, responded: p.responded, conv_rate_pct: p.conv_rate_pct },
        'label',
        ['visitors', 'chat_enquired', 'responded', 'conv_rate_pct'],
      ),
    ),
  }
}

export async function getChatOverview(): Promise<ChatOverviewData> {
  const res = await apiClient.get<ChatDto>(PATHS.servicesChat)
  return mapChatOverview(res.data)
}

// ── Traffic Overview ──────────────────────────────────────────────────────────

interface BETrafficStats {
  page_views: BEKpiItem
  avg_page_views: BEKpiItem
  avg_time_spent_secs: number
  avg_time_spent_delta_pct: number
  bounce_rate_pct: BEKpiItem
  visitors: BEKpiItem
  new_visitors: BEKpiItem
  existing_visitors: BEKpiItem
  new_followers: BEKpiItem
}

interface TrafficOverviewDto {
  all: BETrafficStats
  app: BETrafficStats
  web: BETrafficStats
  trend: Array<{ label: string; page_views: number; visitors: number }>
}

function mapTrafficStats(s: BETrafficStats): TrafficStats {
  return {
    pageViews: kpi(s.page_views, 'Page Views'),
    avgPageViews: kpi(s.avg_page_views, 'Avg Page Views'),
    avgTimeSpent: fmtSecs(s.avg_time_spent_secs),
    avgTimeSpentDelta: s.avg_time_spent_delta_pct ?? 0,
    bounceRate: kpi(s.bounce_rate_pct, 'Bounce Rate', { isPercent: true }),
    visitors: kpi(s.visitors, 'Visitors'),
    newVisitors: kpi(s.new_visitors, 'New Visitors'),
    existingVisitors: kpi(s.existing_visitors, 'Existing Visitors'),
    newFollowers: kpi(s.new_followers, 'New Followers'),
  }
}

function mapTrafficOverview(dto: TrafficOverviewDto): TrafficOverviewData {
  return {
    all: mapTrafficStats(dto.all),
    app: mapTrafficStats(dto.app),
    web: mapTrafficStats(dto.web),
    trend: (dto.trend ?? []).map((p) =>
      mapTrendPoint(p as Record<string, string | number>, 'label', ['page_views', 'visitors']),
    ),
  }
}

export async function getTrafficOverview(): Promise<TrafficOverviewData> {
  const res = await apiClient.get<TrafficOverviewDto>(PATHS.trafficOverview)
  return mapTrafficOverview(res.data)
}

// ── Marketing: Discount ───────────────────────────────────────────────────────

interface MarketingDiscountDto {
  kpis: {
    sales_uzs: BEKpiItem
    orders: BEKpiItem
    units_sold: BEKpiItem
    buyers: BEKpiItem
    sales_per_buyer_uzs: BEKpiItem
  }
  trend: Array<{ label: string; sales_uzs: number; orders: number }>
  promos: Array<{
    id: string
    name: { uz: string; ru: string; en: string }
    promo_type: string
    starts_at: string
    ends_at: string
    status: 'active' | 'scheduled' | 'ended'
    sales_uzs: number
    orders: number
    units_sold: number
    buyers: number
    sales_per_buyer_uzs: number
  }>
}

function mapMarketingKpis(kpis: MarketingDiscountDto['kpis']): MarketingKpis {
  return {
    sales: kpi(kpis.sales_uzs, 'Sales', { isMonetary: true }),
    orders: kpi(kpis.orders, 'Orders'),
    units: kpi(kpis.units_sold, 'Units'),
    buyers: kpi(kpis.buyers, 'Buyers'),
    salesPerBuyer: kpi(kpis.sales_per_buyer_uzs, 'Sales / Buyer', { isMonetary: true }),
  }
}

function mapPromoRow(p: MarketingDiscountDto['promos'][number]): PromoRow {
  return {
    id: p.id,
    name: p.name?.en || p.name?.uz || '',
    type: p.promo_type,
    periodFrom: p.starts_at,
    periodTo: p.ends_at,
    salesUzs: p.sales_uzs,
    orders: p.orders,
    units: p.units_sold,
    buyers: p.buyers,
    salesPerBuyer: p.sales_per_buyer_uzs,
    status: p.status,
  }
}

export async function getMarketingDiscount(): Promise<{ kpis: MarketingKpis; trend: unknown[]; promos: PromoRow[] }> {
  const res = await apiClient.get<MarketingDiscountDto>(PATHS.marketingDiscount)
  const dto = res.data
  return {
    kpis: mapMarketingKpis(dto.kpis),
    trend: dto.trend ?? [],
    promos: (dto.promos ?? []).map(mapPromoRow),
  }
}

// ── Marketing: Voucher ────────────────────────────────────────────────────────

interface MarketingVoucherDto {
  kpis: {
    sales_uzs: BEKpiItem
    claims: BEKpiItem
    orders: BEKpiItem
    usage_rate_pct: BEKpiItem
    buyers: BEKpiItem
  }
  trend: Array<{ label: string; sales_uzs: number; claims: number }>
  vouchers: Array<{
    id: string
    name: { uz: string; ru: string; en: string }
    voucher_type: string
    reward_type: string
    claim_starts_at: string
    claim_ends_at: string
    status: 'active' | 'scheduled' | 'ended'
    claims: number
    orders: number
    usage_rate_pct: number
    sales_uzs: number
    cost_uzs: number
    units_sold: number
    buyers: number
  }>
}

export async function getMarketingVoucher(): Promise<{ kpis: VoucherKpis; trend: unknown[]; vouchers: VoucherRow[] }> {
  const res = await apiClient.get<MarketingVoucherDto>(PATHS.marketingVoucher)
  const dto = res.data
  return {
    kpis: {
      sales: kpi(dto.kpis.sales_uzs, 'Sales', { isMonetary: true }),
      claims: kpi(dto.kpis.claims, 'Claims'),
      orders: kpi(dto.kpis.orders, 'Orders'),
      usageRate: kpi(dto.kpis.usage_rate_pct, 'Usage Rate', { isPercent: true }),
      buyers: kpi(dto.kpis.buyers, 'Buyers'),
    },
    trend: dto.trend ?? [],
    vouchers: (dto.vouchers ?? []).map((v): VoucherRow => ({
      id: v.id,
      name: v.name?.en || v.name?.uz || '',
      claimFrom: v.claim_starts_at,
      claimTo: v.claim_ends_at,
      claims: v.claims,
      orders: v.orders,
      usageRatePct: v.usage_rate_pct,
      salesUzs: v.sales_uzs,
      costUzs: v.cost_uzs,
      units: v.units_sold,
      buyers: v.buyers,
      status: v.status,
    })),
  }
}

// ── Marketing: Shipping Promo ─────────────────────────────────────────────────

interface MarketingShippingPromoDto {
  kpis: {
    sales_uzs: BEKpiItem
    orders: BEKpiItem
    buyers: BEKpiItem
    sales_per_buyer_uzs: BEKpiItem
    shipping_cost_uzs: BEKpiItem
  }
  trend: Array<{ label: string; sales_uzs: number; orders: number }>
  promos: Array<{
    id: string
    name: { uz: string; ru: string; en: string }
    starts_at: string
    ends_at: string
    rule_text: { uz: string; ru: string; en: string }
    budget_uzs: number
    status: 'active' | 'scheduled' | 'ended'
    sales_uzs: number
    orders: number
    buyers: number
    sales_per_buyer_uzs: number
    shipping_cost_uzs: number
  }>
}

export async function getMarketingShippingPromo(): Promise<{
  kpis: ShippingPromoKpis
  trend: unknown[]
  promos: ShippingPromoRow[]
}> {
  const res = await apiClient.get<MarketingShippingPromoDto>(PATHS.marketingShippingPromo)
  const dto = res.data
  return {
    kpis: {
      sales: kpi(dto.kpis.sales_uzs, 'Sales', { isMonetary: true }),
      orders: kpi(dto.kpis.orders, 'Orders'),
      buyers: kpi(dto.kpis.buyers, 'Buyers'),
      salesPerBuyer: kpi(dto.kpis.sales_per_buyer_uzs, 'Sales / Buyer', { isMonetary: true }),
      shippingCost: kpi(dto.kpis.shipping_cost_uzs, 'Shipping Cost', { isMonetary: true }),
    },
    trend: dto.trend ?? [],
    promos: (dto.promos ?? []).map((p): ShippingPromoRow => ({
      id: p.id,
      name: p.name?.en || p.name?.uz || '',
      from: p.starts_at,
      to: p.ends_at,
      rule: p.rule_text?.en || p.rule_text?.uz || '',
      budgetUzs: p.budget_uzs,
      salesUzs: p.sales_uzs,
      orders: p.orders,
      buyers: p.buyers,
      salesPerBuyer: p.sales_per_buyer_uzs,
      shippingCostUzs: p.shipping_cost_uzs,
      status: p.status,
    })),
  }
}

// ── Marketing: Livestream ─────────────────────────────────────────────────────

interface MarketingLivestreamDto {
  overview: {
    total_produced: number
    unique_viewers: number
    peak_viewers: number
    avg_watch_time_secs: number
    orders: number
    sales_uzs: number
    comments: number
    product_tap_through: number
    new_followers: number
  }
  bar_chart: Array<{ date: string; stream_count: number; viewers: number }>
  streams: Array<{
    stream_id: string
    title: string
    thumbnail_url: string
    started_at: string
    ended_at: string
    unique_viewers: number
    peak_viewers: number
    avg_watch_time_secs: number
    guided_orders: number
    guided_sales_uzs: number
    comments: number
    product_tap_rate_pct: number
    conv_rate_pct: number
    revenue_per_viewer_uzs: number
  }>
}

export async function getMarketingLivestream(): Promise<{
  overview: LivestreamOverview
  barChart: LivestreamBarPoint[]
  streams: LivestreamRow[]
}> {
  const res = await apiClient.get<MarketingLivestreamDto>(PATHS.marketingLivestream)
  const dto = res.data
  return {
    overview: {
      totalProduced: dto.overview.total_produced,
      uniqueViewers: dto.overview.unique_viewers,
      peakViewers: dto.overview.peak_viewers,
      avgWatchTime: fmtSecs(dto.overview.avg_watch_time_secs),
      orders: dto.overview.orders,
      salesUzs: dto.overview.sales_uzs,
    },
    barChart: (dto.bar_chart ?? []).map((p): LivestreamBarPoint => ({
      date: p.date,
      count: p.stream_count,
    })),
    streams: (dto.streams ?? []).map((s): LivestreamRow => ({
      id: s.stream_id,
      title: s.title,
      thumb: s.thumbnail_url,
      datetime: s.started_at,
      uniqueViewers: s.unique_viewers,
      peakViewers: s.peak_viewers,
      avgWatchTime: fmtSecs(s.avg_watch_time_secs),
      guidedOrders: s.guided_orders,
      guidedSalesUzs: s.guided_sales_uzs,
    })),
  }
}

// ── Marketing: Stream Deal ────────────────────────────────────────────────────

interface MarketingStreamDealDto {
  kpis: {
    sales_uzs: BEKpiItem
    orders: BEKpiItem
    units_sold: BEKpiItem
    buyers: BEKpiItem
  }
  trend: Array<{ label: string; sales_uzs: number; orders: number }>
  promos: Array<{
    id: string
    name: { uz: string; ru: string; en: string }
    promo_type: string
    stream_id: string
    starts_at: string
    ends_at: string
    status: 'active' | 'scheduled' | 'ended'
    sales_uzs: number
    orders: number
    units_sold: number
    buyers: number
  }>
}

export async function getMarketingStreamDeal(): Promise<{
  kpis: StreamDealKpis
  trend: unknown[]
  promos: PromoRow[]
}> {
  const res = await apiClient.get<MarketingStreamDealDto>(PATHS.marketingStreamDeal)
  const dto = res.data
  return {
    kpis: {
      sales: kpi(dto.kpis.sales_uzs, 'Sales', { isMonetary: true }),
      orders: kpi(dto.kpis.orders, 'Orders'),
      units: kpi(dto.kpis.units_sold, 'Units'),
      buyers: kpi(dto.kpis.buyers, 'Buyers'),
    },
    trend: dto.trend ?? [],
    promos: (dto.promos ?? []).map((p): PromoRow => ({
      id: p.id,
      name: p.name?.en || p.name?.uz || '',
      type: p.promo_type,
      periodFrom: p.starts_at,
      periodTo: p.ends_at,
      salesUzs: p.sales_uzs,
      orders: p.orders,
      units: p.units_sold,
      buyers: p.buyers,
      salesPerBuyer: 0, // BE stream-deal promo doesn't return this field
      status: p.status,
    })),
  }
}

// ── Marketing: External Traffic ───────────────────────────────────────────────

interface MarketingExternalTrafficDto {
  overview: {
    visitors: BEKpiItem
    visits: BEKpiItem
    atc_items: BEKpiItem
    atc_value_uzs: BEKpiItem
    buyers: BEKpiItem
    units: BEKpiItem
    sales_uzs: BEKpiItem
    orders: BEKpiItem
    conv_visit_to_atc_pct: number
    conv_atc_to_buyers_pct: number
    conv_visitor_to_placed_pct: number
  }
  trend: Array<{ label: string; visitors: number; sales_uzs: number; orders: number }>
  campaigns: Array<{
    channel: string
    campaign_slug: string
    campaign_description: string
    users: number
    orders: number
    units: number
    visits: number
    visitors: number
    buyers: number
    new_buyers: number
    conv_visitor_to_placed_pct: number
    atc_items: number
  }>
  products: Array<{
    product_id: string
    title: { uz: string; ru: string; en: string }
    image_url: string
    channels: string[]
    atc_items: number
    units: number
    sales_uzs: number
  }>
}

export async function getMarketingExternalTraffic(): Promise<{
  overview: ExternalTrafficOverview
  campaigns: CampaignRow[]
  products: ExternalProductRow[]
}> {
  const res = await apiClient.get<MarketingExternalTrafficDto>(PATHS.marketingExternalTraffic)
  const dto = res.data
  const ov = dto.overview
  return {
    overview: {
      visitors: kpi(ov.visitors, 'Visitors'),
      visits: kpi(ov.visits, 'Visits'),
      addToCartItems: kpi(ov.atc_items, 'ATC Items'),
      addToCartValue: kpi(ov.atc_value_uzs, 'ATC Value', { isMonetary: true }),
      buyers: kpi(ov.buyers, 'Buyers'),
      units: kpi(ov.units, 'Units'),
      salesUzs: kpi(ov.sales_uzs, 'Sales', { isMonetary: true }),
      orders: kpi(ov.orders, 'Orders'),
      convVisitToATC: ov.conv_visit_to_atc_pct ?? 0,
      convATCToBuyers: ov.conv_atc_to_buyers_pct ?? 0,
      convVisitorToPlaced: ov.conv_visitor_to_placed_pct ?? 0,
      // trend is a sibling of overview in the BE response; embed it here for the FE type
      trend: (dto.trend ?? []).map((p) =>
        mapTrendPoint(p as Record<string, string | number>, 'label', ['visitors', 'sales_uzs', 'orders']),
      ),
    },
    campaigns: (dto.campaigns ?? []).map((c): CampaignRow => ({
      channel: c.channel,
      description: c.campaign_description,
      users: c.users,
      orders: c.orders,
      units: c.units,
      visits: c.visits,
      visitors: c.visitors,
      buyers: c.buyers,
      newBuyers: c.new_buyers,
      convRate: c.conv_visitor_to_placed_pct,
      addToCartItems: c.atc_items,
    })),
    products: (dto.products ?? []).map((p): ExternalProductRow => ({
      productId: p.product_id,
      name: p.title?.en || p.title?.uz || '',
      thumb: p.image_url,
      channels: (p.channels ?? []).join(', '),
      addToCartItems: p.atc_items,
      units: p.units,
      salesUzs: p.sales_uzs,
    })),
  }
}
