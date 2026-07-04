import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type { Me } from '../types/auth.types'

// Dev mock: OTP code 123456 works (mirrors backend DEV_OTP_CODE); /me returns an
// approved seller so the portal is reachable in MSW mode.
const MOCK_ME: Me = {
  id: 'u_demo',
  phone: '+998901234567',
  full_name: 'Demo Seller',
  username: 'demo_seller',
  language: 'uz',
  is_admin: false,
  modes: ['buyer', 'seller'],
  seller: { id: 's_demo', shop_name: 'Demo Shop', status: 'approved' },
  created_at: '2026-01-01T00:00:00Z',
}

export const authHandlers = [
  http.post(`${env.apiBaseUrl}/auth/request`, () => HttpResponse.json({ sent: true, expires_in: 300 })),
  http.post(`${env.apiBaseUrl}/auth/verify`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { code?: string }
    if (body.code !== '123456') return HttpResponse.json({ error: 'invalid_code' }, { status: 401 })
    return HttpResponse.json({ token: 'mock.jwt.token', user_id: 'u_demo' })
  }),
  http.get(`${env.apiBaseUrl}/me`, () => HttpResponse.json(MOCK_ME)),
  http.put(`${env.apiBaseUrl}/me`, () => HttpResponse.json({ updated: true })),
  http.post(`${env.apiBaseUrl}/sellers/register`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { shop_name?: string }
    return HttpResponse.json({ id: 's_demo', shop_name: body.shop_name ?? 'Demo Shop', status: 'approved' })
  }),
  http.get(`${env.apiBaseUrl}/sellers/me`, () => HttpResponse.json(MOCK_ME.seller)),
]
