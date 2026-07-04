// Account Health domain types — NO enums (erasableSyntaxOnly), string-union + const arrays only.

// ── Health label ──────────────────────────────────────────────────────────────
export type HealthLabel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'

// ── Metric IDs ────────────────────────────────────────────────────────────────
export type MetricId =
  | 'nfr'
  | 'late_shipment'
  | 'prep_time'
  | 'fast_handover'
  | 'on_time_pickup'
  | 'severe_listing'
  | 'preorder_listing'
  | 'other_listing'
  | 'response_rate'
  | 'response_time'
  | 'chat_satisfaction'
  | 'shop_rating'

// ── Metric group ──────────────────────────────────────────────────────────────
export type MetricGroup = 'fulfilment' | 'listing' | 'customer_service'

// ── Penalty consequence ───────────────────────────────────────────────────────
export type PenaltyConsequence = 'penalty_points' | 'verified_seller_reset' | 'listing_limit' | 'highlighted' | 'none'

// ── Single metric in the overview table ───────────────────────────────────────
export interface MetricRow {
  id: MetricId
  group: MetricGroup
  currentValue: string | null   // null = no data / "–"
  target: string
  appliedTo: PenaltyConsequence[]
  passing: boolean
  hasDetail: boolean            // if true, "View Details" link is shown
}

// ── Account health summary (GET /seller/account-health/summary) ───────────────
export interface AccountHealthSummary {
  healthLabel: HealthLabel
  penaltyPoints: number
  penaltyMax: number            // platform constant = 6
  punishmentActive: boolean
  ongoingAppeals: number
  adminSidedListings: number
  metrics: MetricRow[]
  listingsWithIssues: number
  lateOrders: number
}

// ── NFR detail (GET /seller/metrics/nfr) ─────────────────────────────────────
export type NfrToggle = 'amount' | 'count'

export interface NfrDonutSlice {
  reasonCode: string
  label: string
  valueAmount: number
  valueCount: number
  color: string
}

export interface NfrWeeklySnapshot {
  weekStart: string   // ISO date
  rate: number        // 0–100
}

export interface NfrAffectedOrder {
  orderId: string
  type: string
  reason: string
  shippingChannel: string
}

export interface NfrDetailResponse {
  fromDate: string
  toDate: string
  myShopRate: number | null
  penaltyPointIssued: boolean
  penaltyPointIssuedDate: string | null
  verifiedSellerImpact: boolean
  evaluationPeriod: string
  passing: boolean
  donutSlices: NfrDonutSlice[]
  trend: NfrWeeklySnapshot[]       // last 12 weeks
  affectedOrders: NfrAffectedOrder[]
}

// ── Chat response detail (GET /seller/metrics/chat) ──────────────────────────
export interface ChatDaySnapshot {
  date: string        // ISO date
  rate: number        // 0–100
}

export interface ChatDetailResponse {
  date: string
  chatsResponded: number
  totalChats: number
  responseRate: number
  previousDay: {
    chatsResponded: number
    totalChats: number
    responseRate: number
  }
  trend: ChatDaySnapshot[]         // last 30 days
}
