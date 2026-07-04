// Order domain types — NO enums (erasableSyntaxOnly), string-union + as-const arrays only.
// Money is integer UZS end-to-end.

// ── Order statuses ────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'all'
  | 'unpaid'
  | 'to_ship'
  | 'shipping'
  | 'completed'
  | 'cancellation'
  | 'return_refund'

export type OrderSubStatus = 'all' | 'to_process' | 'processed' | 'to_respond' | 'cancelled'

export const ORDER_STATUSES: OrderStatus[] = [
  'all', 'unpaid', 'to_ship', 'shipping', 'completed', 'cancellation', 'return_refund',
]
export const TO_SHIP_SUB_STATUSES: OrderSubStatus[] = ['all', 'to_process', 'processed']
export const CANCELLATION_SUB_STATUSES: OrderSubStatus[] = ['all', 'to_respond', 'cancelled']

// ── Return/Refund types ───────────────────────────────────────────────────────
export type ReturnStatus =
  | 'all'
  | 'under_review'
  | 'returning'
  | 'refunded'
  | 'disputed'
  | 'dispute_approved'
  | 'dispute_rejected'
  | 'rejected'
  | 'claimed'

export type ReturnType = 'return_refund' | 'refund_only' | 'cancellation'
export type ReturnPriority = 'all' | 'due_1_day' | 'due_2_days'
export type ReturnPrimaryTab = 'all' | 'return_refund' | 'cancellation'

export const RETURN_STATUSES: ReturnStatus[] = [
  'all', 'under_review', 'returning', 'refunded', 'disputed', 'dispute_approved',
  'dispute_rejected', 'rejected', 'claimed',
]

// ── Core order item (list) ─────────────────────────────────────────────────────
export interface OrderItem {
  id: string
  orderId: string
  buyerName: string
  buyerAvatar?: string
  shop: string
  productName: string
  productThumbnail?: string
  quantity: number
  variation: string
  totalUzs: number
  paymentLabel: string
  status: Exclude<OrderStatus, 'all'>
  subStatus: OrderSubStatus
  deliveryMethod: string
  logisticsProvider: string
  trackingNumber: string
  createdAt: string
  shipByDeadlineSeconds?: number  // remaining seconds; FE counts down; red if <86400
  shippingArranged: boolean
}

export interface OrderListQuery {
  status?: OrderStatus
  subStatus?: OrderSubStatus
  orderId?: string
  shippingChannel?: string
  page?: number
  limit?: number
}

export interface OrderSummary {
  all: number
  unpaid: number
  to_ship: number
  shipping: number
  completed: number
  cancellation: number
  return_refund: number
}

export interface OrderListResponse {
  orders: OrderItem[]
  total: number
  page: number
  limit: number
  summary: OrderSummary
  archiveCutoffDate?: string  // "DD/MM/YYYY" for completed footer
}

// ── Order detail ──────────────────────────────────────────────────────────────
export type OrderEventType =
  | 'new_order'
  | 'to_ship'
  | 'shipped'
  | 'buyer_confirmed'
  | 'fund_transfer_completed'
  // backend timeline event types (GET /orders/seller/{id}/timeline)
  | 'placed'
  | 'paid'
  | 'shipping_arranged'
  | 'delivered'
  | 'cancelled'

export interface OrderEvent {
  id: string
  eventType: OrderEventType
  timestamp: string
  actor: 'buyer' | 'seller' | 'platform' | 'system'
  description?: string
  active: boolean
}

export interface OrderAdjustment {
  id: string
  date: string
  reason: string
  releasedAmountUzs: number
}

export interface OrderDetailItem {
  id: string
  no: number
  productName: string
  productThumbnail?: string
  variation: string
  unitPriceUzs: number
  quantity: number
  subtotalUzs: number
}

export interface OrderDetailsResponse {
  id: string
  orderId: string
  buyerName: string
  buyerPhone?: string   // seller-scoped detail exposes buyer contact for delivery
  buyerAvatar?: string
  shop: string
  status: Exclude<OrderStatus, 'all'>
  deliveryAddress: string
  logisticsCarrier: string
  logisticsService: string
  productCount: number
  items: OrderDetailItem[]
  events: OrderEvent[]
  adjustments: OrderAdjustment[]
  merchandiseSubtotalUzs: number
  deliveryFeeUzs: number
  commissionUzs: number        // negative — deducted
  netPayoutUzs: number
  finalAmountUzs: number
  buyerPaymentUzs: number
  trackingNumber: string
  noteText?: string
}

