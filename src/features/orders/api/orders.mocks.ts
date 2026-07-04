// MSW handlers — real routes serve backend-shaped (snake_case) responses so
// dev exercises the same mapper code as prod.  [PENDING BACKEND] routes stay
// at their existing paths.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  MassShipItem,
  OrderItem,
} from '../types/orders.types'

const BASE = env.apiBaseUrl

// ── Backend-shaped seed (snake_case, matches GET /orders/seller DTO) ─────────
interface MockBackendOrder {
  id: string
  user_id: string
  buyer_name: string
  status: string
  total_uzs: number
  payment_method: string
  payment_status: string
  created_at: string
}

interface MockBackendLangMap {
  uz: string
  ru: string
  en: string
}

interface MockBackendDetailItem {
  product_id: string
  title: MockBackendLangMap
  quantity: number
  unit_price_uzs: number
  image_urls: string[]
  variant_label: string
}

interface MockBackendListPreviewItem {
  title: MockBackendLangMap
  quantity: number
  image_url: string
}

interface MockBackendListOrder extends MockBackendOrder {
  item_count: number
  units: number
  items: MockBackendListPreviewItem[]
}

interface MockBackendDetail extends MockBackendOrder {
  buyer_phone: string
  seller_id: string
  shipping_address: string
  items: MockBackendDetailItem[]
}

// Seed — mirrors the client-side seed but in backend shape
const BACKEND_ORDERS: MockBackendOrder[] = [
  {
    id: 'order-1', user_id: 'user-shoira', buyer_name: 'Shoira Karimova',
    status: 'delivered', payment_status: 'paid',
    total_uzs: 189000, payment_method: 'payme',
    created_at: '2026-06-10T10:00:00Z',
  },
  {
    id: 'order-2', user_id: 'user-doniyor', buyer_name: 'Doniyor Aliyev',
    status: 'paid', payment_status: 'paid',
    total_uzs: 698000, payment_method: 'atmos_uzcard',
    created_at: '2026-06-12T14:30:00Z',
  },
  {
    id: 'order-3', user_id: 'user-madina', buyer_name: 'Madina Yusupova',
    status: 'paid', payment_status: 'paid',
    total_uzs: 129000, payment_method: 'payme',
    created_at: '2026-06-13T09:15:00Z',
  },
  {
    id: 'order-4', user_id: 'user-jasur', buyer_name: 'Jasur Toshmatov',
    status: 'pending', payment_status: 'unpaid',
    total_uzs: 297000, payment_method: 'atmos_humo',
    created_at: '2026-06-14T16:45:00Z',
  },
  {
    id: 'order-5', user_id: 'user-nigora', buyer_name: 'Nigora Saidova',
    status: 'shipped', payment_status: 'paid',
    total_uzs: 459000, payment_method: 'payme',
    created_at: '2026-06-11T11:00:00Z',
  },
  {
    id: 'order-6', user_id: 'user-sardor', buyer_name: 'Sardor Rahimov',
    status: 'cancelled', payment_status: 'refunded',
    total_uzs: 529000, payment_method: 'atmos_uzcard',
    created_at: '2026-06-09T08:20:00Z',
  },
  {
    id: 'order-7', user_id: 'user-umida', buyer_name: 'Umida Qodirova',
    status: 'delivered', payment_status: 'paid',
    total_uzs: 79000, payment_method: 'payme',
    created_at: '2026-06-08T13:00:00Z',
  },
]

