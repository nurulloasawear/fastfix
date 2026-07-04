// MSW handlers. The Overview headline now mirrors PROD: MSW serves the real
// GET /sellers/me/stats route with the BACKEND-shaped (snake_case, integer UZS)
// response, and the api layer maps it into OverviewData. Every other endpoint
// here is [PENDING BACKEND] — no backend route exists yet; consistent derived
// data, never lies.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  OverviewData,
  ProductOverviewData,
  ProductTrafficData,
  ProductPerformanceRow,
  SalesOverviewData,
  ChatOverviewData,
  TrafficOverviewData,
} from '../types/insights.types'

const BASE = env.apiBaseUrl

// ── ✅ Real route: GET /sellers/me/stats (backend-shaped) ───────────────────────
// Drives the Insights Overview headline KPIs. Same dataset shape as the home
// feature mock; the api layer maps snake_case → OverviewData.
const STATS = {
  orders_total: 312,
  orders_by_status: { pending: 14, paid: 120, shipped: 96, delivered: 104, cancelled: 20 },
  revenue_uzs: 36_240_000,
  gross_sales_uzs: 39_120_000,
  units_sold: 540,
  product_count: 248,
  active_products: 200,
  recent_orders: [
    { id: '0190b8e1-7a10-7b2c-9f01-1a2b3c4d5e6f', status: 'paid', total_uzs: 1_350_000, payment_status: 'paid', created_at: '2026-06-17T09:12:00Z' },
    { id: '0190b8e0-6c20-7a1b-8e02-2b3c4d5e6f70', status: 'shipped', total_uzs: 890_000, payment_status: 'paid', created_at: '2026-06-17T08:40:00Z' },
    { id: '0190b8df-5d30-7c0a-7d03-3c4d5e6f7081', status: 'pending', total_uzs: 2_100_000, payment_status: 'unpaid', created_at: '2026-06-17T08:05:00Z' },
  ],
}

// ── Empty trend (no data yet) ─────────────────────────────────────────────────
const emptyTrend = Array.from({ length: 8 }, (_, i) => ({
  label: `${String(i * 3).padStart(2, '0')}:00`,
  values: { sales: 0, visitors: 0, orders: 0 },
}))

const emptyOverview: OverviewData = {
  kpis: {
    sales: { value: 0, delta: 0, label: 'Sales', isMonetary: true },
    salesWithRebate: { value: 0, delta: 0, label: 'Sales (Rebate)', isMonetary: true },
    orders: { value: 0, delta: 0, label: 'Orders' },
    convRate: { value: 0, delta: 0, label: 'Conv Rate', isPercent: true },
  },
  realtime: { salesToday: 0, units: 0, productOrders: 0, orders: 0, convRate: 0 },
  trend: emptyTrend,
  channelBreakdown: [
    { id: 'total', name: 'Total Sales', salesUzs: 0, deltaPct: 0, percentage: 100 },
    { id: 'product_card', name: 'Product Card', salesUzs: 0, deltaPct: 0, percentage: 0 },
    { id: 'seller_live', name: 'Seller Live', salesUzs: 0, deltaPct: 0, percentage: 0 },
    { id: 'seller_video', name: 'Seller Video', salesUzs: 0, deltaPct: 0, percentage: 0 },
    { id: 'ozb_affiliate', name: 'OZB Affiliate', salesUzs: 0, deltaPct: 0, percentage: 0 },
    { id: 'ozb_ads', name: 'OZB Ads', salesUzs: 0, deltaPct: 0, percentage: 0 },
  ],
  trafficSources: [
    {
      source: 'Product Card',
      salesRatioPct: 0,
      salesUzs: 0,
      salesDeltaPct: 0,
      impressions: 0,
      clicks: 0,
      orders: 0,
      units: 0,
      ctrPct: 0,
      convRatePct: 0,
    },
  ],
  topProducts: [],
}

const emptyProductOverview: ProductOverviewData = {
  visit: {
    visitors: { value: 0, delta: 0, label: '' },
    pageViews: { value: 0, delta: 0, label: '' },
    itemsVisited: { value: 0, delta: 0, label: '' },
    bounceVisitors: { value: 0, delta: 0, label: '' },
    bounceRate: { value: 0, delta: 0, label: '', isPercent: true },
    searchClicks: { value: 0, delta: 0, label: '' },
    liked: { value: 0, delta: 0, label: '' },
    units: { value: 0, delta: 0, label: '' },
  },
  addToCart: {
    visitors: { value: 0, delta: 0, label: '' },
    units: { value: 0, delta: 0, label: '' },
    convRate: { value: 0, delta: 0, label: '', isPercent: true },
  },
  placedOrder: {
    buyers: { value: 0, delta: 0, label: '' },
    units: { value: 0, delta: 0, label: '' },
    items: { value: 0, delta: 0, label: '' },
    salesUzs: { value: 0, delta: 0, label: '', isMonetary: true },
    convRate: { value: 0, delta: 0, label: '', isPercent: true },
  },
  paidOrder: {
    buyers: { value: 0, delta: 0, label: '' },
    units: { value: 0, delta: 0, label: '' },
    items: { value: 0, delta: 0, label: '' },
    salesUzs: { value: 0, delta: 0, label: '', isMonetary: true },
    convRate: { value: 0, delta: 0, label: '', isPercent: true },
  },
  trend: emptyTrend,
  rankings: [],
}

