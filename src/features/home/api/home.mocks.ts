import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'

// MSW now mirrors PROD: it serves the real GET /sellers/me/stats route with the
// BACKEND-shaped (snake_case, integer UZS) response. The api layer maps this DTO
// into the feature client model — same code path as a real server. Only the
// headline totals + recent orders are real; deeper analytics are [PENDING BACKEND].
const BASE = env.apiBaseUrl

// Backend shape of GET /sellers/me/stats (money = integer UZS, IDs UUIDv7).
const STATS = {
  orders_total: 312,
  orders_by_status: {
    pending: 14,
    paid: 120,
    shipped: 96,
    delivered: 104,
    cancelled: 20,
  },
  revenue_uzs: 36_240_000,    // collected (paid)
  gross_sales_uzs: 39_120_000, // gross (placed)
  units_sold: 540,
  product_count: 248,
  active_products: 200,
  recent_orders: [
    { id: '0190b8e1-7a10-7b2c-9f01-1a2b3c4d5e6f', status: 'paid', total_uzs: 1_350_000, payment_status: 'paid', created_at: '2026-06-17T09:12:00Z' },
    { id: '0190b8e0-6c20-7a1b-8e02-2b3c4d5e6f70', status: 'shipped', total_uzs: 890_000, payment_status: 'paid', created_at: '2026-06-17T08:40:00Z' },
    { id: '0190b8df-5d30-7c0a-7d03-3c4d5e6f7081', status: 'pending', total_uzs: 2_100_000, payment_status: 'unpaid', created_at: '2026-06-17T08:05:00Z' },
    { id: '0190b8de-4e40-7b09-6c04-4d5e6f708192', status: 'delivered', total_uzs: 540_000, payment_status: 'paid', created_at: '2026-06-16T19:55:00Z' },
    { id: '0190b8dd-3f50-7a08-5b05-5e6f708192a3', status: 'cancelled', total_uzs: 720_000, payment_status: 'refunded', created_at: '2026-06-16T18:30:00Z' },
  ],
}

export const homeHandlers = [
  // ✅ real route — backend-shaped response (the api layer maps it to TodoList +
  // BusinessInsights). Drives both the to-do landing and the insights headline.
  http.get(`${BASE}/sellers/me/stats`, () => HttpResponse.json(STATS)),
]
