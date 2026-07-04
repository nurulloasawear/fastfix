// PUBLIC API of the insights feature. Pages import ONLY from here
// (`@/features/insights`) — never a deep path.

// ── Queries ───────────────────────────────────────────────────────────────────
export {
  insightsKeys,
  useInsightsOverview,
  useProductOverview,
  useProductTraffic,
  useProductPerformance,
  useProductDiagnosis,
  useSalesOverview,
  useSalesComposition,
  useChatOverview,
  useTrafficOverview,
  useMarketingDiscount,
  useMarketingVoucher,
  useMarketingShippingPromo,
  useMarketingLivestream,
  useMarketingStreamDeal,
  useMarketingExternalTraffic,
} from './api/insights.queries'

// ── Store ────────────────────────────────────────────────────────────────────
export { useInsightsUi } from './stores/insights.store'

// ── MSW handlers + i18n (must always be exported) ────────────────────────────
export { insightsHandlers } from './api/insights.mocks'
export { insightsMessages } from './i18n'

// ── Components ────────────────────────────────────────────────────────────────
export { InsightsTabs } from './components/InsightsTabs'
export { PromoBanner } from './components/PromoBanner'
export { DataPeriodBar } from './components/DataPeriodBar'
export { KpiCard } from './components/KpiCard'
export { TrendChart } from './components/TrendChart'
export { FunnelDiagram } from './components/FunnelDiagram'
export { InlineBarCell } from './components/InlineBarCell'
export { ChannelBreakdown } from './components/ChannelBreakdown'
export { TrafficSourcesTable } from './components/TrafficSourcesTable'
export { ProductSubTabs } from './components/ProductSubTabs'
export { MarketingSubTabs } from './components/MarketingSubTabs'
export { MarketingKpiRow } from './components/MarketingKpiRow'
export { MarketingDiscountTab } from './components/MarketingDiscountTab'
export { MarketingLivestreamTab } from './components/MarketingLivestreamTab'
export { ProductPerformanceTab } from './components/ProductPerformanceTab'
export { ProductDiagnosisTab } from './components/ProductDiagnosisTab'

// ── Types ────────────────────────────────────────────────────────────────────
export type {
  DataPeriodMode,
  OrderTypeFilter,
  DataPeriod,
  KpiMetric,
  TrendPoint,
  OverviewData,
  ChannelCard,
  TrafficSourceRow,
  ProductRankRow,
  ProductOverviewData,
  FunnelStageMetrics,
  ProductTrafficData,
  ProductPerformanceRow,
  DiagnosisIssue,
  DiagnosisCount,
  DiagnosisProductRow,
  SalesOverviewData,
  CategoryCompositionRow,
  PriceRangeRow,
  BuyerTypeRow,
  ChatOverviewData,
  TrafficOverviewData,
  TrafficStats,
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
} from './types/insights.types'