// ── Mass Ship ─────────────────────────────────────────────────────────────────
export type DeadlineBucket = 'all' | 'overdue' | 'within_24h' | 'beyond_24h'

export interface MassShipItem {
  id: string
  orderId: string
  productName: string
  productThumbnail?: string
  buyerName: string
  channel: string
  confirmedTime: string
  orderStatus: string
  trackingNumber?: string
  labelPrintedAt?: string
  shippingArranged: boolean
}

export interface MassShipQuery {
  deadlineBucket?: DeadlineBucket
  channel?: string
  processStatus?: 'all' | 'processed' | 'to_process'
  printStatus?: string
  page?: number
  limit?: number
}

export interface MassShipResponse {
  orders: MassShipItem[]
  total: number
  deadlineCounts: { overdue: number; within_24h: number; beyond_24h: number }
  channelCounts: Record<string, number>
}

// ── Return requests ──────────────────────────────────────────────────────────
export interface ReturnRequest {
  id: string
  requestId: string
  orderId: string
  buyerName: string
  buyerAvatar?: string
  productName: string
  productThumbnail?: string
  variation: string
  quantity: number
  type: ReturnType
  reasonCode: string
  reasonText: string
  refundAmountUzs: number
  adjustedAmountUzs: number
  status: ReturnStatus
  solution: string
  forwardLogistic?: string
  forwardTracking?: string
  dueInHours?: number
  unreadCount: number
  createdAt: string
}

export type ReturnSort = 'newest' | 'oldest' | 'amount'

export interface ReturnListQuery {
  primaryTab?: ReturnPrimaryTab
  status?: ReturnStatus
  priority?: ReturnPriority
  q?: string
  action?: string
  sort?: ReturnSort
  page?: number
  limit?: number
}

// Per-status counters (RET-001) — keyed by client ReturnStatus + `all`.
export type ReturnSummary = Partial<Record<ReturnStatus, number>> & { all: number }

export interface ReturnListResponse {
  requests: ReturnRequest[]
  total: number
  summary: ReturnSummary
}

// ── Return detail ─────────────────────────────────────────────────────────────
export type ReturnEventType =
  | 'new_request'
  | 'under_review'
  | 'dispute_submitted'
  | 'platform_reviewing'
  | 'dispute_approved'
  | 'dispute_rejected'
  | 'refunded'
  | 'returned'

export interface ReturnEvent {
  id: string
  eventType: ReturnEventType
  timestamp: string
  active: boolean
}

export interface ReturnDetailResponse {
  id: string
  requestId: string
  orderId: string
  buyerName: string
  buyerAvatar?: string
  status: ReturnStatus
  statusText: string
  refundAmountUzs: number
  adjustedAmountUzs: number
  reasonCode: string
  reasonText: string
  buyerEvidenceUrls: string[]
  disputeText?: string
  disputeEvidenceUrls: string[]
  deliveryAddress: string
  logisticsCarrier: string
  logisticsService: string
  trackingNumber: string
  productName: string
  productThumbnail?: string
  productPriceUzs: number
  variation: string
  quantity: number
  events: ReturnEvent[]
}

// ── Tracking step (kept for backward compat) ──────────────────────────────────
export interface OrderTrackingStep {
  id: string
  title: string
  date: string
  time: string
  completed: boolean
}

// ── Payment summary (kept for backward compat) ────────────────────────────────
export interface OrderDetailProduct {
  id: string
  productName: string
  quantity: number
  variation: string
  unitPriceUzs: number
  subtotalUzs: number
  paymentLabel: string
}

export interface OrderPaymentSummary {
  subtotalUzs: number
  priceUzs: number
  shippingSubtotalUzs: number
  feesAndChargesUzs: number
  orderIncomeUzs: number
}

export interface OrderDetailsResponse_Legacy {
  id: string
  buyerName: string
  shop: string
  status: Exclude<OrderStatus, 'all'>
  orderId: string
  deliveryAddress: string
  logisticsNumber: string
  logisticsDescription: string[]
  product: OrderDetailProduct
  trackingSteps: OrderTrackingStep[]
  paymentSummary: OrderPaymentSummary
}