const emptyProductTraffic: ProductTrafficData = {
  channelBreakdown: emptyOverview.channelBreakdown,
  trafficSources: emptyOverview.trafficSources,
}

const emptyPerformance: ProductPerformanceRow[] = []

const emptySalesOverview: SalesOverviewData = {
  visitors: { value: 0, delta: 0, label: '' },
  placedBuyers: { value: 0, delta: 0, label: '' },
  placedSales: { value: 0, delta: 0, label: '', isMonetary: true },
  paidBuyers: { value: 0, delta: 0, label: '' },
  paidSales: { value: 0, delta: 0, label: '', isMonetary: true },
  salesPerBuyer: { value: 0, delta: 0, label: '', isMonetary: true },
  convVisitToPlaced: 0,
  convPlacedToPaid: 0,
  trend: emptyTrend,
}

const emptyChatOverview: ChatOverviewData = {
  visitors: { value: 10, delta: 11.11, label: '' },
  chatEnquired: { value: 0, delta: 0, label: '' },
  visitorsEnquired: { value: 0, delta: 0, label: '' },
  respondedChats: { value: 0, delta: 0, label: '' },
  nonRespondedChats: { value: 0, delta: 0, label: '' },
  avgResponseTime: '--:--:--',
  csatPct: { value: 0, delta: 0, label: '', isPercent: true },
  defaultPct: { value: 0, delta: 0, label: '', isPercent: true },
  buyers: { value: 0, delta: 0, label: '' },
  orders: { value: 0, delta: 0, label: '' },
  units: { value: 0, delta: 0, label: '' },
  salesUzs: { value: 0, delta: 0, label: '', isMonetary: true },
  convRate: { value: 0, delta: 0, label: '', isPercent: true },
  trend: Array.from({ length: 30 }, (_, i) => ({
    label: String(i + 1),
    values: { visitors: i === 5 ? 10 : 0, enquired: 0 },
  })),
}

const emptyTrafficOverview: TrafficOverviewData = {
  all: {
    pageViews: { value: 198, delta: 123.6, label: '' },
    avgPageViews: { value: 177, delta: 140.8, label: '' },
    avgTimeSpent: '00:00:46',
    avgTimeSpentDelta: 441.5,
    bounceRate: { value: 27.68, delta: 6.41, label: '', isPercent: true },
    visitors: { value: 112, delta: 17.9, label: '' },
    newVisitors: { value: 105, delta: 41.9, label: '' },
    existingVisitors: { value: 7, delta: 0.3, label: '' },
    newFollowers: { value: 0, delta: -100, label: '' },
  },
  app: {
    pageViews: { value: 160, delta: 143.3, label: '' },
    avgPageViews: { value: 195, delta: 209.8, label: '' },
    avgTimeSpent: '00:00:44',
    avgTimeSpentDelta: 449.4,
    bounceRate: { value: 10.98, delta: 6.3, label: '', isPercent: true },
    visitors: { value: 82, delta: 0.0, label: '' },
    newVisitors: { value: 76, delta: 11.9, label: '' },
    existingVisitors: { value: 6, delta: 1.4, label: '' },
    newFollowers: { value: 0, delta: -100, label: '' },
  },
  web: {
    pageViews: { value: 38, delta: -29.6, label: '' },
    avgPageViews: { value: 127, delta: -0.8, label: '' },
    avgTimeSpent: '00:00:54',
    avgTimeSpentDelta: -51.9,
    bounceRate: { value: 73.33, delta: 6.5, label: '', isPercent: true },
    visitors: { value: 30, delta: -12.8, label: '' },
    newVisitors: { value: 29, delta: -11.9, label: '' },
    existingVisitors: { value: 1, delta: 0, label: '' },
    newFollowers: { value: 1, delta: 0, label: '' },
  },
  trend: Array.from({ length: 28 }, (_, i) => ({
    label: `${i + 1} Jan`,
    values: { pageViews: Math.floor(Math.random() * 15), visitors: Math.floor(Math.random() * 10) },
  })),
}

const emptyMarketingKpis = {
  kpis: {
    sales: { value: 0, delta: 0, label: '', isMonetary: true },
    orders: { value: 0, delta: 0, label: '' },
    units: { value: 0, delta: 0, label: '' },
    buyers: { value: 0, delta: 0, label: '' },
    salesPerBuyer: { value: 0, delta: 0, label: '', isMonetary: true },
  },
  trend: [],
  promos: [],
}

