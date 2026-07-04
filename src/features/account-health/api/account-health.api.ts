// Paths repointed to live backend routes (2026-06-17).
// MSW bypass: these paths no longer match mock handlers (onUnhandledRequest:'bypass').
import { apiClient } from '@/lib/axios'
import type {
  AccountHealthSummary,
  MetricRow,
  NfrDetailResponse,
  NfrDonutSlice,
  NfrWeeklySnapshot,
  NfrAffectedOrder,
  ChatDetailResponse,
  ChatDaySnapshot,
} from '../types/account-health.types'

export const PATHS = {
  // ✅ Live backend routes
  summary: '/sellers/me/account-health/summary',
  nfr: '/sellers/me/metrics/nfr',
  chat: '/sellers/me/metrics/chat',
  // nfrOrders folded into nfr response as affected_orders[] — no separate call needed
  nfrOrders: '/sellers/me/metrics/nfr',
  // chatTrend included in chat response as trend[] — no separate call needed
  chatTrend: '/sellers/me/metrics/chat',
  // ✅ Real route — shared seller reviews endpoint, read for the avg rating only.
  reviews: '/sellers/me/reviews',
} as const

// ── Backend DTOs (snake_case) ─────────────────────────────────────────────────

interface BackendMetricRow {
  id: string
  group: string
  current_value: string | null
  target: string
  applied_to: string[]
  passing: boolean
  has_detail: boolean
}

interface BackendSummary {
  health_label: string
  penalty_points: number
  penalty_max: number
  punishment_active: boolean
  ongoing_appeals: number
  admin_sided_listings: number
  listings_with_issues: number
  late_orders: number
  metrics: BackendMetricRow[]
}

interface BackendDonutSlice {
  reason_code: string
  label: string
  value_amount: number
  value_count: number
  color: string
}

interface BackendWeeklySnapshot {
  week_start: string
  rate: number
}

interface BackendAffectedOrder {
  order_id: string
  type: string
  reason: string
  shipping_channel: string
}

interface BackendNfr {
  from_date: string
  to_date: string
  my_shop_rate: number | null
  penalty_point_issued: boolean
  penalty_point_issued_date: string | null
  verified_seller_impact: boolean
  evaluation_period: string
  passing: boolean
  donut_slices: BackendDonutSlice[]
  trend: BackendWeeklySnapshot[]
  affected_orders: BackendAffectedOrder[]
}

interface BackendChatPreviousDay {
  chats_responded: number
  total_chats: number
  response_rate: number
}

interface BackendChatDaySnapshot {
  date: string
  rate: number
}

interface BackendChat {
  date: string
  chats_responded: number
  total_chats: number
  response_rate: number
  avg_response_time_minutes: number | null   // in response, not in FE type — ignored
  chat_satisfaction_rate: number | null       // in response, not in FE type — ignored
  previous_day: BackendChatPreviousDay
  trend: BackendChatDaySnapshot[]
}

// Backend reviews summary DTO (snake_case, verified). We only need avg_rating + count.
interface BackendReviewSummary {
  count: number
  avg_rating: number
  by_star: Record<'1' | '2' | '3' | '4' | '5', number>
}
interface BackendReviewsResponse {
  summary: BackendReviewSummary
}

// ── Adapters (snake_case → camelCase / DTO → FE types) ───────────────────────

function adaptMetricRow(m: BackendMetricRow): MetricRow {
  return {
    id: m.id as MetricRow['id'],
    group: m.group as MetricRow['group'],
    currentValue: m.current_value,
    target: m.target,
    appliedTo: (m.applied_to ?? []) as MetricRow['appliedTo'],
    passing: m.passing,
    hasDetail: m.has_detail,
  }
}

function adaptSummary(d: BackendSummary): AccountHealthSummary {
  return {
    healthLabel: (d.health_label?.toUpperCase() ?? 'EXCELLENT') as AccountHealthSummary['healthLabel'],
    penaltyPoints: d.penalty_points ?? 0,
    penaltyMax: d.penalty_max ?? 6,
    punishmentActive: d.punishment_active ?? false,
    ongoingAppeals: d.ongoing_appeals ?? 0,
    adminSidedListings: d.admin_sided_listings ?? 0,
    listingsWithIssues: d.listings_with_issues ?? 0,
    lateOrders: d.late_orders ?? 0,
    metrics: (d.metrics ?? []).map(adaptMetricRow),
  }
}