// Detailed items per order (snake_case)
const DETAIL_ITEMS: Record<string, MockBackendDetailItem[]> = {
  'order-1': [{
    product_id: 'prod-1',
    title: { uz: 'Noutbuk uchun universal sozlanadigan taglik', ru: 'Универсальная подставка для ноутбука', en: 'Universal laptop stand' },
    quantity: 1, unit_price_uzs: 189000,
    image_urls: [], variant_label: 'Qora',
  }],
  'order-2': [{
    product_id: 'prod-2',
    title: { uz: 'Simsiz quloqchin Pro', ru: 'Беспроводные наушники Pro', en: 'Wireless earphones Pro' },
    quantity: 2, unit_price_uzs: 349000,
    image_urls: [], variant_label: 'Oq',
  }],
  'order-3': [{
    product_id: 'prod-3',
    title: { uz: 'Smart LED lenta 5m', ru: 'Умная LED лента 5м', en: 'Smart LED strip 5m' },
    quantity: 1, unit_price_uzs: 129000,
    image_urls: [], variant_label: 'RGB',
  }],
  'order-4': [{
    product_id: 'prod-4',
    title: { uz: 'Paxta oversize futbolka', ru: 'Хлопковая оверсайз футболка', en: 'Cotton oversize t-shirt' },
    quantity: 3, unit_price_uzs: 99000,
    image_urls: [], variant_label: 'Kulrang / L',
  }],
  'order-5': [{
    product_id: 'prod-5',
    title: { uz: 'Qishki kurtka', ru: 'Зимняя куртка', en: 'Winter jacket' },
    quantity: 1, unit_price_uzs: 459000,
    image_urls: [], variant_label: 'Koʻk / M',
  }],
  'order-6': [{
    product_id: 'prod-6',
    title: { uz: 'Mexanik klaviatura', ru: 'Механическая клавиатура', en: 'Mechanical keyboard' },
    quantity: 1, unit_price_uzs: 529000,
    image_urls: [], variant_label: 'Qora',
  }],
  'order-7': [{
    product_id: 'prod-7',
    title: { uz: 'Smartfon qopqogʻi', ru: 'Чехол для смартфона', en: 'Phone case' },
    quantity: 2, unit_price_uzs: 39500,
    image_urls: [], variant_label: 'Qizil',
  }],
}

function itemsFor(order: MockBackendOrder): MockBackendDetailItem[] {
  return DETAIL_ITEMS[order.id] ?? [{
    product_id: 'prod-unknown',
    title: { uz: 'Mahsulot', ru: 'Товар', en: 'Product' },
    quantity: 1, unit_price_uzs: order.total_uzs,
    image_urls: [], variant_label: '—',
  }]
}

// GET /orders/seller/{id} shape
function buildBackendDetail(order: MockBackendOrder): MockBackendDetail {
  return {
    ...order,
    buyer_phone: '+998 90 ***-**-74',
    seller_id: 'seller-self',
    shipping_address: 'Toshkent sh., Yunusobod t., B*****, ****74',
    items: itemsFor(order),
  }
}

// GET /orders/seller list-row shape (buyer_name + item_count + units + items preview)
function buildBackendListOrder(order: MockBackendOrder): MockBackendListOrder {
  const items = itemsFor(order)
  return {
    ...order,
    item_count: items.length,
    units: items.reduce((acc, i) => acc + i.quantity, 0),
    items: items.map((i) => ({
      title: i.title, quantity: i.quantity, image_url: i.image_urls[0] ?? '',
    })),
  }
}

// summary{all,pending,paid,shipped,delivered,cancelled,return_refund} over the FULL set
function buildSummary(orders: MockBackendOrder[]) {
  const count = (s: string) => orders.filter((o) => o.status === s).length
  const returnOrderIds = new Set(BACKEND_RETURNS.map((r) => r.order_id))
  return {
    all: orders.length,
    pending: count('pending'),
    paid: count('paid'),
    shipped: count('shipped'),
    delivered: count('delivered'),
    cancelled: count('cancelled'),
    return_refund: orders.filter((o) => returnOrderIds.has(o.id)).length,
  }
}

// ── Kept for [PENDING BACKEND] client-side usage (old client-model shape) ─────
// These are consumed by MSW handlers for pending routes only.
const CLIENT_ORDERS_FOR_PENDING: OrderItem[] = [
  {
    id: 'order-1', orderId: 'OZB240610ABCD1', buyerName: 'Shoira Karimova', shop: 'ozb',
    productName: 'Noutbuk uchun universal sozlanadigan taglik', quantity: 1, variation: 'Qora',
    totalUzs: 189000, paymentLabel: 'Payme', status: 'completed', subStatus: 'all',
    deliveryMethod: 'Eshikkacha', logisticsProvider: 'Yandex Delivery',
    trackingNumber: 'YDX12345678', createdAt: '2026-06-10', shippingArranged: true,
  },
  {
    id: 'order-2', orderId: 'OZB240612EFGH2', buyerName: 'Doniyor Aliyev', shop: 'ozb',
    productName: 'Simsiz quloqchin Pro', quantity: 2, variation: 'Oq',
    totalUzs: 698000, paymentLabel: 'Atmos (UzCard)', status: 'to_ship', subStatus: 'to_process',
    deliveryMethod: 'Eshikkacha', logisticsProvider: 'CDEK',
    trackingNumber: 'CDEK22223333', createdAt: '2026-06-12',
    shipByDeadlineSeconds: 90000, shippingArranged: false,
  },
  {
    id: 'order-3', orderId: 'OZB240613IJKL3', buyerName: 'Madina Yusupova', shop: 'ozb',
    productName: 'Smart LED lenta 5m', quantity: 1, variation: 'RGB',
    totalUzs: 129000, paymentLabel: 'Payme', status: 'to_ship', subStatus: 'processed',
    deliveryMethod: 'Oʻz yetkazish', logisticsProvider: 'Self-Delivery',
    trackingNumber: 'SELF44445555', createdAt: '2026-06-13',
    shipByDeadlineSeconds: 200000, shippingArranged: true,
  },
]

