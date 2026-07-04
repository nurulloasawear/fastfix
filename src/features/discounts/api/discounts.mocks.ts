import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  Discount,
  DiscountListResponse,
  DiscountStatus,
  DiscountSummary,
  DiscountType,
} from '../types/discounts.types'

// One consistent, MUTABLE dataset so create/edit/delete/toggle behave like prod
// in dev. Summary is DERIVED from it — counts never lie.
let DISCOUNTS: Discount[] = [
  { id: '00000000-0000-7000-8000-000000000001', code: 'YOZ2026', type: 'percentage', valuePercent: 20, valueUzs: null, status: 'active', usedCount: 142, usageLimit: 500, expiryDate: '2026-08-31' },
  { id: '00000000-0000-7000-8000-000000000002', code: 'WELCOME10', type: 'fixed', valuePercent: null, valueUzs: 100000, status: 'active', usedCount: 89, usageLimit: null, expiryDate: '2026-12-31' },
  { id: '00000000-0000-7000-8000-000000000003', code: 'BFF50', type: 'percentage', valuePercent: 50, valueUzs: null, status: 'expired', usedCount: 100, usageLimit: 100, expiryDate: '2026-05-01' },
  { id: '00000000-0000-7000-8000-000000000004', code: 'NAVROUZ25', type: 'percentage', valuePercent: 25, valueUzs: null, status: 'active', usedCount: 12, usageLimit: 1000, expiryDate: '2026-07-15' },
  { id: '00000000-0000-7000-8000-000000000005', code: 'WINTER15', type: 'fixed', valuePercent: null, valueUzs: 150000, status: 'expired', usedCount: 45, usageLimit: 45, expiryDate: '2026-02-28' },
]

interface DiscountPayload {
  code: string
  type: DiscountType
  valuePercent: number | null
  valueUzs: number | null
  usageLimit: number | null
  expiryDate: string
}

function summarize(items: Discount[]): DiscountSummary {
  const count = (s: DiscountStatus) => items.filter((d) => d.status === s).length
  return {
    total: items.length,
    active: count('active'),
    expired: count('expired'),
    totalUsed: items.reduce((acc, d) => acc + d.usedCount, 0),
  }
}

export const discountsHandlers = [
  http.get(`${env.apiBaseUrl}/seller/discounts`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') ?? 'all'
    const type = url.searchParams.get('type') ?? 'all'
    const search = (url.searchParams.get('search') ?? '').toLowerCase()

    let items = DISCOUNTS
    if (status !== 'all') items = items.filter((d) => d.status === status)
    if (type !== 'all') items = items.filter((d) => d.type === type)
    if (search) items = items.filter((d) => d.code.toLowerCase().includes(search))

    const body: DiscountListResponse = {
      discounts: items,
      total: items.length,
      summary: summarize(DISCOUNTS),
    }
    return HttpResponse.json(body)
  }),

  http.post(`${env.apiBaseUrl}/seller/discounts`, async ({ request }) => {
    const p = (await request.json()) as DiscountPayload
    const created: Discount = {
      id: crypto.randomUUID(),
      code: p.code,
      type: p.type,
      valuePercent: p.valuePercent,
      valueUzs: p.valueUzs,
      status: 'active',
      usedCount: 0,
      usageLimit: p.usageLimit,
      expiryDate: p.expiryDate,
    }
    DISCOUNTS = [created, ...DISCOUNTS]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.put(`${env.apiBaseUrl}/seller/discounts/:id`, async ({ params, request }) => {
    const p = (await request.json()) as DiscountPayload
    const existing = DISCOUNTS.find((d) => d.id === params.id)
    if (!existing) return HttpResponse.json({ error: 'not_found' }, { status: 404 })
    const updated: Discount = { ...existing, ...p }
    DISCOUNTS = DISCOUNTS.map((d) => (d.id === updated.id ? updated : d))
    return HttpResponse.json(updated)
  }),

  http.delete(`${env.apiBaseUrl}/seller/discounts/:id`, ({ params }) => {
    DISCOUNTS = DISCOUNTS.filter((d) => d.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${env.apiBaseUrl}/seller/discounts/:id/toggle-status`, ({ params }) => {
    const existing = DISCOUNTS.find((d) => d.id === params.id)
    if (!existing) return HttpResponse.json({ error: 'not_found' }, { status: 404 })
    const updated: Discount = {
      ...existing,
      status: existing.status === 'active' ? 'expired' : 'active',
    }
    DISCOUNTS = DISCOUNTS.map((d) => (d.id === updated.id ? updated : d))
    return HttpResponse.json(updated)
  }),
]
