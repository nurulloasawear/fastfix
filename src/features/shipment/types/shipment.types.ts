// Shipment domain models. Money is integer UZS; IDs are uuid strings.
// `orderId` carries the backend order uuid (used for the real /orders/{id}/ship call);
// `reference` is the human-facing order code shown in the UI (e.g. "#TR-9021").

export type ShipmentStatus = 'preparing' | 'in_transit' | 'delivered'

// Filter set for the list tabs (`all` + the three real statuses).
export type ShipmentStatusFilter = 'all' | ShipmentStatus

export const SHIPMENT_STATUS_FILTERS: ShipmentStatusFilter[] = [
  'all',
  'preparing',
  'in_transit',
  'delivered',
]

export interface Shipment {
  id: string
  orderId: string
  reference: string
  customerName: string
  courierService: string
  trackingNumber: string
  status: ShipmentStatus
  destination: string
  weightKg: number
}

export interface ShipmentSummary {
  all: number
  preparing: number
  in_transit: number
  delivered: number
}

export interface ShipmentListQuery {
  status?: ShipmentStatusFilter
  search?: string
}

export interface ShipmentListResponse {
  shipments: Shipment[]
  total: number
  summary: ShipmentSummary
}

// A shipment that has not yet left the warehouse — the mass-ship candidate pool.
export interface MassShipOrder {
  id: string
  orderId: string
  reference: string
  productName: string
  weightKg: number
}

export interface MassShipListResponse {
  orders: MassShipOrder[]
  total: number
}

// Bulk action the seller performs on the selected rows.
export type MassShipAction = 'print_receipts' | 'hand_to_courier'

export interface MassShipRequest {
  orderIds: string[]
  action: MassShipAction
}

export interface MassShipResponse {
  processed: number
}

// One integrated courier the seller can toggle on/off.
export interface CourierIntegration {
  id: string
  name: string
  description: string
  enabled: boolean
}

export interface ShippingSettings {
  warehouseAddress: string
  couriers: CourierIntegration[]
}
