// MSW handlers — real backend routes return backend-shaped (snake_case) payloads
// so dev exercises the same mapping code as production.
// [PENDING BACKEND] routes stay at their legacy mock paths.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  BrandListResponse,
  ListingIssuesResponse,
  SizeChartListResponse,
} from '../types/products.types'
import {
  BRANDS,
  ISSUES,
  SIZE_CHARTS,
  BACKEND_PRODUCTS,
  BACKEND_PRODUCT_DETAIL,
} from './products.mock-data'

const BASE = env.apiBaseUrl

export const productsHandlers = [
  // ── ✅ REAL ROUTES (backend-shaped, snake_case) ──────────────────────────────

  // GET /sellers/me/products?status=&q=&sort=&limit=&offset= → {products, total, summary}
  http.get(`${BASE}/sellers/me/products`, ({ request }) => {
    const status = new URL(request.url).searchParams.get('status')
    const filtered = status && status !== 'all'
      ? BACKEND_PRODUCTS.filter((p) => p.status === status)
      : BACKEND_PRODUCTS
    const summary = {
      all: BACKEND_PRODUCTS.length,
      active: BACKEND_PRODUCTS.filter((p) => p.status === 'active').length,
      hidden: BACKEND_PRODUCTS.filter((p) => p.status === 'hidden').length,
      sold_out: BACKEND_PRODUCTS.filter((p) => p.status === 'sold_out').length,
    }
    return HttpResponse.json({ products: filtered, total: summary.all, summary })
  }),

  // GET /catalog/categories → {categories:[{category,count}]}
  // NOTE: must be registered BEFORE /catalog/:id to avoid wrong pattern match
  http.get(`${BASE}/catalog/categories`, () =>
    HttpResponse.json({
      categories: [
        { category: 'Kiyim-kechak > Erkaklar > Yuqori kiyim', count: 4 },
        { category: 'Elektronika > Audio', count: 2 },
        { category: 'Uy jihozlari', count: 1 },
      ],
    }),
  ),

  // GET /catalog/:id → full PDP (backend-shaped)
  http.get(`${BASE}/catalog/:id`, ({ params }) => {
    const found = BACKEND_PRODUCTS.find((p) => p.id === params['id'])
    if (!found) return new HttpResponse(null, { status: 404 })
    const detail = { ...BACKEND_PRODUCT_DETAIL, id: found.id, title: found.title, price_uzs: found.price_uzs, stock: found.stock, status: found.status, image_urls: found.image_urls }
    return HttpResponse.json(detail)
  }),

  // POST /catalog → create product, returns {id}
  http.post(`${BASE}/catalog`, () =>
    HttpResponse.json({ id: `p-${Date.now()}` }, { status: 201 }),
  ),

  // PUT /catalog/:id → update product, returns {id, updated}
  http.put(`${BASE}/catalog/:id`, ({ params }) =>
    HttpResponse.json({ id: params['id'], updated: true }),
  ),

  // DELETE /catalog/:id → soft-hide, returns {id, status:"hidden"}
  http.delete(`${BASE}/catalog/:id`, ({ params }) =>
    HttpResponse.json({ id: params['id'], status: 'hidden' }),
  ),

  // POST /media/upload-url → {key, upload_url, public_url}
  http.post(`${BASE}/media/upload-url`, () =>
    HttpResponse.json({
      key: `products/mock-${Date.now()}.jpg`,
      upload_url: 'https://mock-r2.example.com/upload/mock.jpg?sig=mock',
      public_url: 'https://media.ozb.ac/products/mock.jpg',
    }),
  ),

  // ── [PENDING BACKEND] — legacy mock paths, camelCase client model ────────────

  http.get(`${BASE}/seller/products/listing-issues`, () =>
    HttpResponse.json<ListingIssuesResponse>({ issues: ISSUES, total: ISSUES.length }),
  ),

  http.post(`${BASE}/seller/products/bulk-update`, async ({ request }) => {
    const body = (await request.json()) as { productIds: string[] }
    return HttpResponse.json({ updated: body.productIds.length })
  }),

  http.post(`${BASE}/seller/products/bulk-appeal`, async ({ request }) => {
    const body = (await request.json()) as { productIds: string[] }
    return HttpResponse.json({ submitted: body.productIds.length })
  }),

  http.post(`${BASE}/seller/products/:id/appeal`, () => HttpResponse.json({ ok: true })),

  // Status patch — pending backend route
  http.patch(`${BASE}/seller/products/:id/status`, () => HttpResponse.json({ ok: true })),

  // Backward-compat [PENDING BACKEND] stubs
  http.post(`${BASE}/seller/products/:id/boost`, () => HttpResponse.json({ ok: true })),
  http.post(`${BASE}/seller/products/:id/delist`, () => HttpResponse.json({ ok: true })),
  http.post(`${BASE}/seller/products/:id/copy`, () => HttpResponse.json({ ok: true })),
  http.post(`${BASE}/seller/products/publish`, () => HttpResponse.json({ ok: true }, { status: 201 })),
  http.post(`${BASE}/seller/products/delist`, () => HttpResponse.json({ ok: true }, { status: 201 })),

  // [PENDING BACKEND] brands
  http.get(`${BASE}/seller/product-settings/brands`, () =>
    HttpResponse.json<BrandListResponse>({ brands: BRANDS, total: BRANDS.length }),
  ),
  http.post(`${BASE}/seller/product-settings/brands/register`, () =>
    HttpResponse.json({ ok: true }, { status: 201 }),
  ),

  // [PENDING BACKEND] size charts
  http.get(`${BASE}/seller/product-settings/size-charts`, ({ request }) => {
    const s = (new URL(request.url).searchParams.get('search') ?? '').toLowerCase()
    const items = s ? SIZE_CHARTS.filter((c) => c.name.toLowerCase().includes(s)) : SIZE_CHARTS
    return HttpResponse.json<SizeChartListResponse>({ sizeCharts: items, total: items.length })
  }),
  http.post(`${BASE}/seller/product-settings/size-charts`, () =>
    HttpResponse.json({ ok: true }, { status: 201 }),
  ),
]