export const insightsHandlers = [
  // ✅ real route — backend-shaped; the api layer maps it to OverviewData.
  http.get(`${BASE}/sellers/me/stats`, () => HttpResponse.json(STATS)),
  // [PENDING BACKEND] below — no backend route yet; MSW serves derived stubs.
  http.get(`${BASE}/insights/product/overview`, () => HttpResponse.json(emptyProductOverview)),
  http.get(`${BASE}/insights/product/traffic`, () => HttpResponse.json(emptyProductTraffic)),
  http.get(`${BASE}/insights/product/performance`, () => HttpResponse.json(emptyPerformance)),
  http.get(`${BASE}/insights/product/diagnosis`, () =>
    HttpResponse.json({
      counts: [
        { issue: 'decrease_sales', count: 0 },
        { issue: 'poor_reviews', count: 0 },
        { issue: 'high_returns', count: 0 },
        { issue: 'high_late_shipped', count: 0 },
        { issue: 'high_cancellation', count: 0 },
        { issue: 'poor_conversion', count: 0 },
        { issue: 'decrease_views', count: 0 },
      ],
      products: [],
      activeIssue: 'decrease_sales',
    }),
  ),
  http.get(`${BASE}/insights/sales/overview`, () => HttpResponse.json(emptySalesOverview)),
  http.get(`${BASE}/insights/sales/composition`, () =>
    HttpResponse.json({
      categoryTabs: [],
      activeCategory: '',
      totalSales: 0,
      categoryRows: [],
      priceRangeRows: [
        { range: '0 – 50 000', buyers: 0, buyersPct: 0, salesUzs: 0, convRate: 0 },
        { range: '50 001 – 150 000', buyers: 0, buyersPct: 0, salesUzs: 0, convRate: 0 },
        { range: '150 001 – 500 000', buyers: 0, buyersPct: 0, salesUzs: 0, convRate: 0 },
        { range: '500 001 – 2 000 000', buyers: 0, buyersPct: 0, salesUzs: 0, convRate: 0 },
        { range: '2 000 001+', buyers: 0, buyersPct: 0, salesUzs: 0, convRate: 0 },
      ],
      buyerTypeRows: [
        { type: 'new', buyers: 0, buyersPct: 0, salesUzs: 0, salesPct: 0, convRate: 0 },
        { type: 'existing', buyers: 0, buyersPct: 0, salesUzs: 0, salesPct: 0, convRate: 0 },
      ],
    }),
  ),
  http.get(`${BASE}/insights/services/chat`, () => HttpResponse.json(emptyChatOverview)),
  http.get(`${BASE}/insights/traffic/overview`, () => HttpResponse.json(emptyTrafficOverview)),
  http.get(`${BASE}/insights/marketing/discount`, () =>
    HttpResponse.json({ ...emptyMarketingKpis, promos: [] }),
  ),
  http.get(`${BASE}/insights/marketing/voucher`, () =>
    HttpResponse.json({
      kpis: {
        sales: { value: 0, delta: 0, label: '', isMonetary: true },
        claims: { value: 0, delta: 0, label: '' },
        orders: { value: 0, delta: 0, label: '' },
        usageRate: { value: 0, delta: 0, label: '', isPercent: true },
        buyers: { value: 0, delta: 0, label: '' },
      },
      trend: [],
      vouchers: [],
    }),
  ),
  http.get(`${BASE}/insights/marketing/shipping-promo`, () =>
    HttpResponse.json({
      kpis: {
        sales: { value: 0, delta: 0, label: '', isMonetary: true },
        orders: { value: 0, delta: 0, label: '' },
        buyers: { value: 0, delta: 0, label: '' },
        salesPerBuyer: { value: 0, delta: 0, label: '', isMonetary: true },
        shippingCost: { value: 0, delta: 0, label: '', isMonetary: true },
      },
      trend: [],
      promos: [],
    }),
  ),
  http.get(`${BASE}/insights/marketing/livestream`, () =>
    HttpResponse.json({
      overview: {
        totalProduced: 0,
        uniqueViewers: 0,
        peakViewers: 0,
        avgWatchTime: '00:00:00',
        orders: 0,
        salesUzs: 0,
      },
      barChart: Array.from({ length: 30 }, (_, i) => ({
        date: `${i + 1}`,
        count: 0,
      })),
      streams: [],
    }),
  ),
  http.get(`${BASE}/insights/marketing/stream-deal`, () =>
    HttpResponse.json({
      kpis: {
        sales: { value: 0, delta: 0, label: '', isMonetary: true },
        orders: { value: 0, delta: 0, label: '' },
        units: { value: 0, delta: 0, label: '' },
        buyers: { value: 0, delta: 0, label: '' },
      },
      trend: [],
      promos: [],
    }),
  ),
  http.get(`${BASE}/insights/marketing/external-traffic`, () =>
    HttpResponse.json({
      overview: {
        visitors: { value: 0, delta: 0, label: '' },
        visits: { value: 0, delta: 0, label: '' },
        addToCartItems: { value: 0, delta: 0, label: '' },
        addToCartValue: { value: 0, delta: 0, label: '', isMonetary: true },
        buyers: { value: 0, delta: 0, label: '' },
        units: { value: 0, delta: 0, label: '' },
        salesUzs: { value: 0, delta: 0, label: '', isMonetary: true },
        orders: { value: 0, delta: 0, label: '' },
        convVisitToATC: 0,
        convATCToBuyers: 0,
        convVisitorToPlaced: 0,
        trend: [],
      },
      campaigns: [],
      products: [],
    }),
  ),
]
