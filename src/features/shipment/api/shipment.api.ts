import { apiClient } from '@/lib/axios'
import type {
  CourierIntegration,
  MassShipListResponse,
  MassShipOrder,
  MassShipRequest,
  MassShipResponse,
  ShipmentListQuery,
  ShipmentListResponse,
  ShippingSettings,
} from '../types/shipment.types'

// ---------------------------------------------------------------------------
// Path constants
// All paths are relative to apiClient baseURL = /api/v1
// ---------------------------------------------------------------------------
const PATHS = {
  // [MOCK] No dedicated shipment-listing route on the backend yet — served by
  // shipment.mocks.ts.  Keeping the mock path so MSW intercepts it.
  list: '/seller/shipments',

  // ✅ LIVE — advance an order from "paid" to "shipped"
  ship: (orderId: string) => `/orders/${orderId}/ship`,

  // ✅ LIVE — mark a shipped order as delivered
  deliver: (orderId: string) => `/orders/${orderId}/deliver`,

  // ✅ LIVE — mass-ship candidates list + bulk arrange action
  massShipList: '/sellers/me/orders/mass-ship',
  massShip: '/sellers/me/orders/mass-ship',

  // ✅ LIVE — poll async bulk-arrange job
  shipmentJob: (jobId: string) => `/sellers/me/shipment-jobs/${jobId}`,

  // ✅ LIVE — generate shipping documents (labels, packing-lists)
  documentsGenerate: '/sellers/me/documents/generate',

  // ✅ LIVE — shipping channels (grouped list) + per-channel toggle
  shippingChannels: '/sellers/me/shipping/channels',
  shippingChannelToggle: (channelId: string) =>
    `/sellers/me/shipping/channels/${channelId}/toggle`,

  // ✅ LIVE — seller pickup / return addresses (CRUD)
  addresses: '/sellers/me/addresses',
  address: (id: string) => `/sellers/me/addresses/${id}`,
  addressSettings: '/sellers/me/addresses/settings',

  // ✅ LIVE — pickup schedule (Mon-Sun + public holidays)
  operatingHours: '/sellers/me/operating-hours',

  // ✅ LIVE — shop settings (thermal printing, auto-confirm days …)
  shopSettings: '/sellers/me/settings',

  // ✅ LIVE — orders export (CSV) + export history
  ordersExport: '/sellers/me/orders/export',
  ordersExportHistory: '/sellers/me/orders/export/history',

  // ✅ LIVE — return-fee coverage summary
  returnFeeCoverage: '/sellers/me/return-fee-coverage',

  // ✅ LIVE — seller performance KPIs
  nonFulfilmentRate: '/sellers/me/non-fulfilment-rate',
} as const

// ---------------------------------------------------------------------------
// Backend response shapes (snake_case — not exported; internal adapters only)
// ---------------------------------------------------------------------------

interface BackendChannelGroup {
  group: string
  label: { uz: string; ru: string; en: string }
  channels: BackendChannel[]
}

interface BackendChannel {
  id: string
  name: string
  description: string
  enabled: boolean
  estimated_days_min: number
  estimated_days_max: number
  max_weight_kg: number
  fee_type: string
  base_fee_uzs: number
}

interface BackendShippingChannelsResponse {
  groups: BackendChannelGroup[]
}

interface BackendMassShipOrder {
  id: string
  buyer_name: string
  channel: { id: string; name: string } | null
  confirmed_time: string
  ship_by_deadline: string | null
  deadline_bucket: string
  order_status: string
  items: Array<{
    title: { uz: string; ru: string; en: string }
    quantity: number
    image_url: string
  }>
}

interface BackendMassShipListResponse {
  orders: BackendMassShipOrder[]
  total: number
  deadline_counts: { overdue: number; within_24h: number; beyond_24h: number }
  channel_counts: Array<{ channel_id: string; channel_name: string; count: number }>
}

interface BackendMassShipJobResponse {
  job_id: string
  status: 'completed' | 'processing' | 'failed'
  processed: number
  failed: number
  errors: unknown[]
}

