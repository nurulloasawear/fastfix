// [PENDING BACKEND] — all types; UUIDs are UUIDv7 strings

export type DataPeriodMode = 'realtime' | 'day' | 'month'
export type OrderTypeFilter = 'paid' | 'all'

export interface DataPeriod {
  mode: DataPeriodMode
  date?: string   // YYYY-MM-DD for day mode
  month?: string  // YYYY.MM for month mode
}

// ── Generic KPI ──────────────────────────────────────────────────────────────
export interface KpiMetric {
  value: number
  delta: number      // % vs prev period (null-safe: 0 means no change)
  label: string
  isMonetary?: boolean
  isPercent?: boolean
}

// ── Trend chart ──────────────────────────────────────────────────────────────
export interface TrendPoint {
  label: string  // hour "00:00" or date "2024-06-01"
  values: Record<string, number>
}

// ── Overview ─────────────────────────────────────────────────────────────────
export interface OverviewData {
  kpis: {
    sales: KpiMetric
    salesWithRebate: KpiMetric
    orders: KpiMetric
    convRate: KpiMetric
  }
  realtime: {
    salesToday: number
    units: number
    productOrders: number
    orders: number
    convRate: number
  }
  trend: TrendPoint[]
  channelBreakdown: ChannelCard[]
  trafficSources: TrafficSourceRow[]
  topProducts: ProductRankRow[]
}

export interface ChannelCard {
  id: string
  name: string
  salesUzs: number
  deltaPct: number
  percentage: number
}

export interface TrafficSourceRow {
  source: string
  salesRatioPct: number
  salesUzs: number
  salesDeltaPct: number
  impressions: number
  clicks: number
  orders: number
  units: number
  ctrPct: number
  convRatePct: number
}

export interface ProductRankRow {
  rank: number
  productId: string
  name: string
  thumb: string
  impressions: number
  clicks: number
  ctrPct: number
  convRatePct: number
  orders: number
  units: number
  buyers: number
}

// ── Product Overview ─────────────────────────────────────────────────────────
export interface ProductOverviewData {
  visit: FunnelStageMetrics
  addToCart: FunnelStageMetrics
  placedOrder: FunnelStageMetrics
  paidOrder: FunnelStageMetrics
  trend: TrendPoint[]
  rankings: ProductRankRow[]
}

export interface FunnelStageMetrics {
  visitors?: KpiMetric
  pageViews?: KpiMetric
  itemsVisited?: KpiMetric
  bounceVisitors?: KpiMetric
  bounceRate?: KpiMetric
  searchClicks?: KpiMetric
  liked?: KpiMetric
  units?: KpiMetric
  convRate?: KpiMetric
  buyers?: KpiMetric
  items?: KpiMetric
  salesUzs?: KpiMetric
  orders?: KpiMetric
}

// ── Product Traffic ──────────────────────────────────────────────────────────
export interface ProductTrafficData {
  channelBreakdown: ChannelCard[]
  trafficSources: TrafficSourceRow[]
}

// ── Product Performance ──────────────────────────────────────────────────────
export interface ProductPerformanceRow {
  productId: string
  name: string
  thumb: string
  salesUzs: number
  impressions: number
  clicks: number
  ctrPct: number
  convRatePct: number
  orders: number
  units: number
}

// ── Product Diagnosis ────────────────────────────────────────────────────────
export type DiagnosisIssue =
  | 'decrease_sales'
  | 'poor_reviews'
  | 'high_returns'
  | 'high_late_shipped'
  | 'high_cancellation'
  | 'poor_conversion'
  | 'decrease_views'

export interface DiagnosisCount {
  issue: DiagnosisIssue
  count: number
}

export interface DiagnosisProductRow {
  productId: string
  name: string
  thumb: string
  salesPrior: number
  salesRecent: number
}

// ── Sales Overview ────────────────────────────────────────────────────────────
export interface SalesOverviewData {
  visitors: KpiMetric
  placedBuyers: KpiMetric
  placedSales: KpiMetric
  paidBuyers: KpiMetric
  paidSales: KpiMetric
  salesPerBuyer: KpiMetric
  convVisitToPlaced: number
  convPlacedToPaid: number
  trend: TrendPoint[]
}

// ── Sales Composition ────────────────────────────────────────────────────────
export interface CategoryCompositionRow {
  subCategory: string
  salesUzs: number
  salesPct: number
  buyers: number
  convRate: number
}

export interface PriceRangeRow {
  range: string
  buyers: number
  buyersPct: number
  salesUzs: number
  convRate: number
}

