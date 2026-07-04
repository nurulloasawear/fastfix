// [PENDING BACKEND] — MSW handlers with consistent derived data.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  AccountHealthSummary,
  NfrDetailResponse,
  ChatDetailResponse,
} from '../types/account-health.types'

const BASE = env.apiBaseUrl

// ── Account Health Summary ────────────────────────────────────────────────────
const SUMMARY: AccountHealthSummary = {
  healthLabel: 'EXCELLENT',
  penaltyPoints: 0,
  penaltyMax: 6,
  punishmentActive: false,
  ongoingAppeals: 0,
  adminSidedListings: 0,
  listingsWithIssues: 0,
  lateOrders: 0,
  metrics: [
    { id: 'nfr',           group: 'fulfilment',       currentValue: '–',     target: '< 8%',    appliedTo: ['penalty_points', 'verified_seller_reset'], passing: true,  hasDetail: true },
    { id: 'late_shipment', group: 'fulfilment',       currentValue: '–',     target: '< 8%',    appliedTo: ['penalty_points', 'verified_seller_reset'], passing: true,  hasDetail: false },
    { id: 'prep_time',     group: 'fulfilment',       currentValue: '–',     target: '< 1 day', appliedTo: ['none'],                                    passing: true,  hasDetail: false },
    { id: 'fast_handover', group: 'fulfilment',       currentValue: '–',     target: '≥ 90%',   appliedTo: ['none'],                                    passing: true,  hasDetail: false },
    { id: 'on_time_pickup',group: 'fulfilment',       currentValue: '–',     target: '< 8%',    appliedTo: ['none'],                                    passing: true,  hasDetail: false },
    { id: 'severe_listing',group: 'listing',          currentValue: '0',     target: '0',        appliedTo: ['penalty_points'],                          passing: true,  hasDetail: false },
    { id: 'preorder_listing',group: 'listing',        currentValue: '0.00%', target: '≤ 20%',   appliedTo: ['listing_limit'],                           passing: true,  hasDetail: false },
    { id: 'other_listing', group: 'listing',          currentValue: '0',     target: '0',        appliedTo: ['none'],                                    passing: true,  hasDetail: false },
    { id: 'response_rate', group: 'customer_service', currentValue: '–',     target: '≥ 85%',   appliedTo: ['highlighted', 'verified_seller_reset'],    passing: true,  hasDetail: true  },
    { id: 'response_time', group: 'customer_service', currentValue: '–',     target: '< 7 h',   appliedTo: ['none'],                                    passing: true,  hasDetail: false },
    { id: 'chat_satisfaction',group: 'customer_service',currentValue: '–',   target: '≥ 70%',   appliedTo: ['none'],                                    passing: true,  hasDetail: false },
    { id: 'shop_rating',   group: 'customer_service', currentValue: '≥ 4.9', target: '≥ 4.9/5', appliedTo: ['highlighted', 'verified_seller_reset'],    passing: true,  hasDetail: false },
  ],
}

// ── NFR Detail ────────────────────────────────────────────────────────────────
function buildNfrTrend(): NfrDetailResponse['trend'] {
  const weeks: NfrDetailResponse['trend'] = []
  const base = new Date('2026-03-24')
  for (let i = 0; i < 12; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i * 7)
    weeks.push({ weekStart: d.toISOString().slice(0, 10), rate: 0 })
  }
  return weeks
}

const NFR_DETAIL: NfrDetailResponse = {
  fromDate: '2026-06-08',
  toDate: '2026-06-14',
  myShopRate: null,
  penaltyPointIssued: false,
  penaltyPointIssuedDate: null,
  verifiedSellerImpact: false,
  evaluationPeriod: '2026-06-08 to 2026-06-14',
  passing: true,
  donutSlices: [],
  trend: buildNfrTrend(),
  affectedOrders: [],
}

// ── Chat Detail ───────────────────────────────────────────────────────────────
function buildChatTrend(): ChatDetailResponse['trend'] {
  const days: ChatDetailResponse['trend'] = []
  const base = new Date('2026-05-16')
  for (let i = 0; i < 30; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    days.push({ date: d.toISOString().slice(0, 10), rate: 0 })
  }
  return days
}

const CHAT_DETAIL: ChatDetailResponse = {
  date: '2026-06-15',
  chatsResponded: 0,
  totalChats: 0,
  responseRate: 0,
  previousDay: { chatsResponded: 0, totalChats: 0, responseRate: 0 },
  trend: buildChatTrend(),
}

// ── MSW Handlers ──────────────────────────────────────────────────────────────
export const accountHealthHandlers = [
  http.get(`${BASE}/seller/account-health/summary`, () =>
    HttpResponse.json(SUMMARY),
  ),

  http.get(`${BASE}/seller/metrics/nfr`, () =>
    HttpResponse.json(NFR_DETAIL),
  ),

  http.get(`${BASE}/seller/metrics/chat`, () =>
    HttpResponse.json(CHAT_DETAIL),
  ),

  http.get(`${BASE}/seller/metrics/chat/trend`, () =>
    HttpResponse.json({ trend: buildChatTrend() }),
  ),
]