// POST /sellers/me/orders/mass-ship returns a lightweight trigger response.
interface BackendMassShipTriggerResponse {
  job_id: string
  status: string
  order_count: number
}

interface BackendDocumentGenerateResponse {
  download_url: string
  expires_at: string
  order_count: number
  types_generated: string[]
}

// ---------------------------------------------------------------------------
// Backend address shapes
// ---------------------------------------------------------------------------
export interface SellerAddress {
  id: string
  label: string
  full_name: string
  phone: string
  region: string
  district: string
  street: string
  house: string
  flat: string
  postal_code: string
  is_default: boolean
  is_pickup: boolean
  is_return: boolean
  created_at?: string
  updated_at?: string
}

export interface SellerAddressInput {
  label?: string
  full_name: string
  phone: string
  region: string
  district?: string
  street: string
  house?: string
  flat?: string
  postal_code?: string
  is_default?: boolean
  is_pickup?: boolean
  is_return?: boolean
}

export interface SellerAddressesResponse {
  addresses: SellerAddress[]
  show_full_pickup_address: boolean
}

// ---------------------------------------------------------------------------
// Operating hours
// ---------------------------------------------------------------------------
export interface OperatingHourDay {
  day_of_week: number
  day_label?: string
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export interface OperatingHoursResponse {
  schedule: OperatingHourDay[]
}

// ---------------------------------------------------------------------------
// Shop settings
// ---------------------------------------------------------------------------
export interface ShopSettings {
  thermal_printing_enabled: boolean
  show_full_pickup_address: boolean
  auto_confirm_days: number
}

// ---------------------------------------------------------------------------
// Orders export
// ---------------------------------------------------------------------------
export interface ExportHistoryEntry {
  id: string
  created_at: string
  status: 'pending' | 'ready' | 'failed'
  download_url: string
  filters_applied: Record<string, string>
}

export interface ExportHistoryResponse {
  exports: ExportHistoryEntry[]
}

// ---------------------------------------------------------------------------
// Return fee coverage
// ---------------------------------------------------------------------------
export interface ReturnFeeCoverageResponse {
  enrolled: boolean
  coverage_cap_uzs: number
  total_covered_uzs: number
  covered_returns_count: number
}

// ---------------------------------------------------------------------------
// Non-fulfilment rate
// ---------------------------------------------------------------------------
export interface NonFulfilmentRateResponse {
  non_fulfilment_rate: number
  cancellation_rate: number
  return_rate: number
  period_days: number
  calculated_at: string
}

// ---------------------------------------------------------------------------
// Channel toggle
// ---------------------------------------------------------------------------
export interface ChannelToggleResponse {
  channel_id: string
  enabled: boolean
}

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

/** Flatten channel groups into a CourierIntegration[] the FE types expect. */
function adaptChannelsToCouriers(groups: BackendChannelGroup[]): CourierIntegration[] {
  return groups.flatMap((g) =>
    g.channels.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      enabled: c.enabled,
    })),
  )
}

/** Map a backend mass-ship order to the FE MassShipOrder type. */
function adaptMassShipOrder(o: BackendMassShipOrder): MassShipOrder {
  const firstItem = o.items[0]
  const productName = firstItem
    ? firstItem.title.uz || firstItem.title.ru || firstItem.title.en
    : ''
  return {
    id: o.id,
    orderId: o.id,        // backend uses order id directly (no separate shipment id yet)
    reference: `#${o.id.slice(-6).toUpperCase()}`,
    productName,
    weightKg: 0,          // not returned by mass-ship list; default sensibly
  }
}

// ---------------------------------------------------------------------------
// API functions — existing (kept for backward compat)
// ---------------------------------------------------------------------------

export async function getShipments(query: ShipmentListQuery): Promise<ShipmentListResponse> {
  // [MOCK] No backend shipment-list route yet. MSW intercepts /seller/shipments.
  const { data } = await apiClient.get<ShipmentListResponse>(PATHS.list, { params: query })
  return data
}