// ── Returns seed (backend-shaped, snake_case for ✅ /returns/seller*) ──────────
const BACKEND_RETURNS = [
  {
    id: 'ret-1', order_id: 'ord-1', buyer_name: 'tangh.1991', type: 'return_refund',
    reason_code: 'defective', reason_text: 'Mahsulot ishlamaydi', status: 'requested',
    refund_uzs: 324000, quantity: 1,
    product_title: { uz: 'Simsiz quloqchin Pro', ru: 'Беспроводные наушники Pro', en: 'Wireless Earbuds Pro' },
    created_at: '2026-06-12',
  },
  {
    id: 'ret-2', order_id: 'ord-2', buyer_name: 'staloy', type: 'refund_only',
    reason_code: 'quality', reason_text: 'Sifat muammosi', status: 'disputed',
    refund_uzs: 399000, quantity: 1,
    product_title: { uz: 'Aqlli LED lenta 5m', ru: 'Умная LED лента 5м', en: 'Smart LED Strip 5m' },
    created_at: '2026-06-11',
  },
]

// ── Mass ship seed (pending — kept at old path) ───────────────────────────────
const MASS_SHIP_ITEMS: MassShipItem[] = CLIENT_ORDERS_FOR_PENDING
  .filter((o) => o.status === 'to_ship')
  .map((o) => ({
    id: o.id, orderId: o.orderId, productName: o.productName,
    buyerName: o.buyerName, channel: o.logisticsProvider,
    confirmedTime: o.createdAt, orderStatus: o.subStatus,
    trackingNumber: o.shippingArranged ? o.trackingNumber : undefined,
    shippingArranged: o.shippingArranged,
  }))

// ── Mutable state for action mutations (ship/deliver/cancel) ──────────────────
// Allow mock state to mutate so the list refreshes correctly after actions.
const orderState: Record<string, { status: string; payment_status: string }> = {}
function getOrderStatus(id: string, original: MockBackendOrder) {
  return orderState[id] ?? { status: original.status, payment_status: original.payment_status }
}

