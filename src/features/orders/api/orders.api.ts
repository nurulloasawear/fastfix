import { apiClient } from '@/lib/axios'
import { pickLang } from '@/lib/lang'
import type { Language } from '@/i18n'
import type {
  MassShipItem,
  MassShipQuery,
  MassShipResponse,
  OrderDetailsResponse,
  OrderDetailItem,
  OrderEvent,
  OrderItem,
  OrderListQuery,
  OrderListResponse,
  OrderStatus,
  OrderSummary,
  ReturnDetailResponse,
  ReturnListQuery,
  ReturnListResponse,
} from '../types/orders.types'

// ── Route paths ───────────────────────────────────────────────────────────────
// ✅ = real backend route  [PENDING BACKEND] = no endpoint yet, MSW only
export const PATHS = {
  // ✅ Real routes
  list: '/orders/seller',
  detail: (id: string) => `/orders/seller/${id}`,   // seller-scoped — /orders/{id} is buyer-scoped (404s for sellers)
  timeline: (id: string) => `/orders/seller/${id}/timeline`,
  ship: (id: string) => `/orders/${id}/ship`,
  deliver: (id: string) => `/orders/${id}/deliver`,
  cancel: (id: string) => `/orders/${id}/cancel`,
  paymentStatus: (provider: string, orderId: string) => `/payments/${provider}/status/${orderId}`,
  // ✅ Real routes — order-actions composed under /orders/seller/* (shipped 2026-06-20)
  note: (id: string) => `/orders/seller/${id}/notes`,                 // POST {note} → {success,note}
  export: '/orders/seller/export',                                    // GET → CSV stream
  bulkShip: '/orders/seller/bulk-ship',                               // POST {order_ids} → {success,processed}
  bulkArrange: '/orders/seller/bulk-arrange',                         // POST {order_ids,courier} → {success,processed}
  documents: '/orders/seller/shipping-documents',                    // POST {order_ids} → {pdf_url}
  // ✅ Real routes — mass-ship lives on the legacy /sellers/me/* group
  massShip: '/sellers/me/orders/mass-ship',                           // GET list + POST arrange (job)
  shipmentJob: (jobId: string) => `/sellers/me/shipment-jobs/${jobId}`,
  // [PENDING BACKEND] — MSW-only
  invoice: (id: string) => `/seller/orders/${id}/invoice`,
  // ✅ Real routes (returns / refunds / disputes)
  returns: '/returns/seller',
  returnDetail: (id: string) => `/returns/seller/${id}`,
  returnDispute: (id: string) => `/returns/seller/${id}/dispute`,
  returnApprove: (id: string) => `/returns/seller/${id}/approve`,
  returnReject: (id: string) => `/returns/seller/${id}/reject`,
  returnExport: '/returns/seller/export',
  // ✅ key-actions (Wave 6)
  returnReply: (id: string) => `/returns/seller/${id}/reply`,
  returnEvidence: (id: string) => `/returns/seller/${id}/evidence`,
  returnRetrieve: (id: string) => `/returns/seller/${id}/retrieve`,
  returnInspect: (id: string) => `/returns/seller/${id}/inspect`,
} as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function currentLang(): Language {
  return (localStorage.getItem('ozb_seller_lang') ?? 'uz') as Language
}

// Backend status → client OrderStatus (excluding 'all')
// Backend: pending·paid·shipped·delivered·cancelled
// payment_status: unpaid·paid·refunded
function mapBackendStatus(
  status: string,
  paymentStatus: string,
): Exclude<OrderStatus, 'all'> {
  if (status === 'pending' && paymentStatus === 'unpaid') return 'unpaid'
  if (status === 'pending' || status === 'paid') return 'to_ship'
  if (status === 'shipped') return 'shipping'
  if (status === 'delivered') return 'completed'
  if (status === 'cancelled') return 'cancellation'
  // Fallback — surface unknown statuses as-is (safe cast)
  return 'to_ship'
}

