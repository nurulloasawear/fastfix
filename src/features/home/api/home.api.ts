import { apiClient } from '@/lib/axios'
import type {
  BusinessInsightsResponse,
  InsightMetric,
  TodoItem,
  TodoListResponse,
} from '../types/home.types'

// ── Route paths ───────────────────────────────────────────────────────────────
// ✅ = real backend route   [PENDING BACKEND] = no endpoint yet, MSW only
const PATHS = {
  // ✅ Real: seller dashboard stats (headline totals + recent orders).
  // Drives both the to-do counts and the business-insights headline numbers.
  stats: '/sellers/me/stats',
} as const

// ── Backend DTO (stays inside the api boundary — never leaks to components) ─────
interface StatsDto {
  orders_total: number
  orders_by_status: {
    pending: number
    paid: number
    shipped: number
    delivered: number
    cancelled: number
  }
  revenue_uzs: number      // collected (paid) revenue
  gross_sales_uzs: number  // gross sales (placed)
  units_sold: number
  product_count: number
  active_products: number
  recent_orders: Array<{
    id: string
    status: string
    total_uzs: number
    payment_status: string
    created_at: string
  }>
}

// ── Mappers (snake_case backend → existing client model) ────────────────────────

// To-do counts. Backend supplies real values for order pipeline + stock kinds;
// trend % has no backend source yet → null (TrendBadge tolerates it).
// [PENDING BACKEND] kinds (pending_cancellation, pending_return, banned, campaign)
// have no stats field — surfaced as 0 so the grid layout stays intact.
function mapStatsToTodo(dto: StatsDto): TodoItem[] {
  const s = dto.orders_by_status
  const soldOut = Math.max(dto.product_count - dto.active_products, 0)
  return [
    // unpaid carries a UZS amount in the card; we have a count, not an amount,
    // and no per-status revenue split → show pending count, no amount.
    { id: 'todo-unpaid', kind: 'unpaid', count: s.pending, trendPct: 0, trendDirection: 'up' },
    { id: 'todo-to_process', kind: 'to_process', count: s.paid, trendPct: 0, trendDirection: 'up' },
    { id: 'todo-processed', kind: 'processed', count: s.shipped + s.delivered, trendPct: 0, trendDirection: 'up' },
    // [PENDING BACKEND] — no cancellation-request feed yet
    { id: 'todo-pending_cancellation', kind: 'pending_cancellation', count: s.cancelled, trendPct: 0, trendDirection: 'down' },
    // [PENDING BACKEND] — no return feed yet
    { id: 'todo-pending_return', kind: 'pending_return', count: 0, trendPct: 0, trendDirection: 'down' },
    // [PENDING BACKEND] — no moderation/ban feed yet
    { id: 'todo-banned', kind: 'banned', count: 0, trendPct: 0, trendDirection: 'up' },
    { id: 'todo-sold_out', kind: 'sold_out', count: soldOut, trendPct: 0, trendDirection: 'down' },
    // [PENDING BACKEND] — no campaign feed yet
    { id: 'todo-campaign', kind: 'campaign', count: 0, trendPct: 0, trendDirection: 'up' },
  ]
}

// Helpers mirror the original mock builders so the client model is unchanged.
function count(key: string, n: number, highlighted = false): InsightMetric {
  return { key, count: n, trendPct: null, highlighted }
}
function money(key: string, uzs: number, highlighted = false): InsightMetric {
  return { key, count: 0, amountUzs: uzs, trendPct: null, highlighted }
}

// Business insights. Only the headline totals (sales / orders / units / buyers
// proxied by order counts) are real. Trend charts, conversion %, visitor counts
// and the funnel/sales-service breakdowns have NO backend source → 0 / empty.
function mapStatsToInsights(dto: StatsDto): BusinessInsightsResponse {
  // [PENDING BACKEND] — no time-series; empty series keeps TrendChart happy.
  const emptySeries: number[] = []
  const chart = { sales: emptySeries, orders: emptySeries, conversion: emptySeries }

  return {
    dashboard: {
      metrics: [
        money('sales', dto.gross_sales_uzs, true),
        // [PENDING BACKEND] visitors/pageViews/conversionRate — no traffic source
        count('visitors', 0),
        count('pageViews', 0),
        count('orders', dto.orders_total, true),
        // [PENDING BACKEND] conversionRate — needs visitor data
        { key: 'conversionRate', count: 0, percent: 0, trendPct: null, highlighted: true },
        money('salesPerOrder', dto.orders_total > 0 ? Math.round(dto.gross_sales_uzs / dto.orders_total) : 0),
      ],
      chart,
    },
    marketing: {
      metrics: [
        money('sales', dto.gross_sales_uzs, true),
        count('orders', dto.orders_total, true),
        count('unitsSold', dto.units_sold),
        // [PENDING BACKEND] buyers — distinct-buyer count not in stats
        count('buyers', 0),
        money('salesPerOrder', dto.orders_total > 0 ? Math.round(dto.gross_sales_uzs / dto.orders_total) : 0),
      ],
      chart,
    },
    // [PENDING BACKEND] — funnel + sales-service breakdowns have no backend source.
    productOverview: [],
    salesServices: [],
  }
}

// ── API functions ──────────────────────────────────────────────────────────────

// ✅ GET /sellers/me/stats → to-do counts
export async function getTodoList(): Promise<TodoListResponse> {
  const { data } = await apiClient.get<StatsDto>(PATHS.stats)
  return { items: mapStatsToTodo(data) }
}

// ✅ GET /sellers/me/stats → business-insights headline metrics
export async function getBusinessInsights(): Promise<BusinessInsightsResponse> {
  const { data } = await apiClient.get<StatsDto>(PATHS.stats)
  return mapStatsToInsights(data)
}
