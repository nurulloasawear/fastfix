// Seller dashboard landing data. Two screens: a to-do list of actionable
// counts, and business insights (KPI cards + trend charts) split into tabs.
// Money is integer UZS end-to-end; counts are plain integers.

// To-do card kinds. Each maps to one actionable area of the shop.
export type TodoKind =
  | 'unpaid'
  | 'to_process'
  | 'processed'
  | 'pending_cancellation'
  | 'pending_return'
  | 'banned'
  | 'sold_out'
  | 'campaign'

export type TrendDirection = 'up' | 'down'

export const TODO_KINDS: TodoKind[] = [
  'unpaid',
  'to_process',
  'processed',
  'pending_cancellation',
  'pending_return',
  'banned',
  'sold_out',
  'campaign',
]

// `unpaid` carries a UZS amount; every other kind carries a unit count. The
// `amountUzs` variant lets the card format with formatUZS instead of a raw int.
export interface TodoItem {
  id: string
  kind: TodoKind
  count: number
  amountUzs?: number
  trendPct: number
  trendDirection: TrendDirection
}

export interface TodoListResponse {
  items: TodoItem[]
}

// Business-insights tabs. Dashboard + marketing share the metric-grid + chart
// layout; product + sales_services render grouped metric rows instead.
export type InsightTab = 'dashboard' | 'product' | 'sales_services' | 'marketing'

export const INSIGHT_TABS: InsightTab[] = ['dashboard', 'product', 'sales_services', 'marketing']

// A KPI tile. `amountUzs` → format as money; `percent` → format as `xx.xx%`;
// otherwise `count` is shown as a plain integer.
export interface InsightMetric {
  key: string
  count: number
  amountUzs?: number
  percent?: number
  trendPct: number | null
  highlighted: boolean
}

export interface InsightChartSeries {
  sales: number[]
  orders: number[]
  conversion: number[]
}

export interface InsightDashboard {
  metrics: InsightMetric[]
  chart: InsightChartSeries
}

// Grouped rows used by the product-overview and sales-services tabs. `titleKey`
// is an i18n key for the row heading ('' = no heading).
export interface InsightMetricRow {
  id: string
  titleKey: string
  metrics: InsightMetric[]
}

export interface BusinessInsightsResponse {
  dashboard: InsightDashboard
  marketing: InsightDashboard
  productOverview: InsightMetricRow[]
  salesServices: InsightMetricRow[]
}