export interface BuyerTypeRow {
  type: 'new' | 'existing'
  buyers: number
  buyersPct: number
  salesUzs: number
  salesPct: number
  convRate: number
}

// ── Services / Chat ───────────────────────────────────────────────────────────
export interface ChatOverviewData {
  visitors: KpiMetric
  chatEnquired: KpiMetric
  visitorsEnquired: KpiMetric
  respondedChats: KpiMetric
  nonRespondedChats: KpiMetric
  avgResponseTime: string
  csatPct: KpiMetric
  defaultPct: KpiMetric
  buyers: KpiMetric
  orders: KpiMetric
  units: KpiMetric
  salesUzs: KpiMetric
  convRate: KpiMetric
  trend: TrendPoint[]
}

// ── Traffic Overview ──────────────────────────────────────────────────────────
export interface TrafficOverviewData {
  all: TrafficStats
  app: TrafficStats
  web: TrafficStats
  trend: TrendPoint[]
}

export interface TrafficStats {
  pageViews: KpiMetric
  avgPageViews: KpiMetric
  avgTimeSpent: string
  avgTimeSpentDelta: number
  bounceRate: KpiMetric
  visitors: KpiMetric
  newVisitors: KpiMetric
  existingVisitors: KpiMetric
  newFollowers: KpiMetric
}

// ── Marketing: Discount ───────────────────────────────────────────────────────
export interface MarketingKpis {
  sales: KpiMetric
  orders: KpiMetric
  units: KpiMetric
  buyers: KpiMetric
  salesPerBuyer: KpiMetric
}

export interface PromoRow {
  id: string
  name: string
  type: string
  periodFrom: string
  periodTo: string
  salesUzs: number
  orders: number
  units: number
  buyers: number
  salesPerBuyer: number
  status: 'active' | 'scheduled' | 'ended'
}

// ── Marketing: Voucher ────────────────────────────────────────────────────────
export interface VoucherKpis {
  sales: KpiMetric
  claims: KpiMetric
  orders: KpiMetric
  usageRate: KpiMetric
  buyers: KpiMetric
}

export interface VoucherRow {
  id: string
  name: string
  claimFrom: string
  claimTo: string
  claims: number
  orders: number
  usageRatePct: number
  salesUzs: number
  costUzs: number
  units: number
  buyers: number
  status: 'active' | 'scheduled' | 'ended'
}

// ── Marketing: Shipping Promo ─────────────────────────────────────────────────
export interface ShippingPromoKpis {
  sales: KpiMetric
  orders: KpiMetric
  buyers: KpiMetric
  salesPerBuyer: KpiMetric
  shippingCost: KpiMetric
}

export interface ShippingPromoRow {
  id: string
  name: string
  from: string
  to: string
  rule: string
  budgetUzs: number
  salesUzs: number
  orders: number
  buyers: number
  salesPerBuyer: number
  shippingCostUzs: number
  status: 'active' | 'scheduled' | 'ended'
}

// ── Marketing: Livestream ─────────────────────────────────────────────────────
export interface LivestreamOverview {
  totalProduced: number
  uniqueViewers: number
  peakViewers: number
  avgWatchTime: string
  orders: number
  salesUzs: number
}

export interface LivestreamBarPoint {
  date: string
  count: number
}

export interface LivestreamRow {
  id: string
  title: string
  thumb: string
  datetime: string
  uniqueViewers: number
  peakViewers: number
  avgWatchTime: string
  guidedOrders: number
  guidedSalesUzs: number
}

// ── Marketing: Stream Deal ────────────────────────────────────────────────────
export interface StreamDealKpis {
  sales: KpiMetric
  orders: KpiMetric
  units: KpiMetric
  buyers: KpiMetric
}

// ── Marketing: External Traffic ───────────────────────────────────────────────
export interface ExternalTrafficOverview {
  visitors: KpiMetric
  visits: KpiMetric
  addToCartItems: KpiMetric
  addToCartValue: KpiMetric
  buyers: KpiMetric
  units: KpiMetric
  salesUzs: KpiMetric
  orders: KpiMetric
  convVisitToATC: number
  convATCToBuyers: number
  convVisitorToPlaced: number
  trend: TrendPoint[]
}

export interface CampaignRow {
  channel: string
  description: string
  users: number
  orders: number
  units: number
  visits: number
  visitors: number
  buyers: number
  newBuyers: number
  convRate: number
  addToCartItems: number
}

export interface ExternalProductRow {
  productId: string
  name: string
  thumb: string
  channels: string
  addToCartItems: number
  units: number
  salesUzs: number
}