// Client OrderStatus tab → backend status query value.
// Backend statuses: pending·paid·shipped·delivered·cancelled.
// 'all' → no ?status param. 'return_refund' → backend filters orders that have a return.
function clientStatusToBackend(status?: OrderStatus): string | undefined {
  switch (status) {
    case 'unpaid':        return 'pending'
    case 'to_ship':       return 'paid'
    case 'shipping':      return 'shipped'
    case 'completed':     return 'delivered'
    case 'cancellation':  return 'cancelled'
    case 'return_refund': return 'return_refund'
    default:              return undefined   // 'all'
  }
}

// Map a backend payment_method string to a display label
function mapPaymentLabel(method: string): string {
  const labels: Record<string, string> = {
    click: 'Click',
    payme: 'Payme',
    atmos: 'Atmos',
    atmos_uzcard: 'Atmos (UzCard)',
    atmos_humo: 'Atmos (Humo)',
    uzum_nasiya: 'Uzum Nasiya',
    cod: 'Naqd',
  }
  return labels[method] ?? method
}

// ── Backend DTOs ──────────────────────────────────────────────────────────────
// These stay inside this file — never leak past the api boundary.

interface BackendLangMap {
  uz?: string
  ru?: string
  en?: string
}

// Preview item embedded in the list response (lightweight: title + qty + thumb).
interface BackendOrderListPreviewItem {
  title: BackendLangMap
  quantity: number
  image_url: string
}

interface BackendOrderListItem {
  id: string
  user_id: string
  buyer_name: string
  status: string
  total_uzs: number
  payment_method: string
  payment_status: string
  created_at: string
  item_count: number
  units: number
  items: BackendOrderListPreviewItem[]
}

// Backend list summary buckets (raw order statuses).
interface BackendOrderSummary {
  all: number
  pending: number
  paid: number
  shipped: number
  delivered: number
  cancelled: number
  return_refund?: number
}

interface BackendOrderListResponse {
  orders: BackendOrderListItem[]
  summary: BackendOrderSummary
  pagination?: { page: number; limit: number; total: number; pages: number }
}

// GET /orders/seller/{id}/timeline → {events:[{status,type,actor,note,created_at}]}
interface BackendTimelineEvent {
  status: string
  type: string
  actor: string
  note: string
  created_at: string
}

interface BackendOrderDetailItem {
  product_id: string
  title: BackendLangMap
  quantity: number
  unit_price_uzs: number
  image_urls: string[]
  variant_label: string
}

interface BackendOrderDetail {
  id: string
  user_id: string
  buyer_name: string
  buyer_phone: string
  seller_id: string
  status: string
  total_uzs: number
  payment_method: string | null
  payment_status: string
  created_at: string
  shipping_address: string
  logistics_carrier?: string
  logistics_service?: string
  tracking_number?: string
  items: BackendOrderDetailItem[]
}

interface BackendShipActionResponse {
  id: string
  status: string
}

interface BackendPaymentStatusResponse {
  status: string
  state?: string
}

// Mass-ship list (live GET /sellers/me/orders/mass-ship).
interface BackendMassShipOrder {
  id: string
  buyer_name: string
  channel: { id: string; name: string } | null
  confirmed_time: string
  ship_by_deadline: string | null
  deadline_bucket: string
  order_status: string
  shipping_arranged?: boolean
  tracking_number?: string | null
  label_printed_at?: string | null
  items: { title: BackendLangMap; quantity: number; image_url: string }[]
}