// ── Handlers ──────────────────────────────────────────────────────────────────
export const ordersHandlers = [
  // ✅ GET /orders/seller?status=&limit=&offset= — backend shape (snake_case)
  // Returns buyer_name, item_count, units, items[] preview + summary{all,…,cancelled}.
  http.get(`${BASE}/orders/seller`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')          // pending|paid|shipped|delivered|cancelled|all
    const limit = Number(url.searchParams.get('limit') ?? '20')
    const offset = Number(url.searchParams.get('offset') ?? '0')

    // Apply live mock state (ship/deliver/cancel) before filtering.
    const all = BACKEND_ORDERS.map((o) => {
      const current = getOrderStatus(o.id, o)
      return { ...o, status: current.status, payment_status: current.payment_status }
    })

    const summary = buildSummary(all)

    let filtered = all
    if (status === 'return_refund') {
      const returnOrderIds = new Set(BACKEND_RETURNS.map((r) => r.order_id))
      filtered = filtered.filter((o) => returnOrderIds.has(o.id))
    } else if (status && status !== 'all') {
      filtered = filtered.filter((o) => o.status === status)
    }

    const paged = filtered.slice(offset, offset + limit).map(buildBackendListOrder)
    return HttpResponse.json({ orders: paged, summary })
  }),

  // ✅ GET /orders/seller/:id — seller-scoped detail (buyer_name, buyer_phone, seller_id, items[])
  http.get(`${BASE}/orders/seller/:id`, ({ params }) => {
    const found = BACKEND_ORDERS.find((o) => o.id === params.id) ?? BACKEND_ORDERS[0]
    const current = getOrderStatus(found.id, found)
    const order = { ...found, status: current.status, payment_status: current.payment_status }
    return HttpResponse.json(buildBackendDetail(order))
  }),

  // ✅ POST /orders/:id/ship
  http.post(`${BASE}/orders/:id/ship`, ({ params }) => {
    const id = String(params.id)
    orderState[id] = { status: 'shipped', payment_status: 'paid' }
    return HttpResponse.json({ id, status: 'shipped' }, { status: 200 })
  }),

  // ✅ POST /orders/:id/deliver
  http.post(`${BASE}/orders/:id/deliver`, ({ params }) => {
    const id = String(params.id)
    orderState[id] = { status: 'delivered', payment_status: 'paid' }
    return HttpResponse.json({ id, status: 'delivered' }, { status: 200 })
  }),

  // ✅ POST /orders/:id/cancel
  http.post(`${BASE}/orders/:id/cancel`, ({ params }) => {
    const id = String(params.id)
    const orig = BACKEND_ORDERS.find((o) => o.id === id)
    const origPayment = orig?.payment_status ?? 'unpaid'
    orderState[id] = {
      status: 'cancelled',
      payment_status: origPayment === 'paid' ? 'refunded' : origPayment,
    }
    return HttpResponse.json({ id, status: 'cancelled' }, { status: 200 })
  }),

  // ✅ GET /payments/:provider/status/:orderId
  http.get(`${BASE}/payments/:provider/status/:orderId`, ({ params }) => {
    const found = BACKEND_ORDERS.find((o) => o.id === params.orderId)
    const current = found ? getOrderStatus(found.id, found) : null
    return HttpResponse.json({
      status: current?.payment_status ?? 'unpaid',
      state: current?.payment_status === 'paid' ? 'confirmed' : 'pending',
    })
  }),

  // ✅ POST /orders/seller/:id/notes  {note} → {success, note}
  http.post(`${BASE}/orders/seller/:id/notes`, async ({ request, params }) => {
    const body = (await request.json().catch(() => ({}))) as { note?: string; text?: string }
    return HttpResponse.json(
      {
        success: true,
        note: {
          id: `note-${params.id}`,
          text: body.note ?? body.text ?? '',
          created_at: '2026-06-20T10:00:00Z',
          created_by: 'mock-seller',
        },
      },
      { status: 201 },
    )
  }),

  // ✅ GET /orders/seller/export → CSV
  http.get(`${BASE}/orders/seller/export`, () =>
    new HttpResponse(
      'order_id,buyer_name,status,total_uzs\n019ee39b-928c-7404-a66d-29ee87646f27,"Mock Buyer",paid,150000\n',
      { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8' } },
    ),
  ),

  // ✅ POST /orders/seller/bulk-ship → {success, processed}
  http.post(`${BASE}/orders/seller/bulk-ship`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { order_ids?: string[] }
    return HttpResponse.json({ success: true, processed: body.order_ids?.length ?? 0 })
  }),

  // ✅ POST /orders/seller/bulk-arrange → {success, processed}
  http.post(`${BASE}/orders/seller/bulk-arrange`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { order_ids?: string[] }
    return HttpResponse.json({ success: true, processed: body.order_ids?.length ?? 0 })
  }),

  // ✅ POST /orders/seller/shipping-documents → {pdf_url, download_url}
  http.post(`${BASE}/orders/seller/shipping-documents`, () =>
    HttpResponse.json(
      { pdf_url: '#mock-download', download_url: '#mock-download', order_count: 1, types_generated: ['shipping_label'] },
      { status: 201 },
    ),
  ),

  // ✅ GET /sellers/me/orders/mass-ship — backend snake_case shape (adapted by getMassShipOrders)
  http.get(`${BASE}/sellers/me/orders/mass-ship`, () => {
    const orders = MASS_SHIP_ITEMS.map((o) => ({
      id: o.id,
      buyer_name: o.buyerName,
      channel: o.channel ? { id: 'ch-mock', name: o.channel } : null,
      confirmed_time: o.confirmedTime,
      ship_by_deadline: null,
      deadline_bucket: 'beyond_24h',
      order_status: o.orderStatus,
      shipping_arranged: o.shippingArranged,
      tracking_number: o.trackingNumber ?? null,
      label_printed_at: o.labelPrintedAt ?? null,
      items: [{ title: { uz: o.productName, ru: o.productName, en: o.productName }, quantity: 1, image_url: o.productThumbnail ?? '' }],
    }))
    return HttpResponse.json({
      orders,
      total: orders.length,
      deadline_counts: { overdue: 0, within_24h: 1, beyond_24h: 1 },
      channel_counts: [
        { channel_id: 'c1', channel_name: 'Yandex Delivery', count: 0 },
        { channel_id: 'c2', channel_name: 'CDEK', count: 1 },
        { channel_id: 'c3', channel_name: 'Self-Delivery', count: 1 },
      ],
    })
  }),

  // ✅ POST /sellers/me/orders/mass-ship — bulk-arrange job → {job_id, status, order_count}
  http.post(`${BASE}/sellers/me/orders/mass-ship`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { order_ids?: string[] }
    return HttpResponse.json(
      { job_id: 'job-mock', status: 'completed', order_count: body.order_ids?.length ?? 0 },
      { status: 201 },
    )
  }),

  // ✅ GET /returns/seller?status= — backend shape (snake_case) + summary
  http.get(`${BASE}/returns/seller`, ({ request }) => {
    const status = new URL(request.url).searchParams.get('status')
    const requests = status && status !== 'all'
      ? BACKEND_RETURNS.filter((r) => r.status === status)
      : BACKEND_RETURNS
    const count = (s: string) => BACKEND_RETURNS.filter((r) => r.status === s).length
    const summary = {
      all: BACKEND_RETURNS.length, requested: count('requested'), approved: count('approved'),
      refunded: count('refunded'), rejected: count('rejected'), disputed: count('disputed'), closed: 0,
    }
    return HttpResponse.json({ requests, total: requests.length, summary })
  }),

  // ✅ GET /returns/seller/export → CSV (MUST precede the /:id matcher)
  http.get(`${BASE}/returns/seller/export`, () =>
    new HttpResponse('return_id,order_id,status\n', { status: 200, headers: { 'Content-Type': 'text/csv' } }),
  ),

  // ✅ GET /returns/seller/:id — backend detail shape (items[] + events[])
  http.get(`${BASE}/returns/seller/:id`, ({ params }) => {
    const r = BACKEND_RETURNS.find((x) => x.id === params.id) ?? BACKEND_RETURNS[0]
    return HttpResponse.json({
      id: r.id, order_id: r.order_id, buyer_name: r.buyer_name, buyer_phone: '+998 90 *** ** 33',
      type: r.type, reason_code: r.reason_code, reason_text: r.reason_text, status: r.status,
      refund_uzs: r.refund_uzs, dispute_text: r.status === 'disputed' ? 'Mahsulot ishlatilgan edi' : null,
      created_at: r.created_at,
      items: [{
        product_id: 'p2', title: r.product_title, image_urls: [],
        quantity: r.quantity, unit_price_uzs: r.refund_uzs, variant_label: '',
      }],
      events: [{ type: 'new_request', actor: 'buyer', note: r.reason_text, created_at: r.created_at }],
    })
  }),

  // ✅ POST /returns/seller/:id/dispute
  http.post(`${BASE}/returns/seller/:id/dispute`, ({ params }) =>
    HttpResponse.json({ id: params.id, status: 'disputed' }),
  ),

  // ✅ POST /returns/seller/:id/approve → {status, refund_uzs}
  http.post(`${BASE}/returns/seller/:id/approve`, ({ params }) =>
    HttpResponse.json({ id: params.id, status: 'refunded', refund_uzs: 150000 }),
  ),

  // ✅ POST /returns/seller/:id/reject → {status}
  http.post(`${BASE}/returns/seller/:id/reject`, ({ params }) =>
    HttpResponse.json({ id: params.id, status: 'rejected' }),
  ),

  // ✅ Return key-actions (Wave 6)
  http.post(`${BASE}/returns/seller/:id/reply`, () => HttpResponse.json({ success: true })),
  http.post(`${BASE}/returns/seller/:id/evidence`, () => HttpResponse.json({ success: true, evidence_urls: [] })),
  http.post(`${BASE}/returns/seller/:id/retrieve`, () => HttpResponse.json({ success: true })),
  http.post(`${BASE}/returns/seller/:id/inspect`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { result?: string }
    return HttpResponse.json({ success: true, result: body.result ?? 'pass' })
  }),
]

