import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  MassShipListResponse,
  MassShipOrder,
  MassShipRequest,
  ShipmentListResponse,
  ShipmentStatus,
  ShipmentSummary,
  ShippingSettings,
} from '../types/shipment.types'

// One consistent, mutable dataset. The real /orders/:id/ship + /deliver routes mutate
// it in place so the list reflects status changes after invalidation. Counts are DERIVED.
let SHIPMENTS = [
  {
    id: 'ship-1',
    orderId: 'order-9021',
    reference: '#TR-9021',
    customerName: 'Anvar Toshpoʻlatov',
    courierService: 'Fargo Express',
    trackingNumber: 'FRG-77312-UZ',
    status: 'in_transit' as ShipmentStatus,
    destination: 'Toshkent sh., Yunusobod t.',
    weightKg: 0.8,
  },
  {
    id: 'ship-2',
    orderId: 'order-8840',
    reference: '#TR-8840',
    customerName: 'Malika Axmedova',
    courierService: 'BTS Cargo',
    trackingNumber: 'BTS-99011-UZ',
    status: 'preparing' as ShipmentStatus,
    destination: 'Samarqand sh., Registon',
    weightKg: 0.6,
  },
  {
    id: 'ship-3',
    orderId: 'order-8712',
    reference: '#TR-8712',
    customerName: 'Dilshod Shukurov',
    courierService: 'Yandex Delivery',
    trackingNumber: 'YNDX-1102-S',
    status: 'delivered' as ShipmentStatus,
    destination: 'Toshkent sh., Chilonzor t.',
    weightKg: 0.2,
  },
  {
    id: 'ship-4',
    orderId: 'order-9104',
    reference: '#TR-9104',
    customerName: 'Nigora Saidova',
    courierService: 'BTS Cargo',
    trackingNumber: 'BTS-31200-UZ',
    status: 'preparing' as ShipmentStatus,
    destination: 'Buxoro sh., Markaz',
    weightKg: 1.2,
  },
]

const PRODUCT_BY_REF: Record<string, string> = {
  '#TR-8840': 'Paxtali kapyushonli sviter (L)',
  '#TR-9104': 'Yugurish poyabzali (Size 42)',
}

let settings: ShippingSettings = {
  warehouseAddress: 'Toshkent shahar, Shayxontohur tumani, Furqat koʻchasi 15-uy',
  couriers: [
    {
      id: 'fargo',
      name: 'Fargo Express',
      description: 'Oʻzbekiston boʻylab 1 sutkada eshikma-eshik yetkazish',
      enabled: true,
    },
    {
      id: 'bts',
      name: 'BTS Cargo',
      description: 'Viloyat markazlaridagi ofislargacha arzon yetkazish',
      enabled: true,
    },
    {
      id: 'yandex',
      name: 'Yandex Delivery',
      description: 'Toshkent ichida tezkor kuryerlik xizmati',
      enabled: false,
    },
  ],
}

function summarize(items: typeof SHIPMENTS): ShipmentSummary {
  const count = (s: ShipmentStatus) => items.filter((x) => x.status === s).length
  return {
    all: items.length,
    preparing: count('preparing'),
    in_transit: count('in_transit'),
    delivered: count('delivered'),
  }
}

function advance(orderId: string, status: ShipmentStatus) {
  SHIPMENTS = SHIPMENTS.map((s) => (s.orderId === orderId ? { ...s, status } : s))
}

const base = `${env.apiBaseUrl}/seller/shipments`

export const shipmentHandlers = [
  http.get(base, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') ?? 'all'
    const search = (url.searchParams.get('search') ?? '').toLowerCase()

    let items = SHIPMENTS
    if (status !== 'all') items = items.filter((s) => s.status === status)
    if (search)
      items = items.filter(
        (s) =>
          s.customerName.toLowerCase().includes(search) ||
          s.reference.toLowerCase().includes(search),
      )

    const body: ShipmentListResponse = {
      shipments: items,
      total: items.length,
      summary: summarize(SHIPMENTS),
    }
    return HttpResponse.json(body)
  }),

  // ✅ real routes mocked locally: advance status so the list reacts on invalidation.
  http.post(`${env.apiBaseUrl}/orders/:id/ship`, ({ params }) => {
    advance(String(params.id), 'in_transit')
    return HttpResponse.json({ ok: true })
  }),
  http.post(`${env.apiBaseUrl}/orders/:id/deliver`, ({ params }) => {
    advance(String(params.id), 'delivered')
    return HttpResponse.json({ ok: true })
  }),

  http.get(`${base}/mass-ship`, () => {
    const orders: MassShipOrder[] = SHIPMENTS.filter((s) => s.status === 'preparing').map((s) => ({
      id: s.id,
      orderId: s.orderId,
      reference: s.reference,
      productName: PRODUCT_BY_REF[s.reference] ?? s.courierService,
      weightKg: s.weightKg,
    }))
    const body: MassShipListResponse = { orders, total: orders.length }
    return HttpResponse.json(body)
  }),

  http.post(`${base}/mass-ship`, async ({ request }) => {
    const body = (await request.json()) as MassShipRequest
    if (body.action === 'hand_to_courier') {
      body.orderIds.forEach((orderId) => advance(orderId, 'in_transit'))
    }
    return HttpResponse.json({ processed: body.orderIds.length })
  }),

  http.get(`${base}/settings`, () => HttpResponse.json(settings)),
  http.put(`${base}/settings`, async ({ request }) => {
    settings = (await request.json()) as ShippingSettings
    return HttpResponse.json(settings)
  }),
]