function adaptNfr(d: BackendNfr): NfrDetailResponse {
  const donutSlices: NfrDonutSlice[] = (d.donut_slices ?? []).map((s) => ({
    reasonCode: s.reason_code,
    label: s.label,
    valueAmount: s.value_amount ?? 0,
    valueCount: s.value_count ?? 0,
    color: s.color ?? '#CCCCCC',
  }))

  const trend: NfrWeeklySnapshot[] = (d.trend ?? []).map((t) => ({
    weekStart: t.week_start,
    rate: t.rate ?? 0,
  }))

  const affectedOrders: NfrAffectedOrder[] = (d.affected_orders ?? []).map((o) => ({
    orderId: o.order_id,
    type: o.type,
    reason: o.reason ?? '',
    shippingChannel: o.shipping_channel ?? '',
  }))

  return {
    fromDate: d.from_date,
    toDate: d.to_date,
    myShopRate: d.my_shop_rate ?? null,
    penaltyPointIssued: d.penalty_point_issued ?? false,
    penaltyPointIssuedDate: d.penalty_point_issued_date ?? null,
    verifiedSellerImpact: d.verified_seller_impact ?? false,
    evaluationPeriod: d.evaluation_period ?? '',
    passing: d.passing ?? true,
    donutSlices,
    trend,
    affectedOrders,
  }
}

function adaptChat(d: BackendChat): ChatDetailResponse {
  const trend: ChatDaySnapshot[] = (d.trend ?? []).map((t) => ({
    date: t.date,
    rate: t.rate ?? 0,
  }))

  return {
    date: d.date,
    chatsResponded: d.chats_responded ?? 0,
    totalChats: d.total_chats ?? 0,
    responseRate: d.response_rate ?? 0,
    previousDay: {
      chatsResponded: d.previous_day?.chats_responded ?? 0,
      totalChats: d.previous_day?.total_chats ?? 0,
      responseRate: d.previous_day?.response_rate ?? 0,
    },
    trend,
  }
}

// ── Live fetchers ─────────────────────────────────────────────────────────────

// ✅ Real: fetch the live shop rating from the shared reviews endpoint.
// Returns null when there are no ratings yet, so the metric shows "–".
async function getShopRating(): Promise<{ avg: number; count: number } | null> {
  try {
    const { data } = await apiClient.get<BackendReviewsResponse>(PATHS.reviews)
    if (!data.summary || data.summary.count === 0) return null
    return { avg: data.summary.avg_rating, count: data.summary.count }
  } catch {
    // Reviews failing must not break the health summary.
    return null
  }
}

// ✅ Live: GET /api/v1/sellers/me/account-health/summary
// Hydrates shop_rating row from the real reviews endpoint on top.
export async function getAccountHealthSummary(): Promise<AccountHealthSummary> {
  const [res, rating] = await Promise.all([
    apiClient.get<BackendSummary>(PATHS.summary),
    getShopRating(),
  ])
  const summary = adaptSummary(res.data)
  if (rating) {
    summary.metrics = summary.metrics.map((m) =>
      m.id === 'shop_rating' ? { ...m, currentValue: rating.avg.toFixed(1) } : m,
    )
  }
  return summary
}

// ✅ Live: GET /api/v1/sellers/me/metrics/nfr
export async function getNfrDetail(from: string, to: string): Promise<NfrDetailResponse> {
  const res = await apiClient.get<BackendNfr>(PATHS.nfr, { params: { from, to } })
  return adaptNfr(res.data)
}

// ✅ Live: GET /api/v1/sellers/me/metrics/chat
export async function getChatDetail(date: string): Promise<ChatDetailResponse> {
  const res = await apiClient.get<BackendChat>(PATHS.chat, { params: { date } })
  return adaptChat(res.data)
}