interface BackendMassShipListResponse {
  orders: BackendMassShipOrder[]
  total: number
  deadline_counts: { overdue: number; within_24h: number; beyond_24h: number }
  channel_counts: { channel_id: string; channel_name: string; count: number }[]
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapListItem(raw: BackendOrderListItem): OrderItem {
  const lang = currentLang()
  const clientStatus = mapBackendStatus(raw.status, raw.payment_status)
  const preview = raw.items[0]
  // For multi-item orders, surface the first item title + a "+N more" hint via variation.
  const productName = preview ? pickLang(preview.title, lang) : '—'
  const extraItems = raw.item_count > 1 ? raw.item_count - 1 : 0
  return {
    id: raw.id,
    orderId: raw.id,             // UUIDv7; display as orderId (no separate short ID in BE yet)
    buyerName: raw.buyer_name,   // ✅ real buyer name from list endpoint
    buyerAvatar: undefined,
    shop: 'ozb',
    productName,                 // ✅ first preview item title (lang-resolved)
    productThumbnail: preview?.image_url || undefined,
    quantity: raw.units,         // ✅ total units across all line items
    variation: extraItems > 0 ? `+${extraItems}` : '—', // multi-item hint; single → none
    totalUzs: raw.total_uzs,
    paymentLabel: mapPaymentLabel(raw.payment_method),
    status: clientStatus,
    subStatus: 'all',            // sub-status filters are [PENDING BACKEND] → default
    deliveryMethod: '—',
    logisticsProvider: '—',
    trackingNumber: '—',
    createdAt: raw.created_at,
    shipByDeadlineSeconds: undefined,
    shippingArranged: clientStatus !== 'to_ship',
  }
}

// Backend summary buckets (raw statuses) → client OrderSummary tabs.
// return_refund has no backend status yet → 0 ([PENDING BACKEND]).
function mapSummary(raw: BackendOrderSummary): OrderSummary {
  return {
    all: raw.all,
    unpaid: raw.pending,
    to_ship: raw.paid,
    shipping: raw.shipped,
    completed: raw.delivered,
    cancellation: raw.cancelled,
    return_refund: raw.return_refund ?? 0,
  }
}

function mapDetailItem(raw: BackendOrderDetailItem, index: number): OrderDetailItem {
  const lang = currentLang()
  return {
    id: `${raw.product_id}-${index}`,
    no: index + 1,
    productName: pickLang(raw.title, lang),
    productThumbnail: raw.image_urls[0],
    variation: raw.variant_label,
    unitPriceUzs: raw.unit_price_uzs,
    quantity: raw.quantity,
    subtotalUzs: raw.unit_price_uzs * raw.quantity,
  }
}

function mapDetail(raw: BackendOrderDetail): OrderDetailsResponse {
  const items = raw.items.map(mapDetailItem)
  const clientStatus = mapBackendStatus(raw.status, raw.payment_status)
  const merchandiseSubtotal = items.reduce((acc, i) => acc + i.subtotalUzs, 0)
  const deliveryFee = 35000            // not in DTO → sensible default
  const commission = Math.round(merchandiseSubtotal * 0.05)
  const netPayout = merchandiseSubtotal + deliveryFee - commission

  return {
    id: raw.id,
    orderId: raw.id,
    buyerName: raw.buyer_name,        // ✅ real buyer name from seller-scoped detail
    buyerPhone: raw.buyer_phone,      // ✅ buyer contact (delivery)
    buyerAvatar: undefined,
    shop: 'ozb',
    status: clientStatus,
    deliveryAddress: raw.shipping_address,
    logisticsCarrier: raw.logistics_carrier || '—',   // ✅ from shipments join (Wave 6)
    logisticsService: raw.logistics_service || '—',
    productCount: items.reduce((acc, i) => acc + i.quantity, 0),
    items,
    events: [
      // Derive a minimal timeline from order status
      {
        id: 'ev-order', eventType: 'new_order', timestamp: raw.created_at,
        actor: 'buyer', active: clientStatus === 'unpaid' || clientStatus === 'to_ship',
      },
      ...(clientStatus === 'shipping' || clientStatus === 'completed' || clientStatus === 'cancellation'
        ? [{ id: 'ev-ship', eventType: 'shipped' as const, timestamp: raw.created_at, actor: 'system' as const, active: clientStatus === 'shipping' }]
        : []),
      ...(clientStatus === 'completed'
        ? [{ id: 'ev-done', eventType: 'buyer_confirmed' as const, timestamp: raw.created_at, actor: 'buyer' as const, active: true }]
        : []),
    ],
    adjustments: [],
    merchandiseSubtotalUzs: merchandiseSubtotal,
    deliveryFeeUzs: deliveryFee,
    commissionUzs: commission,
    netPayoutUzs: netPayout,
    finalAmountUzs: netPayout,
    buyerPaymentUzs: merchandiseSubtotal + deliveryFee,
    trackingNumber: raw.tracking_number || '—',   // ✅ from shipments join (Wave 6)
  }
}

// Live mass-ship list (snake_case) → client MassShipResponse.
function mapMassShip(data: BackendMassShipListResponse): MassShipResponse {
  const lang = currentLang()
  const channelCounts: Record<string, number> = {}
  for (const c of data.channel_counts ?? []) channelCounts[c.channel_name] = c.count
  return {
    orders: (data.orders ?? []).map((o): MassShipItem => {
      const first = o.items?.[0]
      return {
        id: o.id,
        orderId: o.id,
        productName: first ? pickLang(first.title, lang) : '—',
        productThumbnail: first?.image_url || undefined,
        buyerName: o.buyer_name,
        channel: o.channel?.name ?? '—',
        confirmedTime: o.confirmed_time,
        orderStatus: o.order_status,
        trackingNumber: o.tracking_number ?? undefined,
        labelPrintedAt: o.label_printed_at ?? undefined,
        shippingArranged: o.shipping_arranged ?? o.order_status === 'processed',
      }
    }),
    total: data.total ?? 0,
    deadlineCounts: data.deadline_counts ?? { overdue: 0, within_24h: 0, beyond_24h: 0 },
    channelCounts,
  }
}

// ── API functions ─────────────────────────────────────────────────────────────

// ✅ GET /orders/seller?status=&limit=&offset=
export async function getOrders(query: OrderListQuery): Promise<OrderListResponse> {
  const page = query.page ?? 1
  const limit = query.limit ?? 20
  // Server-side status filter: map the client tab to a backend status.
  // 'all' / 'return_refund' → no param (return_refund has no backend route yet).
  const backendStatus = clientStatusToBackend(query.status)

  const { data } = await apiClient.get<BackendOrderListResponse>(PATHS.list, {
    params: {
      status: backendStatus,           // omitted by axios when undefined
      q: query.orderId || undefined,   // ✅ server-side search (order-id / buyer / phone)
      limit,
      offset: (page - 1) * limit,
    },
  })

  const orders = data.orders.map(mapListItem)
  const summary = mapSummary(data.summary)
  // Prefer the backend pagination.total (reflects the active status+q filter);
  // fall back to the summary bucket for the tab.
  const total = data.pagination?.total
    ?? (query.status && query.status !== 'all' ? summary[query.status] : summary.all)

  return {
    orders,
    total,
    page,
    limit,
    summary,                           // ✅ driven by backend summary{all,pending,…,cancelled}
    archiveCutoffDate: undefined,
  }
}

// ✅ GET /orders/seller/{id}/timeline → lifecycle events (real, not synthetic).
export async function getOrderTimeline(id: string): Promise<OrderEvent[]> {
  const { data } = await apiClient.get<{ events: BackendTimelineEvent[] }>(PATHS.timeline(id))
  const actors: OrderEvent['actor'][] = ['buyer', 'seller', 'platform', 'system']
  return (data.events ?? []).map((e, i, arr) => ({
    id: `ev-${i}`,
    eventType: e.type as OrderEvent['eventType'],
    timestamp: e.created_at,
    actor: actors.includes(e.actor as OrderEvent['actor']) ? (e.actor as OrderEvent['actor']) : 'system',
    description: e.note || undefined,
    active: i === arr.length - 1,
  }))
}

// ✅ POST /orders/seller/bulk-ship {order_ids} → {success, processed}
export async function bulkShipOrders(orderIds: string[]): Promise<{ processed: number }> {
  const { data } = await apiClient.post<{ processed: number }>(PATHS.bulkShip, { order_ids: orderIds })
  return { processed: data.processed ?? 0 }
}

// ✅ POST /orders/seller/bulk-arrange {order_ids, courier} → {success, processed}
export async function bulkArrangeOrders(orderIds: string[], courier = ''): Promise<{ processed: number }> {
  const { data } = await apiClient.post<{ processed: number }>(PATHS.bulkArrange, { order_ids: orderIds, courier })
  return { processed: data.processed ?? 0 }
}

// ✅ GET /orders/seller/{id}  — seller-scoped (NOT /orders/{id}, which is buyer-scoped)
export async function getOrderDetails(id: string): Promise<OrderDetailsResponse> {
  const { data } = await apiClient.get<BackendOrderDetail>(PATHS.detail(id))
  return mapDetail(data)
}

// ✅ POST /orders/{id}/ship
export async function shipOrder(id: string): Promise<BackendShipActionResponse> {
  const { data } = await apiClient.post<BackendShipActionResponse>(PATHS.ship(id))
  return data
}

// ✅ POST /orders/{id}/deliver
export async function deliverOrder(id: string): Promise<BackendShipActionResponse> {
  const { data } = await apiClient.post<BackendShipActionResponse>(PATHS.deliver(id))
  return data
}

// ✅ POST /orders/{id}/cancel
export async function cancelOrder(id: string): Promise<BackendShipActionResponse> {
  const { data } = await apiClient.post<BackendShipActionResponse>(PATHS.cancel(id))
  return data
}

// ✅ GET /payments/{provider}/status/{order_id}
export async function getPaymentStatus(
  provider: string,
  orderId: string,
): Promise<BackendPaymentStatusResponse> {
  const { data } = await apiClient.get<BackendPaymentStatusResponse>(
    PATHS.paymentStatus(provider, orderId),
  )
  return data
}

// ✅ POST /orders/seller/{id}/notes  {note} → {success, note:{…}}
export async function addOrderNote(id: string, text: string): Promise<void> {
  await apiClient.post(PATHS.note(id), { note: text })
}

// ✅ GET /orders/seller/export → CSV stream. `status` is a CLIENT tab; map to backend.
export async function exportOrders(status?: string): Promise<Blob> {
  const backendStatus =
    status && status !== 'all' && status !== 'return_refund'
      ? clientStatusToBackend(status as OrderStatus)
      : undefined
  const { data } = await apiClient.get<Blob>(PATHS.export, {
    params: { status: backendStatus },
    responseType: 'blob',
  })
  return data
}

// ✅ GET /sellers/me/orders/mass-ship — adapt the live snake_case response.
export async function getMassShipOrders(query: MassShipQuery): Promise<MassShipResponse> {
  const shippingArranged =
    query.processStatus === 'processed' ? 'true'
    : query.processStatus === 'to_process' ? 'false'
    : undefined
  const { data } = await apiClient.get<BackendMassShipListResponse>(PATHS.massShip, {
    params: {
      deadline_bucket: query.deadlineBucket,        // omitted when undefined
      shipping_arranged: shippingArranged,
      limit: query.limit,
      offset: query.page && query.limit ? (query.page - 1) * query.limit : undefined,
    },
  })
  return mapMassShip(data)
}

// ✅ POST /sellers/me/orders/mass-ship — bulk-arrange (creates a job). The page
// ignores the return value; we still surface job_id for callers that poll.
export async function bulkArrangeShipment(
  orderIds: string[],
  method: 'dropoff' | 'pickup',
): Promise<{ jobId: string }> {
  const { data } = await apiClient.post<{ job_id: string }>(PATHS.massShip, {
    order_ids: orderIds,
    method,
  })
  return { jobId: data.job_id }
}

// ✅ POST /orders/seller/shipping-documents  {order_ids} → {pdf_url, download_url}
export async function generateDocuments(
  orderIds: string[],
  types: string[],
): Promise<{ downloadUrl: string }> {
  const { data } = await apiClient.post<{ pdf_url?: string; download_url?: string }>(
    PATHS.documents,
    { order_ids: orderIds, types },
  )
  return { downloadUrl: data.pdf_url ?? data.download_url ?? '' }
}

// ── Returns (✅ real /returns/seller*) — backend DTO → client model ─────────────
type LangMap = Record<string, string>

// backend status → client ReturnStatus
function mapReturnStatus(s: string): ReturnListResponse['requests'][number]['status'] {
  switch (s) {
    case 'requested': return 'under_review'
    case 'approved': return 'returning'
    case 'refunded': return 'refunded'
    case 'rejected': return 'rejected'
    case 'disputed': return 'disputed'
    default: return 'under_review'
  }
}

// client ReturnStatus tab → backend ?status (only mapped statuses filter server-side)
function returnStatusToBackend(s?: string): string | undefined {
  switch (s) {
    case 'under_review': return 'requested'
    case 'returning': return 'approved'
    case 'refunded': return 'refunded'
    case 'rejected': return 'rejected'
    case 'disputed': return 'disputed'
    default: return undefined // 'all' / platform-only statuses → no server filter
  }
}

interface BackendReturnRow {
  id: string; order_id: string; buyer_name: string; type: string
  reason_code: string; reason_text: string; status: string
  refund_uzs: number; quantity: number; product_title: LangMap | null; created_at: string
  due_in_hours?: number; forward_logistic?: string | null; forward_tracking?: string | null
}

// Backend returns counts keyed by backend status → client ReturnStatus tabs.
interface BackendReturnSummary {
  all?: number; requested?: number; approved?: number
  refunded?: number; rejected?: number; disputed?: number; closed?: number
}

function mapReturnSummary(s?: BackendReturnSummary): ReturnListResponse['summary'] {
  return {
    all: s?.all ?? 0,
    under_review: s?.requested ?? 0,
    returning: s?.approved ?? 0,
    refunded: s?.refunded ?? 0,
    rejected: s?.rejected ?? 0,
    disputed: s?.disputed ?? 0,
  }
}

export async function getReturnRequests(query: ReturnListQuery): Promise<ReturnListResponse> {
  // The priority filter is derived client-side from due_in_hours (the backend has no
  // ?priority param), so when it's active we can't trust server pagination/total —
  // fetch the whole set in one page and report the filtered count. ReturnsPanel hides
  // the pager while a priority filter is active. (Datasets here are small.)
  const priorityActive = !!query.priority && query.priority !== 'all'
  const page = query.page ?? 1
  const limit = priorityActive ? 500 : (query.limit ?? 20)
  const offset = priorityActive ? 0 : (page - 1) * limit
  const params: Record<string, string | number> = { limit, offset }
  const st = returnStatusToBackend(query.status)
  if (st) params['status'] = st
  if (query.q) params['q'] = query.q
  const { data } = await apiClient.get<{ requests: BackendReturnRow[]; total: number; summary?: BackendReturnSummary }>(
    PATHS.returns, { params },
  )
  const lang = currentLang()
  let requests = (data.requests ?? []).map((r) => ({
    id: r.id,
    requestId: r.id.slice(0, 8).toUpperCase(),
    orderId: r.order_id,
    buyerName: r.buyer_name,
    productName: pickLang(r.product_title, lang),
    variation: '',
    quantity: r.quantity,
    type: (r.type === 'return_refund' ? 'return_refund' : 'refund_only') as ReturnListResponse['requests'][number]['type'],
    reasonCode: r.reason_code,
    reasonText: r.reason_text,
    refundAmountUzs: r.refund_uzs,
    adjustedAmountUzs: r.refund_uzs,
    status: mapReturnStatus(r.status),
    solution: r.type,
    forwardLogistic: r.forward_logistic ?? undefined,
    forwardTracking: r.forward_tracking ?? undefined,
    dueInHours: r.due_in_hours,
    unreadCount: 0,
    createdAt: r.created_at,
  }))

  // Priority filter (RET-002) — derive from due_in_hours when the backend supplies it.
  if (query.priority === 'due_1_day') requests = requests.filter((r) => (r.dueInHours ?? Infinity) <= 24)
  else if (query.priority === 'due_2_days') requests = requests.filter((r) => (r.dueInHours ?? Infinity) <= 48)

  // Sort (RT-009) — backend default is newest-first.
  if (query.sort === 'oldest') requests = [...requests].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  else if (query.sort === 'amount') requests = [...requests].sort((a, b) => b.refundAmountUzs - a.refundAmountUzs)

  // total must match what's displayed: filtered count when priority-filtering, else the backend total.
  const total = priorityActive ? requests.length : (data.total ?? requests.length)
  return { requests, total, summary: mapReturnSummary(data.summary) }
}

// ✅ POST /returns/seller/{id}/approve → {status, refund_uzs}
export async function approveReturn(id: string): Promise<void> {
  await apiClient.post(PATHS.returnApprove(id))
}

// ✅ POST /returns/seller/{id}/reject {note} → {status}
export async function rejectReturn(id: string, note: string): Promise<void> {
  await apiClient.post(PATHS.returnReject(id), { note })
}

// ✅ Key-actions (Wave 6)
export async function replyToReturn(id: string, message: string): Promise<void> {
  await apiClient.post(PATHS.returnReply(id), { message })
}
export async function submitReturnEvidence(id: string, evidenceUrls: string[]): Promise<void> {
  await apiClient.post(PATHS.returnEvidence(id), { evidence_urls: evidenceUrls })
}
export async function retrieveReturnParcel(id: string): Promise<void> {
  await apiClient.post(PATHS.returnRetrieve(id))
}
export async function inspectReturnProduct(id: string, result: string, note = ''): Promise<void> {
  await apiClient.post(PATHS.returnInspect(id), { result, note })
}

// ✅ GET /returns/seller/export → CSV. `status` is a client ReturnStatus tab.
export async function exportReturns(status?: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(PATHS.returnExport, {
    params: { status: returnStatusToBackend(status) },
    responseType: 'blob',
  })
  return data
}

interface BackendReturnDetail {
  id: string; order_id: string; buyer_name: string; type: string
  reason_code: string; reason_text: string; status: string; refund_uzs: number
  dispute_text: string | null; created_at: string
  // optional — populated once the backend DTO ships these (Wave 6).
  buyer_evidence_urls?: string[]; dispute_evidence_urls?: string[]
  delivery_address?: string
  forward_carrier?: string; forward_service?: string; tracking_number?: string
  items: { product_id: string; title: LangMap; image_urls: string[]; quantity: number; unit_price_uzs: number; variant_label: string }[]
  events: { type: string; actor: string; note: string; created_at: string }[]
}

export async function getReturnDetail(id: string): Promise<ReturnDetailResponse> {
  const { data } = await apiClient.get<BackendReturnDetail>(PATHS.returnDetail(id))
  const lang = currentLang()
  const first = data.items?.[0]
  const events = (data.events ?? []).map((e, i, arr) => ({
    id: `ev-${i}`,
    eventType: e.type as ReturnDetailResponse['events'][number]['eventType'],
    timestamp: e.created_at,
    active: i === arr.length - 1,
  }))
  return {
    id: data.id,
    requestId: data.id.slice(0, 8).toUpperCase(),
    orderId: data.order_id,
    buyerName: data.buyer_name,
    status: mapReturnStatus(data.status),
    statusText: data.status,
    refundAmountUzs: data.refund_uzs,
    adjustedAmountUzs: data.refund_uzs,
    reasonCode: data.reason_code,
    reasonText: data.reason_text,
    buyerEvidenceUrls: data.buyer_evidence_urls ?? [],
    disputeText: data.dispute_text ?? undefined,
    disputeEvidenceUrls: data.dispute_evidence_urls ?? [],
    deliveryAddress: data.delivery_address ?? '',
    logisticsCarrier: data.forward_carrier ?? '',
    logisticsService: data.forward_service ?? '',
    trackingNumber: data.tracking_number ?? '',
    productName: pickLang(first?.title, lang),
    productThumbnail: first?.image_urls?.[0],
    productPriceUzs: first?.unit_price_uzs ?? 0,
    variation: first?.variant_label ?? '',
    quantity: first?.quantity ?? 0,
    events,
  }
}

// ✅ POST /returns/seller/{id}/dispute (was PUT to the legacy mock path)
export async function submitReturnDispute(
  id: string,
  disputeText: string,
  evidenceUrls: string[],
): Promise<void> {
  await apiClient.post(PATHS.returnDispute(id), { dispute_text: disputeText, evidence_urls: evidenceUrls })
}

// ✅ Backward-compat — POST /sellers/me/orders/mass-ship → {order_count}.
export async function massShipOrders(orderIds: string[]): Promise<{ shipped: number }> {
  const { data } = await apiClient.post<{ order_count: number }>(PATHS.massShip, {
    order_ids: orderIds,
    method: 'dropoff',
  })
  return { shipped: data.order_count }
}