export async function shipOrder(orderId: string): Promise<void> {
  await apiClient.post(PATHS.ship(orderId))
}

export async function deliverOrder(orderId: string): Promise<void> {
  await apiClient.post(PATHS.deliver(orderId))
}

/** GET /sellers/me/orders/mass-ship — adapts real response to FE MassShipListResponse. */
export async function getMassShipOrders(): Promise<MassShipListResponse> {
  const { data } = await apiClient.get<BackendMassShipListResponse>(PATHS.massShipList)
  return {
    orders: data.orders.map(adaptMassShipOrder),
    total: data.total,
  }
}

/**
 * POST /sellers/me/orders/mass-ship
 * FE sends { orderIds, action }; backend expects { order_ids, method, channel_id }.
 * action='hand_to_courier' → method='dropoff'; action='print_receipts' → method='print'.
 * Returns { processed } from job order_count.
 */
export async function massShip(body: MassShipRequest): Promise<MassShipResponse> {
  const method = body.action === 'hand_to_courier' ? 'dropoff' : 'print'
  const { data } = await apiClient.post<BackendMassShipTriggerResponse>(PATHS.massShip, {
    order_ids: body.orderIds,
    method,
  })
  return { processed: data.order_count }
}

/**
 * GET /sellers/me/shipping/channels — channels grouped by type.
 * Adapted to flat ShippingSettings { warehouseAddress, couriers[] } to avoid
 * changing the ShippingSettingsForm component.
 * warehouseAddress is fetched from /sellers/me/addresses (first pickup address).
 */
export async function getShippingSettings(): Promise<ShippingSettings> {
  const [channelsRes, addressesRes] = await Promise.all([
    apiClient.get<BackendShippingChannelsResponse>(PATHS.shippingChannels),
    apiClient.get<SellerAddressesResponse>(PATHS.addresses),
  ])

  const couriers = adaptChannelsToCouriers(channelsRes.data.groups)

  const pickupAddress = addressesRes.data.addresses.find((a) => a.is_pickup)
  const warehouseAddress = pickupAddress
    ? [pickupAddress.region, pickupAddress.district, pickupAddress.street, pickupAddress.house]
        .filter(Boolean)
        .join(', ')
    : ''

  return { warehouseAddress, couriers }
}

/**
 * PUT /seller/shipments/settings (old mock path) → now fans out to real endpoints.
 * For each courier whose enabled state differs, calls the toggle endpoint.
 * warehouseAddress changes are ignored here (addresses managed separately).
 */
export async function updateShippingSettings(input: ShippingSettings): Promise<ShippingSettings> {
  // Toggle each courier independently.
  await Promise.all(
    input.couriers.map((c) =>
      apiClient
        .post<ChannelToggleResponse>(PATHS.shippingChannelToggle(c.id), { enabled: c.enabled })
        .catch(() => null), // best-effort; ignore individual failures
    ),
  )
  // Re-fetch authoritative state to return accurate data.
  return getShippingSettings()
}

// ---------------------------------------------------------------------------
// API functions — new (wired to live endpoints)
// ---------------------------------------------------------------------------

/** GET /sellers/me/shipment-jobs/:job_id — poll bulk-arrange job. */
export async function getShipmentJob(jobId: string): Promise<BackendMassShipJobResponse> {
  const { data } = await apiClient.get<BackendMassShipJobResponse>(PATHS.shipmentJob(jobId))
  return data
}

/** POST /sellers/me/documents/generate — generate shipping labels / packing lists. */
export async function generateDocuments(payload: {
  order_ids: string[]
  types: ('shipping_label' | 'packing_list' | 'picklist')[]
  format: 'a4' | 'a6_thermal'
}): Promise<BackendDocumentGenerateResponse> {
  const { data } = await apiClient.post<BackendDocumentGenerateResponse>(
    PATHS.documentsGenerate,
    payload,
  )
  return data
}

/** POST /sellers/me/shipping/channels/:id/toggle — enable / disable a channel. */
export async function toggleShippingChannel(
  channelId: string,
  enabled: boolean,
): Promise<ChannelToggleResponse> {
  const { data } = await apiClient.post<ChannelToggleResponse>(
    PATHS.shippingChannelToggle(channelId),
    { enabled },
  )
  return data
}

/** GET /sellers/me/addresses — list seller pickup / return addresses. */
export async function getAddresses(): Promise<SellerAddressesResponse> {
  const { data } = await apiClient.get<SellerAddressesResponse>(PATHS.addresses)
  return data
}

/** POST /sellers/me/addresses — add a new address. */
export async function createAddress(input: SellerAddressInput): Promise<SellerAddress> {
  const { data } = await apiClient.post<SellerAddress>(PATHS.addresses, input)
  return data
}

/** PUT /sellers/me/addresses/:id — update an existing address. */
export async function updateAddress(id: string, input: SellerAddressInput): Promise<SellerAddress> {
  const { data } = await apiClient.put<SellerAddress>(PATHS.address(id), input)
  return data
}

/** DELETE /sellers/me/addresses/:id — remove an address (204 on success). */
export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(PATHS.address(id))
}

/**
 * PATCH /sellers/me/addresses/settings — toggle show_full_pickup_address.
 * Returns { show_full_pickup_address: boolean }.
 */
export async function updateAddressSettings(
  showFullPickupAddress: boolean,
): Promise<{ show_full_pickup_address: boolean }> {
  const { data } = await apiClient.patch<{ show_full_pickup_address: boolean }>(
    PATHS.addressSettings,
    { show_full_pickup_address: showFullPickupAddress },
  )
  return data
}

/** GET /sellers/me/operating-hours — read pickup schedule. */
export async function getOperatingHours(): Promise<OperatingHoursResponse> {
  const { data } = await apiClient.get<OperatingHoursResponse>(PATHS.operatingHours)
  return data
}

/** PUT /sellers/me/operating-hours — update pickup schedule (upserts all rows). */
export async function updateOperatingHours(
  schedule: OperatingHourDay[],
): Promise<OperatingHoursResponse> {
  const { data } = await apiClient.put<OperatingHoursResponse>(PATHS.operatingHours, { schedule })
  return data
}

/** GET /sellers/me/settings — shop settings (thermal, pickup visibility, auto-confirm). */
export async function getShopSettings(): Promise<ShopSettings> {
  const { data } = await apiClient.get<ShopSettings>(PATHS.shopSettings)
  return data
}

/** PATCH /sellers/me/settings — partial update of shop settings. */
export async function updateShopSettings(patch: Partial<ShopSettings>): Promise<ShopSettings> {
  const { data } = await apiClient.patch<ShopSettings>(PATHS.shopSettings, patch)
  return data
}

/**
 * GET /sellers/me/orders/export — download orders as CSV.
 * Returns the raw Blob so the caller can trigger a browser download.
 */
export async function exportOrders(params?: {
  status?: string
  from?: string
  to?: string
  format?: 'csv'
}): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(PATHS.ordersExport, {
    params,
    responseType: 'blob',
  })
  return data
}

/** GET /sellers/me/orders/export/history — list previous export jobs. */
export async function getExportHistory(): Promise<ExportHistoryResponse> {
  const { data } = await apiClient.get<ExportHistoryResponse>(PATHS.ordersExportHistory)
  return data
}

/** GET /sellers/me/return-fee-coverage — platform return-fee coverage summary. */
export async function getReturnFeeCoverage(): Promise<ReturnFeeCoverageResponse> {
  const { data } = await apiClient.get<ReturnFeeCoverageResponse>(PATHS.returnFeeCoverage)
  return data
}

/** GET /sellers/me/non-fulfilment-rate — seller performance KPI. */
export async function getNonFulfilmentRate(): Promise<NonFulfilmentRateResponse> {
  const { data } = await apiClient.get<NonFulfilmentRateResponse>(PATHS.nonFulfilmentRate)
  return data
}
